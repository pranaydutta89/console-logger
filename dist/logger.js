/**
* Created by prandutt on 8/6/2014.
*/
var consoleLogger;
(function (consoleLogger) {
    /**
    * Created by prandutt on 8/8/2014.
    */
    (function (utils) {
        var utilities = (function () {
            function utilities() {
            }
            utilities.prototype.trim = function (message) {
                try  {
                    return message.toString().trim();
                } catch (e) {
                    return message.toString().replace(/^\s+|\s+$/gm, '');
                }
            };
            return utilities;
        })();
        utils.utilities = utilities;
    })(consoleLogger.utils || (consoleLogger.utils = {}));
    var utils = consoleLogger.utils;
})(consoleLogger || (consoleLogger = {}));
/**
* Created by prandutt on 7/28/2014.
*/
/// <reference path="../dependencies/jquery.d.ts"/>
/// <reference path="interface.ts"/>
/// <reference path="utils.ts"/>
var consoleLogger;
(function (consoleLogger) {
    var utils = new consoleLogger.utils.utilities();
    (function (logType) {
        logType[logType["warn"] = 1] = "warn";
        logType[logType["fatal"] = 2] = "fatal";
        logType[logType["error"] = 3] = "error";
        logType[logType["debug"] = 4] = "debug";
        logType[logType["log"] = 5] = "log";
        logType[logType["info"] = 6] = "info";
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
            //public transport:Array<string>  = ['jquery','xhr'];// how you want to send data
            //for angular it will have its own service to send
            this.isFramework = false;
        }
        return sendDataSettings;
    })();
    consoleLogger.sendDataSettings = sendDataSettings;

    var logger = (function () {
        //end public functions
        function logger(shouldLog, showAsHtml, sendDataOptions) {
            var _this = this;
            this.logging = true;
            this.showAsHtml = false;
            this.logHistory = [];
            this.error = function (message) {
                //in error push to history ,show log and send to server
                var logData = _this.performCommonJob(message, 3 /* error */);
                _this.sendDataToService(logData);
                return logData;
            };
            this.fatal = function (message) {
                var logData = _this.performCommonJob(message, 2 /* fatal */);
                _this.sendDataToService(logData);
                return logData;
            };
            this.debug = function (message) {
                var logData = _this.performCommonJob(message, 4 /* debug */);
                if (_this.sendData && _this.sendData.toSend == 2)
                    _this.sendDataToService(logData);

                return logData;
            };
            this.warn = function (message) {
                var logData = _this.performCommonJob(message, 1 /* warn */);
                if (_this.sendData && _this.sendData.toSend == 2)
                    _this.sendDataToService(logData);

                return logData;
            };
            //checking jQuery presence
            if (showAsHtml)
                this.showAsHtml = showAsHtml;
            this.logging = shouldLog;
            this.config(sendDataOptions);
        }
        //private functions
        logger.prototype.config = function (sendDataOptions) {
            if (sendDataOptions) {
                this.sendData = new sendDataSettings();
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
                    logWarpperObj.message = utils.trim(mes.message);
                else
                    logWarpperObj.message = 'NA';

                if (mes.stack)
                    logWarpperObj.stack = utils.trim(mes.stack);
                else
                    logWarpperObj.stack = 'NA';
            } else if (typeof (mes) === 'string') {
                logWarpperObj.message = utils.trim(mes);
                logWarpperObj.stack = 'NA';
            } else {
                //no supported format
                logWarpperObj.message = 'UnSupported format, logging actual data:' + mes;
                logWarpperObj.stack = 'NA';
            }
            return logWarpperObj;
        };

        logger.prototype.showLog = function (mes) {
            if (console && this.logging && mes) {
                //console is present show them the logs
                var message;
                if (mes.messageType && mes.messageType !== 5 /* log */)
                    message = 'Type:' + logType[mes.messageType] + '\n\nMessage:' + mes.message + '\n\nStack:' + mes.stack || 'NA' + '\n\nEvent Time:' + mes.eventDT;
                else
                    message = mes.message;

                switch (mes.messageType) {
                    case 1 /* warn */:
                        console.warn(message);
                        break;
                    case 2 /* fatal */:
                    case 3 /* error */:
                        console.error(message);
                        break;
                    case 6 /* info */:
                        console.info(message);
                        break;
                    case 4 /* debug */:
                    case 5 /* log */:
                        console.log(message);
                        break;
                }
                this.showLogAsHtml(mes);
            }
        };

        logger.prototype.showLogAsHtml = function (mes) {
            //don't use any lib to manipulate the dom
            //since we want to create non dependent lib
            if (this.showAsHtml) {
                var msg;
                var root = document.getElementsByTagName('body')[0];
                var parentDiv = document.createElement('div');
                if (mes.messageType && mes.messageType !== 5 /* log */)
                    msg = '<div style="padding: 2%;text-align: center;font-family: "Bookman", Georgia, "Times New Roman", serif"><strong>Type:</strong>' + logType[mes.messageType] + '<br/><strong>Message:</strong>' + mes.message + '<br/><strong>Stack:</strong>' + mes.stack + '<br/><strong>Event Time:</strong>' + mes.eventDT + '<br/></div><br/>';
                else
                    msg = '<div style="padding: 2%;text-align: center;font-family: "Bookman", Georgia, "Times New Roman", serif"><strong>Type:</strong>Log<br/><strong>Message:</strong>' + mes.message + '</div><br/>';

                parentDiv.innerHTML = msg;
                root.appendChild(parentDiv);
            }
        };

        //end private functions
        //public functions
        logger.prototype.getConfig = function () {
            return this.sendData;
        };

        logger.prototype.sendDataToService = function (logData) {
            if (this.sendData && !this.sendData.isFramework) {
                //TODO:fallback to xhr if jquery is not present
                var that = this;
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", this.sendData.url);
                xmlhttp.setRequestHeader("Content-Type", this.sendData.headers);
                xmlhttp.send(JSON.stringify(logData));
                xmlhttp.onreadystatechange = function () {
                    if ((this.readyState != 4 || this.status != 200))
                        that.messageManager('AJAX error:' + this.statusText);
                };
            }
        };

        logger.prototype.messageManager = function (message) {
            //its basically sysout for user
            var msg = new logWrapperClass();
            msg.message = message;
            msg.messageType = 5 /* log */;
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
        loggerService.prototype.config = function (shouldLog, showAsHtml, sendDataOptions) {
            this.isConfigDone = true;
            sendDataOptions.isFramework = true;
            this.loggerVar = new consoleLogger.logger(shouldLog, showAsHtml, sendDataOptions);
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
            var that = this;
            this.$http({
                url: this.loggerVar.getConfig().url,
                method: 'POST',
                data: JSON.stringify(logData),
                headers: this.loggerVar.getConfig().headers
            }).then(function () {
                //success
            }, function (d) {
                //error
                that.loggerVar.messageManager('Ajax Error:' + d);
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
