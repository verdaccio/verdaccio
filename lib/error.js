var util = require('util')
  , utils = require('./utils')

function parse_error_params(params, status, message) {
	if (typeof(params) === 'string') {
		return {
			message: params,
			status: status,
		}
	} else if (typeof(params) === 'number') {
		return {
			message: message,
			status: params,
		}
	} else if (utils.is_object(params)) {
		if (params.message == null) params.message = message
		if (params.status == null) params.status = status
		return params
	} else {
		return {
			message: message,
			status: status,
		}
	}
}

/*
 *   Errors caused by malfunctioned code
 */
var AppError = function(params, constr) {
	Error.captureStackTrace(this, constr || this)
	params = parse_error_params(params, 500, 'Internal server error')
	this.message = params.message
	this.status = params.status
}
util.inherits(AppError, Error)
AppError.prototype.name = 'Application Error'

/*
 *   Errors caused by wrong request
 */
var UserError = function(params, constr) {
	params = parse_error_params(params, 404, 'The requested resource was not found')
	this.message = params.message
	this.status = params.status
}
util.inherits(UserError, Error)
UserError.prototype.name = 'User Error'

/*
 *   Mimic filesystem errors
 */
var FSError = function(code) {
	this.code = code
}
util.inherits(UserError, Error)
UserError.prototype.name = 'FS Error'

module.exports.AppError = AppError
module.exports.UserError = UserError
module.exports.FSError = FSError

