/**
* Created by prandutt on 7/28/2014.
*/
/// <reference path="../dependencies/jquery.d.ts"/>
var consoleLogger;
(function (consoleLogger) {
    var logWrapper = (function () {
        function logWrapper() {
            this.browserDetails = window.navigator.userAgent;
        }
        return logWrapper;
    })();
    consoleLogger.logWrapper = logWrapper;

    var logger = (function () {
        function logger(shouldLog) {
            this.shouldLog = shouldLog;
            this.logging = false;
            this.logHistory = [];
            this.logging = shouldLog;
        }
        logger.prototype.setAndShowLog = function (mes) {
            var logWarpperObj = new logWrapper();
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
                this.showLog('No recent activity yet!!');
            } else {
                for (var idx in this.logHistory) {
                    this.showLog('Sr No:' + (parseInt(idx, 10) + 1).toString());
                    this.showLog(this.logHistory[idx]);
                }
            }
        };
        logger.prototype.showLog = function (mes) {
            if (console && this.logging && mes) {
                //console is present show them the logs
                var strData = '';
                if (typeof (mes) === 'object') {
                    strData = 'Message:' + mes.message + '\n' + 'Stack:' + mes.stack + '\n\n' + 'Event Time:' + mes.eventDT;
                } else if (typeof (mes) === 'string') {
                    strData = 'Message:' + mes.message;
                } else {
                    //no supported format pass directly
                    strData = 'Unsupported format:' + mes;
                }

                console.log(strData);
            }
        };
        return logger;
    })();
    consoleLogger.logger = logger;
})(consoleLogger || (consoleLogger = {}));
//# sourceMappingURL=logger.js.map
