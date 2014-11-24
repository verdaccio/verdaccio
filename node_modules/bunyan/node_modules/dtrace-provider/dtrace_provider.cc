#include "dtrace_provider.h"
#include <nan.h>

#include <stdio.h>

namespace node {

  using namespace v8;

  DTraceProvider::DTraceProvider() : ObjectWrap() {
    provider = NULL;
  }
  
  DTraceProvider::~DTraceProvider() {
    usdt_provider_disable(provider);
    usdt_provider_free(provider);
  }

  Persistent<FunctionTemplate> DTraceProvider::constructor_template;
  
  void DTraceProvider::Initialize(Handle<Object> target) {
    NanScope();

    Local<FunctionTemplate> t = NanNew<FunctionTemplate>(DTraceProvider::New);
    t->InstanceTemplate()->SetInternalFieldCount(1);
    t->SetClassName(NanNew<String>("DTraceProvider"));
    NanAssignPersistent(constructor_template, t);

    NODE_SET_PROTOTYPE_METHOD(t, "addProbe", DTraceProvider::AddProbe);
    NODE_SET_PROTOTYPE_METHOD(t, "removeProbe", DTraceProvider::RemoveProbe);
    NODE_SET_PROTOTYPE_METHOD(t, "enable", DTraceProvider::Enable);
    NODE_SET_PROTOTYPE_METHOD(t, "disable", DTraceProvider::Disable);
    NODE_SET_PROTOTYPE_METHOD(t, "fire", DTraceProvider::Fire);

    target->Set(NanNew<String>("DTraceProvider"), t->GetFunction());

    DTraceProbe::Initialize(target);
  }

  NAN_METHOD(DTraceProvider::New) {
    NanScope();
    DTraceProvider *p = new DTraceProvider();
    char module[128];

    p->Wrap(args.This());

    if (args.Length() < 1 || !args[0]->IsString()) {
      NanThrowTypeError("Must give provider name as argument");
      NanReturnUndefined();
    }

    String::Utf8Value name(args[0]->ToString());

    if (args.Length() == 2) {
      if (!args[1]->IsString()) {
        NanThrowTypeError("Must give module name as argument");
        NanReturnUndefined();
      }

      String::Utf8Value mod(args[1]->ToString());
      (void) snprintf(module, sizeof (module), "%s", *mod);
    } else if (args.Length() == 1) {
      // If no module name is provided, develop a synthetic module name based
      // on our address
      (void) snprintf(module, sizeof (module), "mod-%p", p);
    } else {
      NanThrowError("Expected only provider name and module as arguments");
      NanReturnUndefined();
    }

    if ((p->provider = usdt_create_provider(*name, module)) == NULL) {
      NanThrowError("usdt_create_provider failed");
      NanReturnUndefined();
    }

    NanReturnValue(args.This());
  }

  NAN_METHOD(DTraceProvider::AddProbe) {
    NanScope();
    const char *types[USDT_ARG_MAX];

    Handle<Object> obj = args.Holder();
    DTraceProvider *provider = ObjectWrap::Unwrap<DTraceProvider>(obj);

    // create a DTraceProbe object
    Handle<Function> klass =
        NanNew<FunctionTemplate>(DTraceProbe::constructor_template)->GetFunction();
    Handle<Object> pd = klass->NewInstance();

    // store in provider object
    DTraceProbe *probe = ObjectWrap::Unwrap<DTraceProbe>(pd->ToObject());
    obj->Set(args[0]->ToString(), pd);

    // add probe to provider
    for (int i = 0; i < USDT_ARG_MAX; i++) {
      if (i < args.Length() - 1) {
        String::Utf8Value type(args[i + 1]->ToString());

        if (strncmp("json", *type, 4) == 0)
          probe->arguments[i] = new DTraceJsonArgument();
        else if (strncmp("char *", *type, 6) == 0)
          probe->arguments[i] = new DTraceStringArgument();
        else if (strncmp("int", *type, 3) == 0)
          probe->arguments[i] = new DTraceIntegerArgument();
        else
          probe->arguments[i] = new DTraceStringArgument();

        types[i] = strdup(probe->arguments[i]->Type());
        probe->argc++;
      }
    }

    String::Utf8Value name(args[0]->ToString());
    probe->probedef = usdt_create_probe(*name, *name, probe->argc, types);
    usdt_provider_add_probe(provider->provider, probe->probedef);

    for (size_t i = 0; i < probe->argc; i++) {
      free((char *)types[i]);
    }

    NanReturnValue(pd);
  }

  NAN_METHOD(DTraceProvider::RemoveProbe) {
    NanScope();

    Handle<Object> provider_obj = args.Holder();
    DTraceProvider *provider = ObjectWrap::Unwrap<DTraceProvider>(provider_obj);

    Handle<Object> probe_obj = Local<Object>::Cast(args[0]);
    DTraceProbe *probe = ObjectWrap::Unwrap<DTraceProbe>(probe_obj);

    Handle<String> name = NanNew<String>(probe->probedef->name);
    provider_obj->Delete(name);

    if (usdt_provider_remove_probe(provider->provider, probe->probedef) != 0) {
      NanThrowError(usdt_errstr(provider->provider));
      NanReturnUndefined();
    }

    NanReturnValue(NanTrue());
  }

  NAN_METHOD(DTraceProvider::Enable) {
    NanScope();
    DTraceProvider *provider = ObjectWrap::Unwrap<DTraceProvider>(args.Holder());

    if (usdt_provider_enable(provider->provider) != 0) {
      NanThrowError(usdt_errstr(provider->provider));
      NanReturnUndefined();
    }

    NanReturnUndefined();
  }

  NAN_METHOD(DTraceProvider::Disable) {
    NanScope();
    DTraceProvider *provider = ObjectWrap::Unwrap<DTraceProvider>(args.Holder());

    if (usdt_provider_disable(provider->provider) != 0) {
      NanThrowError(usdt_errstr(provider->provider));
      NanReturnUndefined();
    }

    NanReturnUndefined();
  }

  NAN_METHOD(DTraceProvider::Fire) {
    NanScope();

    if (!args[0]->IsString()) {
      NanThrowTypeError("Must give probe name as first argument");
      NanReturnUndefined();
    }

    if (!args[1]->IsFunction()) {
      NanThrowTypeError("Must give probe value callback as second argument");
      NanReturnUndefined();
    }

    Handle<Object> provider = args.Holder();
    Handle<Object> probe = Local<Object>::Cast(provider->Get(args[0]));

    DTraceProbe *p = ObjectWrap::Unwrap<DTraceProbe>(probe);
    if (p == NULL)
      NanReturnUndefined();

    p->_fire(args[1]);

    NanReturnValue(NanTrue());
  }

  extern "C" void
  init(Handle<Object> target) {
    DTraceProvider::Initialize(target);
  }

  NODE_MODULE(DTraceProviderBindings, init)
} // namespace node
