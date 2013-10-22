var util = require('util')
  , utils = require('./utils')

function parse_error_params(params, status, msg) {
	if (typeof(params) === 'string') {
		return {
			msg: params,
			status: status,
		};
	} else if (typeof(params) === 'number') {
		return {
			msg: msg,
			status: params,
		};
	} else if (utils.is_object(params)) {
		if (params.msg == null) params.msg = msg;
		if (params.status == null) params.status = status;
		return params;
	} else {
		return {
			msg: msg,
			status: status,
		};
	}
}

/*
 *   Errors caused by malfunctioned code
 */
var AppError = function(params, constr) {
	Error.captureStackTrace(this, constr || this);
	params = parse_error_params(params, 500, 'Internal server error');
	this.msg = params.msg;
	this.status = params.status;
};
util.inherits(AppError, Error);
AppError.prototype.name = 'Application Error';

/*
 *   Errors caused by wrong request
 */
var UserError = function(params, constr) {
	params = parse_error_params(params, 404, 'The requested resource was not found');
	this.msg = params.msg;
	this.status = params.status;
};
util.inherits(UserError, Error);
UserError.prototype.name = 'User Error';

/*
 *   Mimic filesystem errors
 */
var FSError = function(code) {
	this.code = code;
};
util.inherits(UserError, Error);
UserError.prototype.name = 'FS Error';

module.exports.AppError = AppError;
module.exports.UserError = UserError;
module.exports.FSError = FSError;

