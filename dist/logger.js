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
            this.sendInBatchCount = 1;
        }
        return sendDataSettings;
    })();
    consoleLogger.sendDataSettings = sendDataSettings;

    var logger = (function () {
        function logger(shouldLog, sendDataOptions) {
            this.logging = true;
            this.logHistory = [];
            if (typeof ($) === 'function') {
                this.logging = shouldLog;
                if (sendDataOptions)
                    this.sendData = sendDataOptions;
            } else {
                //jQuery is undefined show error to console
                this.messageManager('jQuery is not present');
            }
        }
        logger.prototype.setAndShowLog = function (mes) {
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

            this.logHistory.push(logWarpperObj);
            this.showLog(logWarpperObj);
        };

        logger.prototype.showHistory = function () {
            if (this.logHistory.length == 0) {
                this.messageManager('No recent activity yet!!');
            } else {
                for (var idx in this.logHistory) {
                    this.messageManager('Sr No:' + (parseInt(idx, 10) + 1).toString());
                    this.showLog(this.logHistory[idx]);
                }
            }
        };

        logger.prototype.sendDataToService = function (logHistory) {
            if (this.sendData) {
                // $.ajax()
            }
        };
        logger.prototype.showLog = function (mes) {
            if (console && this.logging && mes) {
                //console is present show them the logs
                console.log('Message:' + mes.message + '\n' + 'Stack:' + mes.stack + '\n\n' + 'Event Time:' + mes.eventDT);
            }
        };

        logger.prototype.messageManager = function (message) {
            //its basically sysout for user
            var msg = new logWrapperClass();
            msg.message = message;
            this.showLog(msg);
        };
        return logger;
    })();
    consoleLogger.logger = logger;
})(consoleLogger || (consoleLogger = {}));
//# sourceMappingURL=logger.js.map
