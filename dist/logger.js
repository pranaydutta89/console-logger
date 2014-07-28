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
            var temp = new logWrapper();
            if (typeof (mes) === 'object') {
                if (mes.message)
                    temp.message = $ ? $.trim(mes.message) : mes.message;

                if (mes.stack)
                    temp.stack = $ ? $.trim(mes.stack) : mes.stack;

                temp.eventDT = new Date();
                this.logHistory.push(temp);
                this.showLog(temp);
            } else if (typeof (mes) === 'string') {
                temp.message = $ ? $.trim(mes) : mes;

                temp.stack = '';

                temp.eventDT = new Date();
                this.logHistory.push(temp);
                this.showLog(temp);
            } else {
                //no supported format
                temp.message = 'UnSupported format:' + mes;

                temp.stack = '';

                temp.eventDT = new Date();
                this.logHistory.push(temp);
                this.showLog(temp);
            }
        };

        logger.prototype.showHistory = function () {
            if (this.logHistory.length == 0) {
                this.showLog('No recent activity yet !!');
            } else {
                for (var x in this.logHistory) {
                    this.showLog('Sr No:' + (parseInt(x, 10) + 1).toString());
                    this.showLog(this.logHistory[x]);
                }
            }
        };
        logger.prototype.showLog = function (mes) {
            if (console && this.logging && mes) {
                //console is present show them the logs
                if (typeof (mes) === 'object') {
                    var message = $ ? $.trim(mes.message) : mes.message;

                    var stack;
                    if (mes.stack)
                        stack = $ ? $.trim(mes.stack) : mes.stack;
                    else
                        stack = '';

                    console.log('Message:' + message + '\n' + 'Stack:' + stack + '\n\n' + 'Event Time:' + mes.eventDT);
                } else if (typeof (mes) === 'string') {
                    var message = $ ? $.trim(mes) : mes;
                    console.log('Message:' + message);
                } else {
                    //no supported format pass directly
                    console.log('Unsupported format:' + mes);
                }
            } else {
                //console not supported
            }
        };
        return logger;
    })();
    consoleLogger.logger = logger;
})(consoleLogger || (consoleLogger = {}));
//# sourceMappingURL=logger.js.map
