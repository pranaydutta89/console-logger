/**
* Created by prandutt on 8/6/2014.
* contract which each logger service have to expose
*/
var consoleLogger;
(function (consoleLogger) {
    /**
    * Created by prandutt on 8/8/2014.
    *
    * utilities function will be here which are different from core library
    */
    (function (utils) {
        (function (browserFeatureCheck) {
            browserFeatureCheck[browserFeatureCheck["sessionStorage"] = 0] = "sessionStorage";
            browserFeatureCheck[browserFeatureCheck["json"] = 1] = "json";
            browserFeatureCheck[browserFeatureCheck["console"] = 2] = "console";
            browserFeatureCheck[browserFeatureCheck["msSaveBlob"] = 3] = "msSaveBlob";
        })(utils.browserFeatureCheck || (utils.browserFeatureCheck = {}));
        var browserFeatureCheck = utils.browserFeatureCheck;

        var utilities = (function () {
            function utilities() {
            }
            utilities.prototype.ieVersion = function () {
                var v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');

                while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i>< ![endif]-->', all[0])
                    ;

                return v > 4 ? v : undefined;
            };

            utilities.prototype.isFeaturePresent = function (feature) {
                switch (feature) {
                    case 0 /* sessionStorage */:
                        //check if session storage is present in browser
                        if (window.sessionStorage && typeof sessionStorage != "undefined")
                            return true;
                        break;

                    case 1 /* json */:
                        //json is present or not
                        if (typeof JSON != "undefined")
                            return true;

                        break;

                    case 2 /* console */:
                        //browser console is there or not
                        if (typeof console != "undefined" || window.console)
                            return true;
                        break;

                    case 3 /* msSaveBlob */:
                        //check is blob saver is present in browser
                        if (window.navigator.msSaveOrOpenBlob)
                            return true;
                        else
                            return false;
                        break;
                }

                return false;
            };

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
*
* this would ne the main core library for logger
* every other service will connect to this library for actions
* like we did it in angular logger every function is executed from here
* except the senddata which is using native angular service
* the advantage is changing here will fix every other dependency
*/
/// <reference path="../dependencies/jquery.d.ts"/>
/// <reference path="interface.ts"/>
/// <reference path="utils.ts"/>
var consoleLogger;
(function (consoleLogger) {
    consoleLogger.utilsClass = new consoleLogger.utils.utilities();
    var utils = consoleLogger.utils;
    (function (logType) {
        //types of log are here
        logType[logType["warn"] = 1] = "warn";
        logType[logType["fatal"] = 2] = "fatal";
        logType[logType["error"] = 3] = "error";
        logType[logType["debug"] = 4] = "debug";
        logType[logType["log"] = 5] = "log";
        logType[logType["info"] = 6] = "info";
    })(consoleLogger.logType || (consoleLogger.logType = {}));
    var logType = consoleLogger.logType;

    (function (errorType) {
        //error types, easy to organize error through this
        errorType[errorType["jsonNotPresent"] = 0] = "jsonNotPresent";
        errorType[errorType["ajaxError"] = 1] = "ajaxError";
        errorType[errorType["historyEmpty"] = 2] = "historyEmpty";
        errorType[errorType["configNotDone"] = 3] = "configNotDone";
    })(consoleLogger.errorType || (consoleLogger.errorType = {}));
    var errorType = consoleLogger.errorType;

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
            //true when we are using any other service to send data like angular etc etc.
            this.isFramework = false;
        }
        return sendDataSettings;
    })();
    consoleLogger.sendDataSettings = sendDataSettings;

    //we need to implement ILogger so that consistency is maintained if we create another logger class like angularLogger.ts
    var logger = (function () {
        //end public functions
        function logger(shouldLog, showAsHtml, sendDataOptions) {
            var _this = this;
            //This is the main core class
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
            //INIT
            if (showAsHtml) {
                this.showAsHtml = showAsHtml;

                //created a download log button
                if (consoleLogger.utilsClass.isFeaturePresent(3 /* msSaveBlob */))
                    this.createDom('<div style="text-align: center"><input type="button" value="Download Log" onclick="consoleLogger.downLoadLog()"/> </div>');
                else
                    this.createDom('<label>Browser does not support BLOB</label>');
            }
            this.logging = shouldLog;
            this.config(sendDataOptions);
        }
        //private functions
        logger.prototype.config = function (sendDataOptions) {
            //all the config part will be done here
            if (sendDataOptions) {
                this.sendData = new sendDataSettings();
                if (sendDataOptions.toSend)
                    this.sendData.toSend = sendDataOptions.toSend;

                if (sendDataOptions.url)
                    this.sendData.url = sendDataOptions.url;

                if (sendDataOptions.isFramework)
                    this.sendData.isFramework = sendDataOptions.isFramework;
            }
        };

        logger.prototype.pushHistoryData = function (logWrapperObj) {
            //use session storage to store and retrieve data if not present then fall back
            if (consoleLogger.utilsClass.isFeaturePresent(0 /* sessionStorage */) && consoleLogger.utilsClass.isFeaturePresent(1 /* json */)) {
                var tempHisArr = [];
                if (window.sessionStorage['logHistory'])
                    tempHisArr = JSON.parse(window.sessionStorage['logHistory']);

                tempHisArr.push(logWrapperObj);
                window.sessionStorage['logHistory'] = JSON.stringify(tempHisArr);
            } else {
                //session storage is not present use the conventional variable type
                this.logHistory.push(logWrapperObj);
            }
        };

        logger.prototype.performCommonJob = function (message, logT) {
            //common jobs which don't require any flag check done here
            var logWarpperObj = this.messageFormatting(message);
            logWarpperObj.messageType = logT;
            this.pushHistoryData(logWarpperObj);
            this.showLog(logWarpperObj);
            this.showLogAsHtml(logWarpperObj);
            return logWarpperObj;
        };

        logger.prototype.messageFormatting = function (mes) {
            //user send a string or a object it is being wrapped here
            var logWarpperObj = new logWrapperClass();
            logWarpperObj.eventDT = new Date();
            if (typeof (mes) === 'object') {
                if (mes.message)
                    logWarpperObj.message = consoleLogger.utilsClass.trim(mes.message);
                else
                    logWarpperObj.message = 'NA';

                if (mes.stack)
                    logWarpperObj.stack = consoleLogger.utilsClass.trim(mes.stack);
                else
                    logWarpperObj.stack = 'NA';
            } else if (typeof (mes) === 'string') {
                logWarpperObj.message = consoleLogger.utilsClass.trim(mes);
                logWarpperObj.stack = 'NA';
            } else {
                //no supported format
                logWarpperObj.message = 'UnSupported format, logging actual data:' + mes;
                logWarpperObj.stack = 'NA';
            }
            return logWarpperObj;
        };

        logger.prototype.showLog = function (mes) {
            //for showing the log to the console
            if (consoleLogger.utilsClass.isFeaturePresent(2 /* console */) && this.logging && mes) {
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
            }
        };

        logger.prototype.downLoadLog = function () {
            var blob = new Blob(['ddd'], {
                type: "text/csv;charset=utf-8;"
            });
            window.navigator.msSaveBlob(blob, 'check.csv');
        };

        logger.prototype.showLogAsHtml = function (mes) {
            //when we want to render log as HTML use this function
            //its not called directly called via showlog()
            //don't use any lib to manipulate the dom
            //since we want to create non dependent lib
            if (this.showAsHtml && mes) {
                if (mes.messageType && mes.messageType !== 5 /* log */)
                    this.createDom('<div style="padding: 2%;text-align: center;font-family: "Bookman", Georgia, "Times New Roman", serif"><strong>Type:</strong>' + logType[mes.messageType] + '<br/><strong>Message:</strong>' + mes.message + '<br/><strong>Stack:</strong>' + mes.stack + '<br/><strong>Event Time:</strong>' + mes.eventDT + '<br/></div><br/>');
                else
                    this.createDom('<div style="padding: 2%;text-align: center;font-family: "Bookman", Georgia, "Times New Roman", serif"><strong>Type:</strong>Log<br/><strong>Message:</strong>' + mes.message + '</div><br/>');
            }
        };

        logger.prototype.createDom = function (data) {
            //appending new dom elements to body
            var root = document.getElementsByTagName('body')[0];
            var parentDiv = document.createElement('div');
            parentDiv.innerHTML = data;
            root.appendChild(parentDiv);
        };

        //end private functions
        //public functions
        logger.prototype.handleError = function (errT, message) {
            switch (errT) {
                case 1 /* ajaxError */:
                    this.messageManager('Ajax Error:' + message || '');
                    break;

                case 0 /* jsonNotPresent */:
                    this.messageManager('Json is undefined ,try including json2/json3 ' + message || '');
                    break;

                case 2 /* historyEmpty */:
                    this.messageManager('No recent activity yet!! ' + message || '');
                    break;

                case 3 /* configNotDone */:
                    this.messageManager('Initial config not done. ' + message || '');
                    break;
            }
        };

        logger.prototype.getConfig = function () {
            return this.sendData;
        };

        logger.prototype.sendDataToService = function (logData) {
            //send data to remote server generic method using xhr
            //this.sendData contains config =
            if (this.sendData && !this.sendData.isFramework) {
                var that = this;
                var xmlhttp = new XMLHttpRequest();
                xmlhttp.open("POST", this.sendData.url);

                var data;
                if (consoleLogger.utilsClass.isFeaturePresent(1 /* json */)) {
                    //try to send data as json
                    xmlhttp.setRequestHeader("Content-Type", 'application/json; charset=utf-8');
                    data = JSON.stringify(logData);
                } else {
                    //if json is not there then send data as form
                    xmlhttp.setRequestHeader("Content-Type", 'application/x-www-form-urlencoded');
                    data = 'message=' + logData.message + '&messageType=' + logData.messageType + '&eventDT=' + logData.eventDT + '&stack=' + logData.stack + '&browserDetails=' + logData.browserDetails;
                }

                xmlhttp.send(data);
                xmlhttp.onreadystatechange = function () {
                    if ((this.readyState != 4 || this.status != 200))
                        that.handleError(1 /* ajaxError */, this.statusText);
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
            //shows us the log history ,does not render as html
            if (consoleLogger.utilsClass.isFeaturePresent(0 /* sessionStorage */) && consoleLogger.utilsClass.isFeaturePresent(1 /* json */)) {
                var tempHis = JSON.parse(window.sessionStorage['logHistory']);
                if (tempHis.length == 0) {
                    this.handleError(2 /* historyEmpty */);
                } else {
                    for (var idx in tempHis) {
                        this.messageManager('Sr No:' + (parseInt(idx, 10) + 1).toString());
                        this.showLog(tempHis[idx]);
                    }
                }
            } else {
                if (this.logHistory.length == 0) {
                    this.handleError(2 /* historyEmpty */);
                } else {
                    for (var idx in this.logHistory) {
                        this.messageManager('Sr No:' + (parseInt(idx, 10) + 1).toString());
                        this.showLog(this.logHistory[idx]);
                    }
                }
            }
        };
        return logger;
    })();
    consoleLogger.logger = logger;
})(consoleLogger || (consoleLogger = {}));
/**
* Created by prandutt on 8/6/2014.
*
* using angular service to log the data and do the functions same as logger
*/
/// <reference path="../dependencies/angular.d.ts"/>
/// <reference path="interface.ts"/>
var consoleLogger;
(function (consoleLogger) {
    consoleLogger.app = function () {
        try  {
            return angular.module('consoleLogger', []).service(consoleLogger);
        } catch (e) {
            //no angular
        }
    }();
    var loggerService = (function () {
        function loggerService($http) {
            this.$http = $http;
            this.isConfigDone = false;
        }
        //Private function's
        loggerService.prototype.configNotDone = function () {
            if (!this.loggerVar)
                this.loggerVar = new consoleLogger.logger(true);
            this.loggerVar.handleError(3 /* configNotDone */);
        };

        //End private function's
        //Public Function's
        loggerService.prototype.config = function (shouldLog, showAsHtml, sendDataOptions) {
            //take the config and pass it to logger.ts
            this.isConfigDone = true;
            sendDataOptions.isFramework = true;
            this.loggerVar = new consoleLogger.logger(shouldLog, showAsHtml, sendDataOptions);
        };

        loggerService.prototype.error = function (message) {
            //implementing the interface and its function
            //call the native logger.ts function only
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
            //for history also config is mandatory
            if (this.isConfigDone) {
                //config done
                this.loggerVar.history();
            } else {
                //initial config not done
                this.configNotDone();
            }
        };
        loggerService.prototype.sendDataToService = function (logData) {
            //using the native $http service to send data
            var that = this;

            var data;
            var header;
            if (consoleLogger.utilsClass.isFeaturePresent(1 /* json */)) {
                //try to send data as json
                header = 'application/json; charset=utf-8';
                data = JSON.stringify(logData);
            } else {
                //if json is not there then send data as form
                header = 'application/x-www-form-urlencoded';
                data = 'message=' + logData.message + '&messageType=' + logData.messageType + '&eventDT=' + logData.eventDT + '&stack=' + logData.stack + '&browserDetails=' + logData.browserDetails;
            }

            this.$http({
                url: this.loggerVar.getConfig().url,
                method: 'POST',
                data: data,
                withCredentials: true,
                headers: {
                    'Content-Type': header
                }
            }).then(function () {
                //success
            }, function (d) {
                //error
                that.loggerVar.handleError(1 /* ajaxError */, d.statusText);
            });
        };

        loggerService.$inject = ['$http'];
        return loggerService;
    })();
    consoleLogger.loggerService = loggerService;
})(consoleLogger || (consoleLogger = {}));
/**
* Created by prandutt on 8/6/2014.
* its jus for the compilation part
* all the dependent js will be referenced here
*/
//files to compile
/// <reference path="logger.ts"/>
/// <reference path="angularLogger.ts"/>
//# sourceMappingURL=logger.js.map
