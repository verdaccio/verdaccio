'use strict'

const util = require('util')
const zlib = require('zlib')
const debug = require('debug')('nock.playback_interceptor')
const common = require('./common')
const DelayedBody = require('./delayed_body')

function parseJSONRequestBody(req, requestBody) {
  if (!requestBody || !common.isJSONContent(req.headers)) {
    return requestBody
  }

  if (common.contentEncoding(req.headers, 'gzip')) {
    requestBody = String(zlib.gunzipSync(Buffer.from(requestBody, 'hex')))
  } else if (common.contentEncoding(req.headers, 'deflate')) {
    requestBody = String(zlib.inflateSync(Buffer.from(requestBody, 'hex')))
  }

  return JSON.parse(requestBody)
}

function parseFullReplyResult(response, fullReplyResult) {
  debug('full response from callback result: %j', fullReplyResult)

  if (!Array.isArray(fullReplyResult)) {
    throw Error('A single function provided to .reply MUST return an array')
  }

  if (fullReplyResult.length > 3) {
    throw Error(
      'The array returned from the .reply callback contains too many values'
    )
  }

  const [status, body = '', headers] = fullReplyResult

  if (!Number.isInteger(status)) {
    throw new Error(`Invalid ${typeof status} value for status code`)
  }

  response.statusCode = status
  response.rawHeaders.push(...common.headersInputToRawArray(headers))
  debug('response.rawHeaders after reply: %j', response.rawHeaders)

  return body
}

/**
 * Determine which of the default headers should be added to the response.
 *
 * Don't include any defaults whose case-insensitive keys are already on the response.
 */
function selectDefaultHeaders(existingHeaders, defaultHeaders) {
  if (!defaultHeaders.length) {
    return [] // return early if we don't need to bother
  }

  const definedHeaders = new Set()
  const result = []

  common.forEachHeader(existingHeaders, (_, fieldName) => {
    definedHeaders.add(fieldName.toLowerCase())
  })
  common.forEachHeader(defaultHeaders, (value, fieldName) => {
    if (!definedHeaders.has(fieldName.toLowerCase())) {
      result.push(fieldName, value)
    }
  })

  return result
}

/**
 * Play back an interceptor using the given request and mock response.
 */
function playbackInterceptor({
  req,
  socket,
  options,
  requestBodyString,
  requestBodyIsUtf8Representable,
  response,
  interceptor,
}) {
  function emitError(error) {
    process.nextTick(() => {
      req.emit('error', error)
    })
  }

  function start() {
    interceptor.req = req
    req.headers = req.getHeaders()

    interceptor.scope.emit('request', req, interceptor, requestBodyString)

    if (typeof interceptor.errorMessage !== 'undefined') {
      interceptor.markConsumed()

      let error
      if (typeof interceptor.errorMessage === 'object') {
        error = interceptor.errorMessage
      } else {
        error = new Error(interceptor.errorMessage)
      }
      common.setTimeout(() => emitError(error), interceptor.getTotalDelay())
      return
    }

    // This will be null if we have a fullReplyFunction,
    // in that case status code will be set in `parseFullReplyResult`
    response.statusCode = interceptor.statusCode

    // Clone headers/rawHeaders to not override them when evaluating later
    response.rawHeaders = [...interceptor.rawHeaders]
    debug('response.rawHeaders:', response.rawHeaders)

    if (interceptor.replyFunction) {
      const parsedRequestBody = parseJSONRequestBody(req, requestBodyString)

      let fn = interceptor.replyFunction
      if (fn.length === 3) {
        // Handle the case of an async reply function, the third parameter being the callback.
        fn = util.promisify(fn)
      }

      // At this point `fn` is either a synchronous function or a promise-returning function;
      // wrapping in `Promise.resolve` makes it into a promise either way.
      Promise.resolve(fn.call(interceptor, options.path, parsedRequestBody))
        .then(responseBody => continueWithResponseBody({ responseBody }))
        .catch(err => emitError(err))
      return
    }

    if (interceptor.fullReplyFunction) {
      const parsedRequestBody = parseJSONRequestBody(req, requestBodyString)

      let fn = interceptor.fullReplyFunction
      if (fn.length === 3) {
        fn = util.promisify(fn)
      }

      Promise.resolve(fn.call(interceptor, options.path, parsedRequestBody))
        .then(fullReplyResult => continueWithFullResponse({ fullReplyResult }))
        .catch(err => emitError(err))
      return
    }

    if (
      common.isContentEncoded(interceptor.headers) &&
      !common.isStream(interceptor.body)
    ) {
      //  If the content is encoded we know that the response body *must* be an array
      //  of response buffers which should be mocked one by one.
      //  (otherwise decompressions after the first one fails as unzip expects to receive
      //  buffer by buffer and not one single merged buffer)

      if (interceptor.delayInMs) {
        emitError(
          new Error(
            'Response delay of the body is currently not supported with content-encoded responses.'
          )
        )
        return
      }

      const bufferData = Array.isArray(interceptor.body)
        ? interceptor.body
        : [interceptor.body]
      const responseBuffers = bufferData.map(data => Buffer.from(data, 'hex'))
      continueWithResponseBody({ responseBuffers })
      return
    }

    // If we get to this point, the body is either a string or an object that
    // will eventually be JSON stringified.
    let responseBody = interceptor.body

    // If the request was not UTF8-representable then we assume that the
    // response won't be either. In that case we send the response as a Buffer
    // object as that's what the client will expect.
    if (!requestBodyIsUtf8Representable && typeof responseBody === 'string') {
      // Try to create the buffer from the interceptor's body response as hex.
      responseBody = Buffer.from(responseBody, 'hex')

      // Creating buffers does not necessarily throw errors; check for difference in size.
      if (
        !responseBody ||
        (interceptor.body.length > 0 && responseBody.length === 0)
      ) {
        // We fallback on constructing buffer from utf8 representation of the body.
        responseBody = Buffer.from(interceptor.body, 'utf8')
      }
    }

    return continueWithResponseBody({ responseBody })
  }

  function continueWithFullResponse({ fullReplyResult }) {
    let responseBody
    try {
      responseBody = parseFullReplyResult(response, fullReplyResult)
    } catch (innerErr) {
      emitError(innerErr)
      return
    }

    continueWithResponseBody({ responseBody })
  }

  function continueWithResponseBody({ responseBuffers, responseBody }) {
    //  Transform the response body if it exists (it may not exist
    //  if we have `responseBuffers` instead)
    if (responseBody !== undefined) {
      debug('transform the response body')

      if (interceptor.delayInMs) {
        debug(
          'delaying the response for',
          interceptor.delayInMs,
          'milliseconds'
        )
        // Because setTimeout is called immediately in DelayedBody(), so we
        // need count in the delayConnectionInMs.
        responseBody = new DelayedBody(
          interceptor.getTotalDelay(),
          responseBody
        )
      }

      if (common.isStream(responseBody)) {
        debug('response body is a stream')
        responseBody.pause()
        responseBody.on('data', function(d) {
          response.push(d)
        })
        responseBody.on('end', function() {
          response.push(null)
          // https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_message_complete
          response.complete = true
        })
        responseBody.on('error', function(err) {
          response.emit('error', err)
        })
      } else if (!Buffer.isBuffer(responseBody)) {
        if (typeof responseBody === 'string') {
          responseBody = Buffer.from(responseBody)
        } else {
          responseBody = JSON.stringify(responseBody)
          response.rawHeaders.push('Content-Type', 'application/json')
        }
      }
      // Why are strings converted to a Buffer, but JSON data is left as a string?
      // Related to https://github.com/nock/nock/issues/1542 ?
    }

    interceptor.markConsumed()

    if (req.aborted) {
      return
    }

    response.rawHeaders.push(
      ...selectDefaultHeaders(
        response.rawHeaders,
        interceptor.scope._defaultReplyHeaders
      )
    )

    // Evaluate functional headers.
    common.forEachHeader(response.rawHeaders, (value, fieldName, i) => {
      if (typeof value === 'function') {
        response.rawHeaders[i + 1] = value(req, response, responseBody)
      }
    })

    response.headers = common.headersArrayToObject(response.rawHeaders)

    process.nextTick(() =>
      respondUsingInterceptor({
        responseBody,
        responseBuffers,
      })
    )
  }

  function respondUsingInterceptor({ responseBody, responseBuffers }) {
    if (req.aborted) {
      return
    }

    function respond() {
      if (req.aborted) {
        return
      }

      debug('emitting response')
      req.emit('response', response)

      if (common.isStream(responseBody)) {
        debug('resuming response stream')
        responseBody.resume()
      } else {
        responseBuffers = responseBuffers || []
        if (typeof responseBody !== 'undefined') {
          debug('adding body to buffer list')
          responseBuffers.push(responseBody)
        }

        // Stream the response chunks one at a time.
        common.setImmediate(function emitChunk() {
          const chunk = responseBuffers.shift()

          if (chunk) {
            debug('emitting response chunk')
            response.push(chunk)
            common.setImmediate(emitChunk)
          } else {
            debug('ending response stream')
            response.push(null)
            // https://nodejs.org/dist/latest-v10.x/docs/api/http.html#http_message_complete
            response.complete = true
            interceptor.scope.emit('replied', req, interceptor)
          }
        })
      }
    }

    if (interceptor.socketDelayInMs && interceptor.socketDelayInMs > 0) {
      socket.applyDelay(interceptor.socketDelayInMs)
    }

    if (
      interceptor.delayConnectionInMs &&
      interceptor.delayConnectionInMs > 0
    ) {
      socket.applyDelay(interceptor.delayConnectionInMs)
      common.setTimeout(respond, interceptor.delayConnectionInMs)
    } else {
      respond()
    }
  }

  start()
}

module.exports = { playbackInterceptor }
