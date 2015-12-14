/*
 * Licensed Materials - Property of IBM
 * (C) Copyright IBM Corp. 2015. All Rights Reserved.
 * US Government Users Restricted Rights - Use, duplication or
 * disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

'use strict';

var _ = require('lodash'),
    logger = require('./logger');

var MODULE_TAG = 'ENV_HELPER';

/**
 * envHelper
 *
 * TODO: I've not *really* thought through how this utility will or should be be
 * used. The main purpose is to have one central place to grab all things
 * 'environment' related. Other 'config' information should also be stored here
 * until we decide on a standard appaach.
 *
 * Also, I think passing appName into this is ugly and may not even be necessary.
 * It's just for log tagging.
 */
var domain = process.env.LOGIN_DOMAIN;

function envHelper(appName) {
    var env = {
        port: process.env.VCAP_APP_PORT || 3000,
        appName: appName,
        get vcap() {
            return this.getVcap();
        },
        get: function(envVar, defaultValue) {
            //If no key is provided, return all environment variables
            if (!envVar) {
                return process.env;
            }
            var envVarField = this[envVar],
                envValue;
            if (envVarField) {
                if (_.isFunction(this[envVar])) {
                    envValue = this[envVar]();
                } else {
                    envValue = this[envVar];
                }
            } else {
                envValue = process.env[envVar];
            }
            return envValue || defaultValue;
        },
        hasVcap: function() {
            //If VCAP_SERVICES has been set than we're on bluemix
            //(or an environment intended to simulate bluemix)
            return !!process.env.VCAP_SERVICES;
        },
        _getVcap: 'VCAP_SERVICES',
        _getVcapApplication: 'VCAP_APPLICATION',
        //TODO: VCAP or other common env var needed
        getVcap: function() {
            var TAG = [MODULE_TAG, appName, 'getVCAP_SERVICES'].join('.');
            var services;
            if (this.hasVcap()) {
                try {
                    services = JSON.parse(process.env.VCAP_SERVICES);
                } catch (ex) {
                    logger.fatal(TAG, 'Error parsing VCAP_SERVICES.', {
                        VCAP_SERVICES: process.env.VCAP_SERVICES
                    });
                    throw ex;
                }
            } else {
                logger.warn(TAG, 'No VCAP_SERVICES to get.', {
                    envVariables: process.env
                });
            }

            return services || false;
        },
        getVcapApplication: function() {
            var TAG = [MODULE_TAG, appName, 'getVcapApplication'].join('.');
            var services;
            if (this.hasVcap()) {
                try {
                    services = JSON.parse(process.env.VCAP_APPLICATION);
                } catch (ex) {
                    logger.fatal(TAG, 'Error parsing VCAP_APPLICATION.', {
                        VCAP_APPLICATION: process.env.VCAP_APPLICATION
                    });
                    throw ex;
                }
            } else {
                logger.warn(TAG, 'No VCAP_APPLICATION to get.', {
                    envVariables: process.env
                });
            }

            return services || false;
        },
        cloudant: function() {
            var options = {
                account: 'b4e0864f-36ef-4dac-8de0-b5383f260770-bluemix',
                password: '72f7442f4e6cf3448939f57b7ef519f2001d2683cd7d2979126d8c9cfa578482'
            };

            if (this.hasVcap()) {
                options = {
                    account: this.get('CLOUDANT_ACCOUNT', 'b4e0864f-36ef-4dac-8de0-b5383f260770-bluemix'),
                    password: this.get('CLOUDANT_PASSWORD', '72f7442f4e6cf3448939f57b7ef519f2001d2683cd7d2979126d8c9cfa578482')
                };
            }

            return options;
        },
       setStartTime: function(){
            process.env['SERVICE_START_TIME'] = Date.now();
        }
    };

    return env;
}

exports = module.exports = envHelper;