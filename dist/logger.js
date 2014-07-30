/**
* Created by prandutt on 7/28/2014.
*/
/// <reference path="../dependencies/jquery.d.ts"/>
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
            //by default we will send fatal and error to server
            this.toSend = 1;
        }
        return sendDataSettings;
    })();
    consoleLogger.sendDataSettings = sendDataSettings;

    var logger = (function () {
        //end public functions
        function logger(shouldLog, sendDataOptions) {
            var _this = this;
            this.logging = true;
            this.logHistory = [];
            //end private functions
            //public functions
            this.errorLog = function (message) {
                //in error push to history ,show log and send to server
                var logWarpperObj = _this.messageFormatting(message);
                logWarpperObj.messageType = 'ERROR';
                _this.performCommonJob(logWarpperObj);
                _this.sendDataToService(logWarpperObj);
            };
            this.fatalLog = function (message) {
                var logWarpperObj = _this.messageFormatting(message);
                logWarpperObj.messageType = 'FATAL';
                _this.performCommonJob(logWarpperObj);
                _this.sendDataToService(logWarpperObj);
            };
            this.debugLog = function (message) {
                var logWarpperObj = _this.messageFormatting(message);
                logWarpperObj.messageType = 'DEBUG';
                _this.performCommonJob(logWarpperObj);
                if (_this.sendData.toSend == 2)
                    _this.sendDataToService(logWarpperObj);
            };
            this.warnLog = function (message) {
                var logWarpperObj = _this.messageFormatting(message);
                logWarpperObj.messageType = 'WARN';
                _this.performCommonJob(logWarpperObj);
                if (_this.sendData.toSend == 2)
                    _this.sendDataToService(logWarpperObj);
            };
            if (typeof ($) === 'function') {
                this.logging = shouldLog;
                if (sendDataOptions)
                    this.sendData = sendDataOptions;
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
                    data: logData
                }).done(function (d) {
                    //sending successful
                }).fail(function (error, xhr, status) {
                    that.messageManager('AJAX error:' + error);
                });
            }
        };
        logger.prototype.showLog = function (mes) {
            if (console && this.logging && mes) {
                //console is present show them the logs
                console.log('Type:' + mes.messageType + '\n\nMessage:' + mes.message + '\n\nStack:' + mes.stack + '\n\nEvent Time:' + mes.eventDT);
            }
        };

        logger.prototype.messageManager = function (message) {
            //its basically sysout for user
            var msg = new logWrapperClass();
            msg.message = message;
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
//# sourceMappingURL=logger.js.map
