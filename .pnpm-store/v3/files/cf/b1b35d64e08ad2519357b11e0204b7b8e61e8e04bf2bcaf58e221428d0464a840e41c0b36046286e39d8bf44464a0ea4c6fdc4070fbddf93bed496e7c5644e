'use strict'

const debug = require('debug')('nock.recorder')
const querystring = require('querystring')
const { inspect } = require('util')

const common = require('./common')
const { restoreOverriddenClientRequest } = require('./intercept')

const SEPARATOR = '\n<<<<<<-- cut here -->>>>>>\n'
let recordingInProgress = false
let outputs = []

function getScope(options) {
  const { proto, host, port } = common.normalizeRequestOptions(options)
  return common.normalizeOrigin(proto, host, port)
}

function getMethod(options) {
  return options.method || 'GET'
}

function getBodyFromChunks(chunks, headers) {
  // If we have headers and there is content-encoding it means that the body
  // shouldn't be merged but instead persisted as an array of hex strings so
  // that the response chunks can be mocked one by one.
  if (headers && common.isContentEncoded(headers)) {
    return {
      body: chunks.map(chunk => chunk.toString('hex')),
    }
  }

  const mergedBuffer = Buffer.concat(chunks)

  // The merged buffer can be one of three things:
  // 1. A UTF-8-representable string buffer which represents a JSON object.
  // 2. A UTF-8-representable buffer which doesn't represent a JSON object.
  // 3. A non-UTF-8-representable buffer which then has to be recorded as a hex string.
  const isUtf8Representable = common.isUtf8Representable(mergedBuffer)
  if (isUtf8Representable) {
    const maybeStringifiedJson = mergedBuffer.toString('utf8')
    try {
      return {
        isUtf8Representable,
        body: JSON.parse(maybeStringifiedJson),
      }
    } catch (err) {
      return {
        isUtf8Representable,
        body: maybeStringifiedJson,
      }
    }
  } else {
    return {
      isUtf8Representable,
      body: mergedBuffer.toString('hex'),
    }
  }
}

function generateRequestAndResponseObject({
  req,
  bodyChunks,
  options,
  res,
  dataChunks,
  reqheaders,
}) {
  const { body, isUtf8Representable } = getBodyFromChunks(
    dataChunks,
    res.headers
  )
  options.path = req.path

  return {
    scope: getScope(options),
    method: getMethod(options),
    path: options.path,
    // Is it deliberate that `getBodyFromChunks()` is called a second time?
    body: getBodyFromChunks(bodyChunks).body,
    status: res.statusCode,
    response: body,
    rawHeaders: res.rawHeaders,
    reqheaders: reqheaders || undefined,
    // When content-encoding is enabled, isUtf8Representable is `undefined`,
    // so we explicitly check for `false`.
    responseIsBinary: isUtf8Representable === false,
  }
}

function generateRequestAndResponse({
  req,
  bodyChunks,
  options,
  res,
  dataChunks,
  reqheaders,
}) {
  const requestBody = getBodyFromChunks(bodyChunks).body
  const responseBody = getBodyFromChunks(dataChunks, res.headers).body

  // Remove any query params from options.path so they can be added in the query() function
  let { path } = options
  const queryIndex = req.path.indexOf('?')
  let queryObj = {}
  if (queryIndex !== -1) {
    // Remove the query from the path
    path = path.substring(0, queryIndex)

    const queryStr = req.path.slice(queryIndex + 1)
    queryObj = querystring.parse(queryStr)
  }
  // Always encode the query parameters when recording.
  const encodedQueryObj = {}
  for (const key in queryObj) {
    const formattedPair = common.formatQueryValue(
      key,
      queryObj[key],
      common.percentEncode
    )
    encodedQueryObj[formattedPair[0]] = formattedPair[1]
  }

  const lines = []

  // We want a leading newline.
  lines.push('')

  const scope = getScope(options)
  lines.push(`nock('${scope}', {"encodedQueryParams":true})`)

  const methodName = getMethod(options).toLowerCase()
  if (requestBody) {
    lines.push(`  .${methodName}('${path}', ${JSON.stringify(requestBody)})`)
  } else {
    lines.push(`  .${methodName}('${path}')`)
  }

  Object.entries(reqheaders || {}).forEach(([fieldName, fieldValue]) => {
    const safeName = JSON.stringify(fieldName)
    const safeValue = JSON.stringify(fieldValue)
    lines.push(`  .matchHeader(${safeName}, ${safeValue})`)
  })

  if (queryIndex !== -1) {
    lines.push(`  .query(${JSON.stringify(encodedQueryObj)})`)
  }

  const statusCode = res.statusCode.toString()
  const stringifiedResponseBody = JSON.stringify(responseBody)
  const headers = inspect(res.rawHeaders)
  lines.push(`  .reply(${statusCode}, ${stringifiedResponseBody}, ${headers});`)

  return lines.join('\n')
}

//  This module variable is used to identify a unique recording ID in order to skip
//  spurious requests that sometimes happen. This problem has been, so far,
//  exclusively detected in nock's unit testing where 'checks if callback is specified'
//  interferes with other tests as its t.end() is invoked without waiting for request
//  to finish (which is the point of the test).
let currentRecordingId = 0

const defaultRecordOptions = {
  dont_print: false,
  enable_reqheaders_recording: false,
  logging: console.log,
  output_objects: false,
  use_separator: true,
}

function record(recOptions) {
  //  Trying to start recording with recording already in progress implies an error
  //  in the recording configuration (double recording makes no sense and used to lead
  //  to duplicates in output)
  if (recordingInProgress) {
    throw new Error('Nock recording already in progress')
  }

  recordingInProgress = true

  // Set the new current recording ID and capture its value in this instance of record().
  currentRecordingId = currentRecordingId + 1
  const thisRecordingId = currentRecordingId

  // Originally the parameter was a dont_print boolean flag.
  // To keep the existing code compatible we take that case into account.
  if (typeof recOptions === 'boolean') {
    recOptions = { dont_print: recOptions }
  }

  recOptions = { ...defaultRecordOptions, ...recOptions }

  debug('start recording', thisRecordingId, recOptions)

  const {
    dont_print: dontPrint,
    enable_reqheaders_recording: enableReqHeadersRecording,
    logging,
    output_objects: outputObjects,
    use_separator: useSeparator,
  } = recOptions

  debug(thisRecordingId, 'restoring overridden requests before new overrides')
  //  To preserve backward compatibility (starting recording wasn't throwing if nock was already active)
  //  we restore any requests that may have been overridden by other parts of nock (e.g. intercept)
  //  NOTE: This is hacky as hell but it keeps the backward compatibility *and* allows correct
  //    behavior in the face of other modules also overriding ClientRequest.
  common.restoreOverriddenRequests()
  //  We restore ClientRequest as it messes with recording of modules that also override ClientRequest (e.g. xhr2)
  restoreOverriddenClientRequest()

  //  We override the requests so that we can save information on them before executing.
  common.overrideRequests(function(proto, overriddenRequest, rawArgs) {
    const { options, callback } = common.normalizeClientRequestArgs(...rawArgs)
    const bodyChunks = []

    // Node 0.11 https.request calls http.request -- don't want to record things
    // twice.
    /* istanbul ignore if */
    if (options._recording) {
      return overriddenRequest(options, callback)
    }
    options._recording = true

    const req = overriddenRequest(options, function(res) {
      debug(thisRecordingId, 'intercepting', proto, 'request to record')

      //  We put our 'end' listener to the front of the listener array.
      res.once('end', function() {
        debug(thisRecordingId, proto, 'intercepted request ended')

        let reqheaders
        // Ignore request headers completely unless it was explicitly enabled by the user (see README)
        if (enableReqHeadersRecording) {
          // We never record user-agent headers as they are worse than useless -
          // they actually make testing more difficult without providing any benefit (see README)
          reqheaders = req.getHeaders()
          common.deleteHeadersField(reqheaders, 'user-agent')
        }

        const generateFn = outputObjects
          ? generateRequestAndResponseObject
          : generateRequestAndResponse
        let out = generateFn({
          req,
          bodyChunks,
          options,
          res,
          dataChunks,
          reqheaders,
        })

        debug('out:', out)

        //  Check that the request was made during the current recording.
        //  If it hasn't then skip it. There is no other simple way to handle
        //  this as it depends on the timing of requests and responses. Throwing
        //  will make some recordings/unit tests fail randomly depending on how
        //  fast/slow the response arrived.
        //  If you are seeing this error then you need to make sure that all
        //  the requests made during a single recording session finish before
        //  ending the same recording session.
        if (thisRecordingId !== currentRecordingId) {
          debug('skipping recording of an out-of-order request', out)
          return
        }

        outputs.push(out)

        if (!dontPrint) {
          if (useSeparator) {
            if (typeof out !== 'string') {
              out = JSON.stringify(out, null, 2)
            }
            logging(SEPARATOR + out + SEPARATOR)
          } else {
            logging(out)
          }
        }
      })

      let encoding
      // We need to be aware of changes to the stream's encoding so that we
      // don't accidentally mangle the data.
      const { setEncoding } = res
      res.setEncoding = function(newEncoding) {
        encoding = newEncoding
        return setEncoding.apply(this, arguments)
      }

      const dataChunks = []
      // Replace res.push with our own implementation that stores chunks
      const origResPush = res.push
      res.push = function(data) {
        if (data) {
          if (encoding) {
            data = Buffer.from(data, encoding)
          }
          dataChunks.push(data)
        }

        return origResPush.call(res, data)
      }

      if (callback) {
        callback(res, options, callback)
      } else {
        res.resume()
      }

      debug('finished setting up intercepting')

      // We override both the http and the https modules; when we are
      // serializing the request, we need to know which was called.
      // By stuffing the state, we can make sure that nock records
      // the intended protocol.
      if (proto === 'https') {
        options.proto = 'https'
      }
    })

    const recordChunk = (chunk, encoding) => {
      debug(thisRecordingId, 'new', proto, 'body chunk')
      if (!Buffer.isBuffer(chunk)) {
        chunk = Buffer.from(chunk, encoding)
      }
      bodyChunks.push(chunk)
    }

    const oldWrite = req.write
    req.write = function(chunk, encoding) {
      if (typeof chunk !== 'undefined') {
        recordChunk(chunk, encoding)
        oldWrite.apply(req, arguments)
      } else {
        throw new Error('Data was undefined.')
      }
    }

    // Starting in Node 8, `OutgoingMessage.end()` directly calls an internal
    // `write_` function instead of proxying to the public
    // `OutgoingMessage.write()` method, so we have to wrap `end` too.
    const oldEnd = req.end
    req.end = function(chunk, encoding, callback) {
      debug('req.end')
      if (typeof chunk === 'function') {
        callback = chunk
        chunk = null
      } else if (typeof encoding === 'function') {
        callback = encoding
        encoding = null
      }

      if (chunk) {
        recordChunk(chunk, encoding)
      }
      oldEnd.call(req, chunk, encoding, callback)
    }

    return req
  })
}

// Restore *all* the overridden http/https modules' properties.
function restore() {
  debug(
    currentRecordingId,
    'restoring all the overridden http/https properties'
  )

  common.restoreOverriddenRequests()
  restoreOverriddenClientRequest()
  recordingInProgress = false
}

function clear() {
  outputs = []
}

module.exports = {
  record,
  outputs: () => outputs,
  restore,
  clear,
}
