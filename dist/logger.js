/**
* Created by prandutt on 8/6/2014.
*/
/**
* Created by prandutt on 7/28/2014.
*/
/// <reference path="../dependencies/jquery.d.ts"/>
/// <reference path="interface.ts"/>
var consoleLogger;
(function (consoleLogger) {
    var logWrapperClass = (function () {
        function logWrapperClass() {
            this.browserDetails = window.navigator.userAgent;
        }
        return logWrapperClass;
    })();
    consoleLogger.logWrapperClass = logWrapperClass;

    var sendDataSettings = (function () {
        function sendDataSettings() {
            //default will to send whole data
            this.toSend = 1;
            this.headers = "application/json; charset=utf-8";
        }
        return sendDataSettings;
    })();
    consoleLogger.sendDataSettings = sendDataSettings;

    var logger = (function () {
        //end public functions
        function logger(shouldLog, sendDataOptions) {
            var _this = this;
            this.logging = true;
            this.sendData = new sendDataSettings();
            this.logHistory = [];
            //end private functions
            //public functions
            this.error = function (message) {
                //in error push to history ,show log and send to server
                var logWarpperObj = _this.messageFormatting(message);
                logWarpperObj.messageType = 'ERROR';
                _this.performCommonJob(logWarpperObj);
                _this.sendDataToService(logWarpperObj);
            };
            this.fatal = function (message) {
                var logWarpperObj = _this.messageFormatting(message);
                logWarpperObj.messageType = 'FATAL';
                _this.performCommonJob(logWarpperObj);
                _this.sendDataToService(logWarpperObj);
            };
            this.debug = function (message) {
                var logWarpperObj = _this.messageFormatting(message);
                logWarpperObj.messageType = 'DEBUG';
                _this.performCommonJob(logWarpperObj);
                if (_this.sendData && _this.sendData.toSend == 2)
                    _this.sendDataToService(logWarpperObj);
            };
            this.warn = function (message) {
                var logWarpperObj = _this.messageFormatting(message);
                logWarpperObj.messageType = 'WARN';
                _this.performCommonJob(logWarpperObj);
                if (_this.sendData && _this.sendData.toSend == 2)
                    _this.sendDataToService(logWarpperObj);
            };
            if (typeof ($) === 'function') {
                this.logging = shouldLog;
                if (sendDataOptions) {
                    if (sendDataOptions.toSend)
                        this.sendData.toSend = sendDataOptions.toSend;

                    if (sendDataOptions.headers)
                        this.sendData.headers = sendDataOptions.headers;

                    if (sendDataOptions.url)
                        this.sendData.url = sendDataOptions.url;
                }
            } else {
                //jQuery is undefined show error to console
                this.messageManager('jQuery is not present');
            }
        }
        //private functions
        logger.prototype.performCommonJob = function (message) {
            this.logHistory.push(message);
            this.showLog(message);
        };
        logger.prototype.messageFormatting = function (mes) {
            var logWarpperObj = new logWrapperClass();
            logWarpperObj.eventDT = new Date();
            if (typeof (mes) === 'object') {
                if (mes.message)
                    logWarpperObj.message = $ ? $.trim(mes.message) : mes.message;
                else
                    logWarpperObj.message = 'NA';

                if (mes.stack)
                    logWarpperObj.stack = $ ? $.trim(mes.stack) : mes.stack;
                else
                    logWarpperObj.stack = 'NA';
            } else if (typeof (mes) === 'string') {
                logWarpperObj.message = $ ? $.trim(mes) : mes;
                logWarpperObj.stack = 'NA';
            } else {
                //no supported format
                logWarpperObj.message = 'UnSupported format, logging actual data:' + mes;
                logWarpperObj.stack = 'NA';
            }
            return logWarpperObj;
        };

        logger.prototype.sendDataToService = function (logData) {
            if (this.sendData) {
                var that = this;
                $.ajax({
                    url: this.sendData.url,
                    method: 'POST',
                    contentType: this.sendData.headers,
                    data: JSON.stringify(logData)
                }).done(function (d) {
                    //sending successful
                }).fail(function (error) {
                    that.messageManager('AJAX error:' + error.statusText);
                });
            }
        };
        logger.prototype.showLog = function (mes) {
            if (console && this.logging && mes) {
                //console is present show them the logs
                var message;
                if (mes.messageType)
                    message = 'Type:' + mes.messageType + '\n\nMessage:' + mes.message + '\n\nStack:' + mes.stack + '\n\nEvent Time:' + mes.eventDT;
                else
                    message = mes.message;

                switch (mes.messageType.toLowerCase()) {
                    case 'warn':
                        console.warn(message);
                        break;
                    case 'fatal':
                    case 'error':
                        console.error(message);
                        break;
                    case 'info':
                        console.info(message);
                        break;
                    case 'debug':
                    case 'log':
                        console.log(message);
                        break;
                }
            }
        };

        logger.prototype.messageManager = function (message) {
            //its basically sysout for user
            var msg = new logWrapperClass();
            msg.message = message;
            msg.messageType = 'log';
            this.showLog(msg);
        };

        logger.prototype.history = function () {
            if (this.logHistory.length == 0) {
                this.messageManager('No activity yet!!');
            } else {
                for (var idx in this.logHistory) {
                    this.messageManager('Sr No:' + (parseInt(idx, 10) + 1).toString());
                    this.showLog(this.logHistory[idx]);
                }
            }
        };
        return logger;
    })();
    consoleLogger.logger = logger;
})(consoleLogger || (consoleLogger = {}));
/**
* Created by prandutt on 8/6/2014.
*/
/// <reference path="../dependencies/angular.d.ts"/>
/// <reference path="interface.ts"/>
var consoleLogger;
(function (consoleLogger) {
    consoleLogger.app = function () {
        return angular.module('consoleLogger', []).service(consoleLogger);
    }();

    var loggerService = (function () {
        function loggerService($http) {
            this.$http = $http;
            this.logging = true;
        }
        loggerService.prototype.config = function (shouldLog, sendDataOptions) {
            this.logging = shouldLog;
            if (sendDataOptions) {
                this.sendData = new consoleLogger.sendDataSettings();
                if (sendDataOptions.toSend)
                    this.sendData.toSend = sendDataOptions.toSend;

                if (sendDataOptions.headers)
                    this.sendData.headers = sendDataOptions.headers;

                if (sendDataOptions.url)
                    this.sendData.url = sendDataOptions.url;
            }
            this.loggerVar = new consoleLogger.logger(this.logging, this.sendData);
        };

        loggerService.prototype.error = function (message) {
            if (this.sendData) {
                //config done
                this.loggerVar.error(message);
            } else {
                //initial config not done
                this.configNotDone();
            }
        };

        loggerService.prototype.debug = function (message) {
            if (this.sendData) {
                //config done
                this.loggerVar.debug(message);
            } else {
                //initial config not done
                this.configNotDone();
            }
        };

        loggerService.prototype.fatal = function (message) {
            if (this.sendData) {
                //config done
                this.loggerVar.fatal(message);
            } else {
                //initial config not done
                this.configNotDone();
            }
        };

        loggerService.prototype.warn = function (message) {
            if (this.sendData) {
                //config done
                this.loggerVar.warn(message);
            } else {
                //initial config not done
                this.configNotDone();
            }
        };

        loggerService.prototype.history = function () {
            if (this.sendData) {
                //config done
                this.loggerVar.history();
            } else {
                //initial config not done
                this.configNotDone();
            }
        };

        loggerService.prototype.configNotDone = function () {
            if (!this.loggerVar)
                this.loggerVar = new consoleLogger.logger(true);
            this.loggerVar.messageManager('Initial config not done, try consoleLogger.config ');
        };
        loggerService.$inject = ['$http'];
        return loggerService;
    })();
    consoleLogger.loggerService = loggerService;
})(consoleLogger || (consoleLogger = {}));
/**
* Created by prandutt on 8/6/2014.
*/
//files to compile
/// <reference path="logger.ts"/>
/// <reference path="angularLogger.ts"/>
//# sourceMappingURL=logger.js.map
