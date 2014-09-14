/* Node.js Crypt(3) implementation */

#include <node.h>
#include <v8.h>
#include <errno.h>
#include <unistd.h>		// for crypt if _XOPEN_SOURCE exists
#include <nan.h>

using namespace v8;

NAN_METHOD(Method) {
	NanScope();

	if (args.Length() < 2) {
		return NanThrowTypeError("Wrong number of arguments");
	}

	if (!args[0]->IsString() || !args[1]->IsString()) {
		return NanThrowTypeError("Wrong arguments");
	}

	v8::String::Utf8Value key(args[0]->ToString());
	v8::String::Utf8Value salt(args[1]->ToString());

	char* res = crypt(*key, *salt);
	if (res != NULL) {
		NanReturnValue(NanNew<String>(res));
	} else {
		return NanThrowError(node::ErrnoException(errno, "crypt"));
	}
}

void init(Handle<Object> exports) {
	exports->Set(NanNew<String>("crypt"), NanNew<FunctionTemplate>(Method)->GetFunction());
}

NODE_MODULE(crypt3, init)

/* EOF */
