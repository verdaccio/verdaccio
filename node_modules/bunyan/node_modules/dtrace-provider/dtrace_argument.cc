#include "dtrace_provider.h"
#include <nan.h>

namespace node {

  using namespace v8;

  // Integer Argument

#ifdef __x86_64__
# define INTMETHOD ToInteger()
#else
# define INTMETHOD ToInt32()
#endif

  void * DTraceIntegerArgument::ArgumentValue(Handle<Value> value) {
    if (value->IsUndefined())
      return 0;
    else
      return (void *)(long) value->INTMETHOD->Value();
  }

  void DTraceIntegerArgument::FreeArgument(void *arg) {
  }

  const char * DTraceIntegerArgument::Type() {
    return "int";
  }

  // String Argument

  void * DTraceStringArgument::ArgumentValue(Handle<Value> value) {
    if (value->IsUndefined())
      return (void *) strdup("undefined");

    String::Utf8Value str(value->ToString());
    return (void *) strdup(*str);
  }

  void DTraceStringArgument::FreeArgument(void *arg) {
    free(arg);
  }

  const char * DTraceStringArgument::Type() {
    return "char *";
  }

  // JSON Argument

  DTraceJsonArgument::DTraceJsonArgument() {
    NanScope();
    Handle<Context> context = NanGetCurrentContext();
    Handle<Object> global = context->Global();
    Handle<Object> l_JSON = global->Get(NanNew<String>("JSON"))->ToObject();
    Handle<Function> l_JSON_stringify
      = Handle<Function>::Cast(l_JSON->Get(NanNew<String>("stringify")));
    NanAssignPersistent(JSON, l_JSON);
    NanAssignPersistent(JSON_stringify, l_JSON_stringify);
  }

  DTraceJsonArgument::~DTraceJsonArgument() {
    NanDisposePersistent(JSON);
    NanDisposePersistent(JSON_stringify);
  }

  void * DTraceJsonArgument::ArgumentValue(Handle<Value> value) {
    NanScope();

    if (value->IsUndefined())
      return (void *) strdup("undefined");

    Handle<Value> args[1];
    args[0] = value;
    Handle<Value> j = NanNew<Function>(JSON_stringify)->Call(
          NanNew<Object>(JSON), 1, args);

    if (*j == NULL)
      return (void *) strdup("{ \"error\": \"stringify failed\" }");

    String::Utf8Value json(j->ToString());
    return (void *) strdup(*json);
  }

  void DTraceJsonArgument::FreeArgument(void *arg) {
    free(arg);
  }

  const char * DTraceJsonArgument::Type() {
    return "char *";
  }

} // namespace node
