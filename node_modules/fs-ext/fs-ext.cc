// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

#include <node.h>
#include <fcntl.h>
#include <errno.h>
#include <stdio.h>
#include <sys/types.h>
#include <stdlib.h>
#include <string.h>
#include <nan.h>

#ifndef _WIN32
#include <sys/file.h>
#include <unistd.h>
#include <utime.h>
#include <sys/statvfs.h>
#endif

#ifdef _WIN32
#include <io.h>
#include <windows.h>
#include <sys/utime.h>
#endif

using namespace v8;
using namespace node;

#define THROW_BAD_ARGS NanThrowTypeError("Bad argument")

struct store_data_t {
  NanCallback *cb;
  int fs_op;  // operation type within this module
  int fd;
  int oper;
  int arg;
  off_t offset;
  struct utimbuf utime_buf;
#ifndef _WIN32
  struct statvfs statvfs_buf;
#endif
  char *path;
  int error;
  int result;
};

#ifndef _WIN32
static Persistent<String> f_namemax_symbol;
static Persistent<String> f_bsize_symbol;
static Persistent<String> f_frsize_symbol;

static Persistent<String> f_blocks_symbol;
static Persistent<String> f_bavail_symbol;
static Persistent<String> f_bfree_symbol;

static Persistent<String> f_files_symbol;
static Persistent<String> f_favail_symbol;
static Persistent<String> f_ffree_symbol;
#endif

#ifdef _WIN32
  #define LOCK_SH 1
  #define LOCK_EX 2
  #define LOCK_NB 4
  #define LOCK_UN 8
#endif

enum
{
  FS_OP_FLOCK,
  FS_OP_SEEK,
  FS_OP_UTIME,
  FS_OP_STATVFS,
  FS_OP_FCNTL,
};

static void EIO_After(uv_work_t *req) {
  NanScope();

  store_data_t *store_data = static_cast<store_data_t *>(req->data);

  // there is always at least one argument. "error"
  int argc = 1;

  // Allocate space for two args: error plus possible additional result
  Local<Value> argv[2];
  Local<Object> statvfs_result;
  // NOTE: This may need to be changed if something returns a -1
  // for a success, which is possible.
  if (store_data->result == -1) {
    // If the request doesn't have a path parameter set.
    argv[0] = ErrnoException(store_data->error);
  } else {
    // error value is empty or null for non-error.
    argv[0] = NanNull();

    switch (store_data->fs_op) {
      // These operations have no data to pass other than "error".
      case FS_OP_FLOCK:
      case FS_OP_UTIME:
        argc = 1;
        break;

      case FS_OP_SEEK:
        argc = 2;
        argv[1] = NanNew<Number>(store_data->offset);
        break;
      case FS_OP_STATVFS:
#ifndef _WIN32
        argc = 2;
        statvfs_result = NanNew<Object>();
        argv[1] = statvfs_result;
        statvfs_result->Set(NanNew<String>(f_namemax_symbol), NanNew<Integer>(store_data->statvfs_buf.f_namemax));
        statvfs_result->Set(NanNew<String>(f_bsize_symbol), NanNew<Integer>(store_data->statvfs_buf.f_bsize));
        statvfs_result->Set(NanNew<String>(f_frsize_symbol), NanNew<Integer>(store_data->statvfs_buf.f_frsize));
        statvfs_result->Set(NanNew<String>(f_blocks_symbol), NanNew<Number>(store_data->statvfs_buf.f_blocks));
        statvfs_result->Set(NanNew<String>(f_bavail_symbol), NanNew<Number>(store_data->statvfs_buf.f_bavail));
        statvfs_result->Set(NanNew<String>(f_bfree_symbol), NanNew<Number>(store_data->statvfs_buf.f_bfree));
        statvfs_result->Set(NanNew<String>(f_files_symbol), NanNew<Number>(store_data->statvfs_buf.f_files));
        statvfs_result->Set(NanNew<String>(f_favail_symbol), NanNew<Number>(store_data->statvfs_buf.f_favail));
        statvfs_result->Set(NanNew<String>(f_ffree_symbol), NanNew<Number>(store_data->statvfs_buf.f_ffree));
#else
        argc = 1;
#endif
        break;
      case FS_OP_FCNTL:
        argc = 2;
        argv[1] = NanNew<Number>(store_data->result);
        break;
      default:
        assert(0 && "Unhandled op type value");
    }
  }

  TryCatch try_catch;

  store_data->cb->Call(argc, argv);

  if (try_catch.HasCaught()) {
    FatalException(try_catch);
  }

  // Dispose of the persistent handle
  delete store_data->cb;
  delete store_data;
  delete req;
}

static void EIO_StatVFS(uv_work_t *req) {
  store_data_t* statvfs_data = static_cast<store_data_t *>(req->data);
  statvfs_data->result = 0;
#ifndef _WIN32  
  struct statvfs *data = &(statvfs_data->statvfs_buf);
  if (statvfs(statvfs_data->path, data)) {
    statvfs_data->result = -1;
  	memset(data, 0, sizeof(struct statvfs));
  };
#endif
  free(statvfs_data->path);	
  ;
}

static void EIO_Seek(uv_work_t *req) {
  store_data_t* seek_data = static_cast<store_data_t *>(req->data);

  off_t offs = lseek(seek_data->fd, seek_data->offset, seek_data->oper);

  if (offs == -1) {
    seek_data->result = -1;
    seek_data->error = errno;
  } else {
    seek_data->offset = offs;
  }

}

static void EIO_Fcntl(uv_work_t *req) {
  store_data_t* data = static_cast<store_data_t *>(req->data);
  int result = data->result = fcntl(data->fd, data->oper, data->arg);
  if (result == -1) {
    data->error = errno;
  }
}

#ifdef _WIN32

static void uv__crt_invalid_parameter_handler(const wchar_t* expression,
    const wchar_t* function, const wchar_t * file, unsigned int line,
    uintptr_t reserved) {
  /* No-op. */
}

#define LK_LEN          0xffff0000

static int _win32_flock(int fd, int oper) {
  OVERLAPPED o;
  HANDLE fh;

  int i = -1;

  fh = (HANDLE)_get_osfhandle(fd);
  if (fh == (HANDLE)-1)
    return -1;
  
  memset(&o, 0, sizeof(o));

  switch(oper) {
  case LOCK_SH:               /* shared lock */
      if (LockFileEx(fh, 0, 0, LK_LEN, 0, &o))
        i = 0;
      break;
  case LOCK_EX:               /* exclusive lock */
      if (LockFileEx(fh, LOCKFILE_EXCLUSIVE_LOCK, 0, LK_LEN, 0, &o))
        i = 0;
      break;
  case LOCK_SH|LOCK_NB:       /* non-blocking shared lock */
      if (LockFileEx(fh, LOCKFILE_FAIL_IMMEDIATELY, 0, LK_LEN, 0, &o))
        i = 0;
      break;
  case LOCK_EX|LOCK_NB:       /* non-blocking exclusive lock */
      if (LockFileEx(fh, LOCKFILE_EXCLUSIVE_LOCK|LOCKFILE_FAIL_IMMEDIATELY,
                     0, LK_LEN, 0, &o))
        i = 0;
      break;
  case LOCK_UN:               /* unlock lock */
      if (UnlockFileEx(fh, 0, LK_LEN, 0, &o))
        i = 0;
      break;
  default:                    /* unknown */
      errno = EINVAL;
      return -1;
  }
  if (i == -1) {
    if (GetLastError() == ERROR_LOCK_VIOLATION)
      errno = WSAEWOULDBLOCK;
    else
      errno = EINVAL;
  }
  return i;
}
#endif

static void EIO_Flock(uv_work_t *req) {
  store_data_t* flock_data = static_cast<store_data_t *>(req->data);

#ifdef _WIN32
  int i = _win32_flock(flock_data->fd, flock_data->oper);
#else
  int i = flock(flock_data->fd, flock_data->oper);
#endif
  
  flock_data->result = i;
  flock_data->error = errno;

}

static NAN_METHOD(Flock) {
  NanScope();

  if (args.Length() < 2 || !args[0]->IsInt32() || !args[1]->IsInt32()) {
    return THROW_BAD_ARGS;
  }

  store_data_t* flock_data = new store_data_t();
  
  flock_data->fs_op = FS_OP_FLOCK;
  flock_data->fd = args[0]->Int32Value();
  flock_data->oper = args[1]->Int32Value();

  if (args[2]->IsFunction()) {
    flock_data->cb = new NanCallback((Local<Function>) args[2].As<Function>());
    uv_work_t *req = new uv_work_t;
    req->data = flock_data;
    uv_queue_work(uv_default_loop(), req, EIO_Flock, (uv_after_work_cb)EIO_After);
    NanReturnUndefined();
  } else {
#ifdef _WIN32
    int i = _win32_flock(flock_data->fd, flock_data->oper);
#else
    int i = flock(flock_data->fd, flock_data->oper);
#endif
    delete flock_data;
    if (i != 0) return NanThrowError(ErrnoException(errno));
    NanReturnUndefined();
  }
}


#ifdef _LARGEFILE_SOURCE
static inline int IsInt64(double x) {
  return x == static_cast<double>(static_cast<int64_t>(x));
}
#endif

#ifndef _LARGEFILE_SOURCE
#define ASSERT_OFFSET(a) \
  if (!(a)->IsUndefined() && !(a)->IsNull() && !(a)->IsInt32()) { \
    return NanThrowTypeError("Not an integer"); \
  }
#define GET_OFFSET(a) ((a)->IsNumber() ? (a)->Int32Value() : -1)
#else
#define ASSERT_OFFSET(a) \
  if (!(a)->IsUndefined() && !(a)->IsNull() && !IsInt64((a)->NumberValue())) { \
    return NanThrowTypeError("Not an integer"); \
  }
#define GET_OFFSET(a) ((a)->IsNumber() ? (a)->IntegerValue() : -1)
#endif

//  fs.seek(fd, position, whence [, callback] )

static NAN_METHOD(Seek) {
  NanScope();

  if (args.Length() < 3 || 
     !args[0]->IsInt32() || 
     !args[2]->IsInt32()) {
    return THROW_BAD_ARGS;
  }

  int fd = args[0]->Int32Value();
  ASSERT_OFFSET(args[1]);
  off_t offs = GET_OFFSET(args[1]);
  int whence = args[2]->Int32Value();

  if ( ! args[3]->IsFunction()) {
    off_t offs_result = lseek(fd, offs, whence);
    if (offs_result == -1) return NanThrowError(ErrnoException(errno));
    NanReturnValue(NanNew<Number>(offs_result));
  }

  store_data_t* seek_data = new store_data_t();

  seek_data->cb = new NanCallback((Local<Function>) args[3].As<Function>());
  seek_data->fs_op = FS_OP_SEEK;
  seek_data->fd = fd;
  seek_data->offset = offs;
  seek_data->oper = whence;

  uv_work_t *req = new uv_work_t;
  req->data = seek_data;
  uv_queue_work(uv_default_loop(), req, EIO_Seek, (uv_after_work_cb)EIO_After);

  NanReturnUndefined();
}

//  fs.fcntl(fd, cmd, [arg])

static NAN_METHOD(Fcntl) {
  NanScope();

  if (args.Length() < 3 ||
     !args[0]->IsInt32() ||
     !args[1]->IsInt32() ||
     !args[2]->IsInt32()) {
    return THROW_BAD_ARGS;
  }

  int fd = args[0]->Int32Value();
  int cmd = args[1]->Int32Value();
  int arg = args[2]->Int32Value();

  if ( ! args[3]->IsFunction()) {
    int result = fcntl(fd, cmd, arg);
    if (result == -1) return ThrowException(ErrnoException(errno));
    NanReturnValue(NanNew<Number>(result));
  }

  store_data_t* data = new store_data_t();

  data->cb = new NanCallback((Local<Function>) args[3].As<Function>());
  data->fs_op = FS_OP_FCNTL;
  data->fd = fd;
  data->oper = cmd;
  data->arg = arg;

  uv_work_t *req = new uv_work_t;
  req->data = data;
  uv_queue_work(uv_default_loop(), req, EIO_Fcntl, (uv_after_work_cb)EIO_After);

  NanReturnUndefined();
}


static void EIO_UTime(uv_work_t *req) {
  store_data_t* utime_data = static_cast<store_data_t *>(req->data);

  off_t i = utime(utime_data->path, &utime_data->utime_buf);
  free( utime_data->path );

  if (i == (off_t)-1) {
    utime_data->result = -1;
    utime_data->error = errno;
  } else {
    utime_data->result = i;
  }
  
}

// Wrapper for utime(2).
//   fs.utime( path, atime, mtime, [callback] )

static NAN_METHOD(UTime) {
  NanScope();

  if (args.Length() < 3 ||
      args.Length() > 4 ||
      !args[0]->IsString() ||
      !args[1]->IsNumber() ||
      !args[2]->IsNumber() ) {
    return THROW_BAD_ARGS;
  }

  String::Utf8Value path(args[0]->ToString());
  time_t atime = args[1]->IntegerValue();
  time_t mtime = args[2]->IntegerValue();

  // Synchronous call needs much less work
  if ( ! args[3]->IsFunction()) {
    struct utimbuf buf;
    buf.actime  = atime;
    buf.modtime = mtime;
    int ret = utime(*path, &buf);
    if (ret != 0) return NanThrowError(ErrnoException(errno, "utime", "", *path));
    NanReturnUndefined();
  }

  store_data_t* utime_data = new store_data_t();

  utime_data->cb = new NanCallback((Local<Function>) args[3].As<Function>());
  utime_data->fs_op = FS_OP_UTIME;
  utime_data->path = strdup(*path);
  utime_data->utime_buf.actime  = atime;
  utime_data->utime_buf.modtime = mtime;

  uv_work_t *req = new uv_work_t;
  req->data = utime_data;
  uv_queue_work(uv_default_loop(), req, EIO_UTime, (uv_after_work_cb)EIO_After);

  NanReturnUndefined();
}

// Wrapper for statvfs(2).
//   fs.statVFS( path, [callback] )

static NAN_METHOD(StatVFS) {
  NanScope();

  if (args.Length() < 1 ||
      !args[0]->IsString() ) {
    return THROW_BAD_ARGS;
  }

  String::Utf8Value path(args[0]->ToString());
  
  // Synchronous call needs much less work
  if (!args[1]->IsFunction()) {
#ifndef _WIN32  
    struct statvfs buf;
    int ret = statvfs(*path, &buf);
    if (ret != 0) return NanThrowError(ErrnoException(errno, "statvfs", "", *path));
    Handle<Object> result = NanNew<Object>();
    result->Set(NanNew<String>(f_namemax_symbol), NanNew<Integer>(buf.f_namemax));
    result->Set(NanNew<String>(f_bsize_symbol), NanNew<Integer>(buf.f_bsize));
    result->Set(NanNew<String>(f_frsize_symbol), NanNew<Integer>(buf.f_frsize));
    
    result->Set(NanNew<String>(f_blocks_symbol), NanNew<Number>(buf.f_blocks));
    result->Set(NanNew<String>(f_bavail_symbol), NanNew<Number>(buf.f_bavail));
    result->Set(NanNew<String>(f_bfree_symbol), NanNew<Number>(buf.f_bfree));
    
    result->Set(NanNew<String>(f_files_symbol), NanNew<Number>(buf.f_files));
    result->Set(NanNew<String>(f_favail_symbol), NanNew<Number>(buf.f_favail));
    result->Set(NanNew<String>(f_ffree_symbol), NanNew<Number>(buf.f_ffree));
    NanReturnValue(result);
#else
    NanReturnUndefined();
#endif
  }

  store_data_t* statvfs_data = new store_data_t();

  statvfs_data->cb = new NanCallback((Local<Function>) args[1].As<Function>());
  statvfs_data->fs_op = FS_OP_STATVFS;
  statvfs_data->path = strdup(*path);

  uv_work_t *req = new uv_work_t;
  req->data = statvfs_data;
  uv_queue_work(uv_default_loop(), req, EIO_StatVFS,(uv_after_work_cb)EIO_After);

  NanReturnUndefined();
}

extern "C" void
init (Handle<Object> target)
{
  NanScope();

#ifdef _WIN32
  _set_invalid_parameter_handler(uv__crt_invalid_parameter_handler);
#endif

#ifdef SEEK_SET
  NODE_DEFINE_CONSTANT(target, SEEK_SET);
#endif

#ifdef SEEK_CUR
  NODE_DEFINE_CONSTANT(target, SEEK_CUR);
#endif

#ifdef SEEK_END
  NODE_DEFINE_CONSTANT(target, SEEK_END);
#endif

#ifdef LOCK_SH
  NODE_DEFINE_CONSTANT(target, LOCK_SH);
#endif

#ifdef LOCK_EX
  NODE_DEFINE_CONSTANT(target, LOCK_EX);
#endif

#ifdef LOCK_NB
  NODE_DEFINE_CONSTANT(target, LOCK_NB);
#endif

#ifdef LOCK_UN
  NODE_DEFINE_CONSTANT(target, LOCK_UN);
#endif

#ifdef F_GETFD
  NODE_DEFINE_CONSTANT(target, F_GETFD);
#endif

#ifdef F_SETFD
  NODE_DEFINE_CONSTANT(target, F_SETFD);
#endif

#ifdef FD_CLOEXEC
  NODE_DEFINE_CONSTANT(target, FD_CLOEXEC);
#endif

  NODE_SET_METHOD(target, "seek", Seek);
  NODE_SET_METHOD(target, "fcntl", Fcntl);
  NODE_SET_METHOD(target, "flock", Flock);
  NODE_SET_METHOD(target, "utime", UTime);
  NODE_SET_METHOD(target, "statVFS", StatVFS);
#ifndef _WIN32
  NanAssignPersistent(f_namemax_symbol, NanNew<String>("f_namemax"));
  NanAssignPersistent(f_bsize_symbol, NanNew<String>("f_bsize"));
  NanAssignPersistent(f_frsize_symbol, NanNew<String>("f_frsize"));
  
  NanAssignPersistent(f_blocks_symbol, NanNew<String>("f_blocks"));
  NanAssignPersistent(f_bavail_symbol, NanNew<String>("f_bavail"));
  NanAssignPersistent(f_bfree_symbol, NanNew<String>("f_bfree"));
  
  NanAssignPersistent(f_files_symbol, NanNew<String>("f_files"));
  NanAssignPersistent(f_favail_symbol, NanNew<String>("f_favail"));
  NanAssignPersistent(f_ffree_symbol, NanNew<String>("f_ffree"));
#endif
}

#if NODE_MODULE_VERSION > 1
  NODE_MODULE(fs_ext, init)
#endif
