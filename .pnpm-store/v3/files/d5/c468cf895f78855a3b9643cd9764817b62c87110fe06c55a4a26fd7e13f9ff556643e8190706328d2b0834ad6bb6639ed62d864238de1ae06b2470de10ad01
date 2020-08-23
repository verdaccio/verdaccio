# http-status-codes

Constants enumerating the HTTP status codes. Based on the [Java Apache HttpStatus API](http://hc.apache.org/httpclient-3.x/apidocs/org/apache/commons/httpclient/HttpStatus.html).

All status codes defined in RFC1945 (HTTP/1.0), RFC2616 (HTTP/1.1), RFC2518 (WebDAV), RFC6585 (Additional HTTP Status Codes), and RFC7538 (Permanent Redirect) are supported.

Completely library agnostic. No dependencies.

## Installation

```console
npm install http-status-codes --save
```

## Usage (express 4.x)

```javascript
var HttpStatus = require('http-status-codes');

response
	.status(HttpStatus.OK)
	.send('ok');

response
	.status(HttpStatus.INTERNAL_SERVER_ERROR)
	.send({
		error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
	});

response
	.status(HttpStatus.getStatusCode('Server Error'))
	.send({
		error: 'Server Error'
	});
```

## Codes

Constant                            | Code  | Status Text
------------------------------------|-------|-----------------------------------
ACCEPTED                            | 202   | Accepted
BAD_GATEWAY                         | 502   | Bad Gateway
BAD_REQUEST                         | 400   | Bad Request
CONFLICT                            | 409   | Conflict
CONTINUE                            | 100   | Continue
CREATED                             | 201   | Created
EXPECTATION_FAILED                  | 417   | Expectation Failed
FAILED_DEPENDENCY                   | 424   | Failed Dependency
FORBIDDEN                           | 403   | Forbidden
GATEWAY_TIMEOUT                     | 504   | Gateway Timeout
GONE                                | 410   | Gone
HTTP_VERSION_NOT_SUPPORTED          | 505   | HTTP Version Not Supported
IM_A_TEAPOT                         | 418   | I'm a teapot
INSUFFICIENT_SPACE_ON_RESOURCE      | 419   | Insufficient Space on Resource
INSUFFICIENT_STORAGE                | 507   | Insufficient Storage
INTERNAL_SERVER_ERROR               | 500   | Server Error
LENGTH_REQUIRED                     | 411   | Length Required
LOCKED                              | 423   | Locked
METHOD_FAILURE                      | 420   | Method Failure
METHOD_NOT_ALLOWED                  | 405   | Method Not Allowed
MOVED_PERMANENTLY                   | 301   | Moved Permanently
MOVED_TEMPORARILY                   | 302   | Moved Temporarily
MULTI_STATUS                        | 207   | Multi-Status
MULTIPLE_CHOICES                    | 300   | Multiple Choices
NETWORK_AUTHENTICATION_REQUIRED     | 511   | Network Authentication Required
NO_CONTENT                          | 204   | No Content
NON_AUTHORITATIVE_INFORMATION       | 203   | Non Authoritative Information
NOT_ACCEPTABLE                      | 406   | Not Acceptable
NOT_FOUND                           | 404   | Not Found
NOT_IMPLEMENTED                     | 501   | Not Implemented
NOT_MODIFIED                        | 304   | Not Modified
OK                                  | 200   | OK
PARTIAL_CONTENT                     | 206   | Partial Content
PAYMENT_REQUIRED                    | 402   | Payment Required
PERMANENT_REDIRECT                  | 308   | Permanent Redirect
PRECONDITION_FAILED                 | 412   | Precondition Failed
PRECONDITION_REQUIRED               | 428   | Precondition Required
PROCESSING                          | 102   | Processing
PROXY_AUTHENTICATION_REQUIRED       | 407   | Proxy Authentication Required
REQUEST_HEADER_FIELDS_TOO_LARGE     | 431   | Request Header Fields Too Large
REQUEST_TIMEOUT                     | 408   | Request Timeout
REQUEST_TOO_LONG                    | 413   | Request Entity Too Large
REQUEST_URI_TOO_LONG                | 414   | Request-URI Too Long
REQUESTED_RANGE_NOT_SATISFIABLE     | 416   | Requested Range Not Satisfiable
RESET_CONTENT                       | 205   | Reset Content
SEE_OTHER                           | 303   | See Other
SERVICE_UNAVAILABLE                 | 503   | Service Unavailable
SWITCHING_PROTOCOLS                 | 101   | Switching Protocols
TEMPORARY_REDIRECT                  | 307   | Temporary Redirect
TOO_MANY_REQUESTS                   | 429   | Too Many Requests
UNAUTHORIZED                        | 401   | Unauthorized
UNPROCESSABLE_ENTITY                | 422   | Unprocessable Entity
UNSUPPORTED_MEDIA_TYPE              | 415   | Unsupported Media Type
USE_PROXY                           | 305   | Use Proxy

## TypeScript

There is an included definition file that adds rules for use, comments, and links to official documentation.

### Usage

Option 1: Full import of package

```typescript
import * as HttpStatus from 'http-status-codes'

response
	.status(HttpStatus.OK)
	.send('ok')

response
	.status(HttpStatus.INTERNAL_SERVER_ERROR)
	.send({
		error: HttpStatus.getStatusText(HttpStatus.INTERNAL_SERVER_ERROR)
	})

response
	.status(HttpStatus.getStatusCode('Server Error'))
	.send({
		error: 'Server Error'
	})
```

Option 2: Selective import

```typescript
import { OK, getStatusText, getStatusCode } from 'http-status-codes'

response
	.status(OK)
	.send(getStatusText(OK))

response
	.status(getStatusCode('Server Error')
	.send('Server Error')
```
