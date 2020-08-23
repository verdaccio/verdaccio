#include "dtrace_provider.h"
#include <nan.h>

namespace node {

  using namespace v8;

  // Integer Argument

#ifdef __x86_64__
# define INTMETHOD int64_t
#else
# define INTMETHOD int32_t
#endif

  void * DTraceIntegerArgument::ArgumentValue(v8::Local<Value> value) {
    if (value->IsUndefined())
      return 0;
    else
      return (void *)(long) Nan::To<INTMETHOD>(value).FromJust();
  }

  void DTraceIntegerArgument::FreeArgument(void *arg) {
  }

  const char * DTraceIntegerArgument::Type() {
    return "int";
  }

  // String Argument

  void * DTraceStringArgument::ArgumentValue(v8::Local<Value> value) {
    if (value->IsUndefined())
      return (void *) strdup("undefined");

    Nan::Utf8String str(value);
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
    Nan::HandleScope scope;
    v8::Local<Context> context = Nan::GetCurrentContext();
    v8::Local<Object> global = context->Global();
    v8::Local<String> json = Nan::New<String>("JSON").ToLocalChecked();
    v8::Local<Object> l_JSON = Nan::To<v8::Object>(global->Get(json)).ToLocalChecked();
    v8::Local<Function> l_JSON_stringify
      = v8::Local<Function>::Cast(l_JSON->Get(Nan::New<String>("stringify").ToLocalChecked()));
    JSON.Reset(l_JSON);
    JSON_stringify.Reset(l_JSON_stringify);
  }

  DTraceJsonArgument::~DTraceJsonArgument() {
    JSON.Reset();
    JSON_stringify.Reset();
  }

  void * DTraceJsonArgument::ArgumentValue(v8::Local<Value> value) {
    Nan::HandleScope scope;

    if (value->IsUndefined())
      return (void *) strdup("undefined");

    v8::Local<Value> info[1];
    info[0] = value;
    v8::Local<Function> cb = Nan::New<Function>(JSON_stringify);
    v8::Local<Object> obj = Nan::New<Object>(JSON);
    Local<Value> j = Nan::Call(cb, obj, 1, info).ToLocalChecked();

    if (*j == NULL)
      return (void *) strdup("{ \"error\": \"stringify failed\" }");

    Nan::Utf8String json(j);
    return (void *) strdup(*json);
  }

  void DTraceJsonArgument::FreeArgument(void *arg) {
    free(arg);
  }

  const char * DTraceJsonArgument::Type() {
    return "char *";
  }

} // namespace node
