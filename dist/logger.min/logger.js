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
    (function (logType) {
        logType[logType["warn"] = 0] = "warn";
        logType[logType["fatal"] = 1] = "fatal";
        logType[logType["error"] = 2] = "error";
        logType[logType["debug"] = 3] = "debug";
        logType[logType["log"] = 4] = "log";
        logType[logType["info"] = 5] = "info";
    })(consoleLogger.logType || (consoleLogger.logType = {}));
    var logType = consoleLogger.logType;

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
            this.transport = ['jquery', 'xhr'];
            //for angular it will have its own service to send
            this.isFramework = false;
        }
        return sendDataSettings;
    })();
    consoleLogger.sendDataSettings = sendDataSettings;

    var logger = (function () {
        //end public functions
        function logger(shouldLog, sendDataOptions) {
            var _this = this;
            this.isJQueryPresent = false;
            this.logging = true;
            this.sendData = new sendDataSettings();
            this.logHistory = [];
            //end private functions
            //public functions
            this.error = function (message) {
                //in error push to history ,show log and send to server
                var logData = _this.performCommonJob(message, 2 /* error */);
                _this.sendDataToService(logData);
                return logData;
            };
            this.fatal = function (message) {
                var logData = _this.performCommonJob(message, 1 /* fatal */);
                _this.sendDataToService(logData);
                return logData;
            };
            this.debug = function (message) {
                if (_this.sendData && _this.sendData.toSend == 2) {
                    var logData = _this.performCommonJob(message, 3 /* debug */);
                    _this.sendDataToService(logData);
                    return logData;
                }
            };
            this.warn = function (message) {
                if (_this.sendData && _this.sendData.toSend == 2) {
                    var logData = _this.performCommonJob(message, 0 /* warn */);
                    _this.sendDataToService(logData);
                    return logData;
                }
            };
            //checking jQuery presence
            if (typeof ($) === 'function')
                this.isJQueryPresent = true;

            this.logging = shouldLog;
            this.config(sendDataOptions);
        }
        //private functions
        logger.prototype.config = function (sendDataOptions) {
            if (sendDataOptions) {
                if (sendDataOptions.toSend)
                    this.sendData.toSend = sendDataOptions.toSend;

                if (sendDataOptions.headers)
                    this.sendData.headers = sendDataOptions.headers;

                if (sendDataOptions.url)
                    this.sendData.url = sendDataOptions.url;

                if (sendDataOptions.isFramework)
                    this.sendData.isFramework = sendDataOptions.isFramework;
            }
        };

        logger.prototype.performCommonJob = function (message, logT) {
            var logWarpperObj = this.messageFormatting(message);
            logWarpperObj.messageType = logT;
            this.logHistory.push(logWarpperObj);
            this.showLog(logWarpperObj);
            return logWarpperObj;
        };

        logger.prototype.messageFormatting = function (mes) {
            var logWarpperObj = new logWrapperClass();
            logWarpperObj.eventDT = new Date();
            if (typeof (mes) === 'object') {
                if (mes.message)
                    logWarpperObj.message = this.isJQueryPresent ? $.trim(mes.message) : mes.message;
                else
                    logWarpperObj.message = 'NA';

                if (mes.stack)
                    logWarpperObj.stack = this.isJQueryPresent ? $.trim(mes.stack) : mes.stack;
                else
                    logWarpperObj.stack = 'NA';
            } else if (typeof (mes) === 'string') {
                logWarpperObj.message = this.isJQueryPresent ? $.trim(mes) : mes;
                logWarpperObj.stack = 'NA';
            } else {
                //no supported format
                logWarpperObj.message = 'UnSupported format, logging actual data:' + mes;
                logWarpperObj.stack = 'NA';
            }
            return logWarpperObj;
        };

        logger.prototype.getConfig = function () {
            return this.sendData;
        };
        logger.prototype.sendDataToService = function (logData) {
            if (this.sendData && !this.sendData.isFramework) {
                //TODO:fallback to xhr if jqquery is not present
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
                    message = 'Type:' + logType[mes.messageType] + '\n\nMessage:' + mes.message + '\n\nStack:' + mes.stack + '\n\nEvent Time:' + mes.eventDT;
                else
                    message = mes.message;

                switch (mes.messageType) {
                    case 0 /* warn */:
                        console.warn(message);
                        break;
                    case 1 /* fatal */:
                    case 2 /* error */:
                        console.error(message);
                        break;
                    case 5 /* info */:
                        console.info(message);
                        break;
                    case 3 /* debug */:
                    case 4 /* log */:
                        console.log(message);
                        break;
                }
            }
        };

        logger.prototype.messageManager = function (message) {
            //its basically sysout for user
            var msg = new logWrapperClass();
            msg.message = message;
            msg.messageType = 4 /* log */;
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
            this.isConfigDone = false;
        }
        loggerService.prototype.config = function (shouldLog, sendDataOptions) {
            this.isConfigDone = true;
            sendDataOptions.isFramework = true;
            this.loggerVar = new consoleLogger.logger(shouldLog, sendDataOptions);
        };

        loggerService.prototype.error = function (message) {
            if (this.isConfigDone) {
                //config done
                this.sendDataToService(this.loggerVar.error(message));
            } else {
                //initial config not done
                this.configNotDone();
            }
        };

        loggerService.prototype.debug = function (message) {
            if (this.isConfigDone) {
                //config done
                this.sendDataToService(this.loggerVar.debug(message));
            } else {
                //initial config not done
                this.configNotDone();
            }
        };

        loggerService.prototype.fatal = function (message) {
            if (this.isConfigDone) {
                //config done
                this.sendDataToService(this.loggerVar.fatal(message));
            } else {
                //initial config not done
                this.configNotDone();
            }
        };

        loggerService.prototype.warn = function (message) {
            if (this.isConfigDone) {
                //config done
                this.sendDataToService(this.loggerVar.warn(message));
            } else {
                //initial config not done
                this.configNotDone();
            }
        };

        loggerService.prototype.history = function () {
            if (this.isConfigDone) {
                //config done
                this.loggerVar.history();
            } else {
                //initial config not done
                this.configNotDone();
            }
        };
        loggerService.prototype.sendDataToService = function (logData) {
            this.$http({
                url: this.loggerVar.getConfig().url,
                method: 'POST',
                data: JSON.stringify(logData),
                headers: this.loggerVar.getConfig().headers
            }).then(function () {
                //success
            }, function () {
                //error
            });
        };
        loggerService.prototype.configNotDone = function () {
            if (!this.loggerVar)
                this.loggerVar = new consoleLogger.logger(true);
            this.loggerVar.messageManager('Initial config not done, try doing consoleLogger.config ');
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
