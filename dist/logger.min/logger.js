var consoleLogger;!function(e){!function(e){!function(e){e[e.sessionStorage=0]="sessionStorage",e[e.json=1]="json",e[e.console=2]="console"}(e.browserFeatureCheck||(e.browserFeatureCheck={}));var t=(e.browserFeatureCheck,function(){function e(){}return e.prototype.ieVersion=function(){for(var e=3,t=document.createElement("div"),s=t.getElementsByTagName("i");t.innerHTML="<!--[if gt IE "+ ++e+"]><i></i>< ![endif]-->",s[0];);return e>4?e:void 0},e.prototype.isFeaturePresent=function(e){switch(e){case 0:if(window.sessionStorage)return!0;break;case 1:if(JSON)return!0;break;case 2:if(window.console)return!0}return!1},e.prototype.trim=function(e){try{return e.toString().trim()}catch(t){return e.toString().replace(/^\s+|\s+$/gm,"")}},e}());e.utilities=t}(e.utils||(e.utils={}));e.utils}(consoleLogger||(consoleLogger={}));var consoleLogger;!function(e){e.utilsClass=new e.utils.utilities;e.utils;!function(e){e[e.warn=1]="warn",e[e.fatal=2]="fatal",e[e.error=3]="error",e[e.debug=4]="debug",e[e.log=5]="log",e[e.info=6]="info"}(e.logType||(e.logType={}));var t=e.logType;!function(e){e[e.jsonNotPresent=0]="jsonNotPresent",e[e.ajaxError=1]="ajaxError",e[e.historyEmpty=2]="historyEmpty",e[e.configNotDone=3]="configNotDone"}(e.errorType||(e.errorType={}));var s=(e.errorType,function(){function e(){this.browserDetails=window.navigator.userAgent}return e}());e.logWrapperClass=s;var o=function(){function e(){this.toSend=1,this.isFramework=!1}return e}();e.sendDataSettings=o;var r=function(){function r(e,t,s){var o=this;this.logging=!0,this.showAsHtml=!1,this.logHistory=[],this.error=function(e){var t=o.performCommonJob(e,3);return o.sendDataToService(t),t},this.fatal=function(e){var t=o.performCommonJob(e,2);return o.sendDataToService(t),t},this.debug=function(e){var t=o.performCommonJob(e,4);return o.sendData&&2==o.sendData.toSend&&o.sendDataToService(t),t},this.warn=function(e){var t=o.performCommonJob(e,1);return o.sendData&&2==o.sendData.toSend&&o.sendDataToService(t),t},t&&(this.showAsHtml=t),this.logging=e,this.config(s)}return r.prototype.config=function(e){e&&(this.sendData=new o,e.toSend&&(this.sendData.toSend=e.toSend),e.url&&(this.sendData.url=e.url),e.isFramework&&(this.sendData.isFramework=e.isFramework))},r.prototype.pushHistoryData=function(t){if(e.utilsClass.isFeaturePresent(0)){var s=[];window.sessionStorage.logHistory&&(s=JSON.parse(window.sessionStorage.logHistory)),s.push(t),window.sessionStorage.logHistory=JSON.stringify(s)}else this.logHistory.push(t)},r.prototype.performCommonJob=function(e,t){var s=this.messageFormatting(e);return s.messageType=t,this.pushHistoryData(s),this.showLog(s),s},r.prototype.messageFormatting=function(t){var o=new s;return o.eventDT=new Date,"object"==typeof t?(o.message=t.message?e.utilsClass.trim(t.message):"NA",o.stack=t.stack?e.utilsClass.trim(t.stack):"NA"):"string"==typeof t?(o.message=e.utilsClass.trim(t),o.stack="NA"):(o.message="UnSupported format, logging actual data:"+t,o.stack="NA"),o},r.prototype.showLog=function(s){if(e.utilsClass.isFeaturePresent(2)&&this.logging&&s){var o;switch(o=s.messageType&&5!==s.messageType?"Type:"+t[s.messageType]+"\n\nMessage:"+s.message+"\n\nStack:"+s.stack||"NA\n\nEvent Time:"+s.eventDT:s.message,s.messageType){case 1:console.warn(o);break;case 2:case 3:console.error(o);break;case 6:console.info(o);break;case 4:case 5:console.log(o)}this.showLogAsHtml(s)}},r.prototype.showLogAsHtml=function(e){if(this.showAsHtml){var s,o=document.getElementsByTagName("body")[0],r=document.createElement("div");s=e.messageType&&5!==e.messageType?'<div style="padding: 2%;text-align: center;font-family: "Bookman", Georgia, "Times New Roman", serif"><strong>Type:</strong>'+t[e.messageType]+"<br/><strong>Message:</strong>"+e.message+"<br/><strong>Stack:</strong>"+e.stack+"<br/><strong>Event Time:</strong>"+e.eventDT+"<br/></div><br/>":'<div style="padding: 2%;text-align: center;font-family: "Bookman", Georgia, "Times New Roman", serif"><strong>Type:</strong>Log<br/><strong>Message:</strong>'+e.message+"</div><br/>",r.innerHTML=s,o.appendChild(r)}},r.prototype.handleError=function(e,t){switch(e){case 1:this.messageManager("Ajax Error:"+t||"");break;case 0:this.messageManager("Json is undefined ,try including json2/json3 "+t||"");break;case 2:this.messageManager("No recent activity yet!! "+t||"");break;case 3:this.messageManager("Initial config not done. "+t||"")}},r.prototype.getConfig=function(){return this.sendData},r.prototype.sendDataToService=function(t){if(this.sendData&&!this.sendData.isFramework){var s=this,o=new XMLHttpRequest;o.open("POST",this.sendData.url);var r;e.utilsClass.isFeaturePresent(1)?(o.setRequestHeader("Content-Type","application/json; charset=utf-8"),r=JSON.stringify(t)):(o.setRequestHeader("Content-Type","application/x-www-form-urlencoded"),r="message="+t.message+"&messageType="+t.messageType+"&eventDT="+t.eventDT+"&stack="+t.stack+"&browserDetails="+t.browserDetails),o.send(r),o.onreadystatechange=function(){(4!=this.readyState||200!=this.status)&&s.handleError(1,this.statusText)}}},r.prototype.messageManager=function(e){var t=new s;t.message=e,t.messageType=5,this.showLog(t)},r.prototype.history=function(){if(e.utilsClass.isFeaturePresent(0)){var t=JSON.parse(window.sessionStorage.logHistory);if(0==t.length)this.handleError(2);else for(var s in t)this.messageManager("Sr No:"+(parseInt(s,10)+1).toString()),this.showLog(t[s])}else if(0==this.logHistory.length)this.handleError(2);else for(var s in this.logHistory)this.messageManager("Sr No:"+(parseInt(s,10)+1).toString()),this.showLog(this.logHistory[s])},r}();e.logger=r}(consoleLogger||(consoleLogger={}));var consoleLogger;!function(e){e.app=function(){try{return angular.module("consoleLogger",[]).service(e)}catch(t){}}();var t=function(){function t(e){this.$http=e,this.isConfigDone=!1}return t.prototype.configNotDone=function(){this.loggerVar||(this.loggerVar=new e.logger(!0)),this.loggerVar.handleError(3)},t.prototype.config=function(t,s,o){this.isConfigDone=!0,o.isFramework=!0,this.loggerVar=new e.logger(t,s,o)},t.prototype.error=function(e){this.isConfigDone?this.sendDataToService(this.loggerVar.error(e)):this.configNotDone()},t.prototype.debug=function(e){this.isConfigDone?this.sendDataToService(this.loggerVar.debug(e)):this.configNotDone()},t.prototype.fatal=function(e){this.isConfigDone?this.sendDataToService(this.loggerVar.fatal(e)):this.configNotDone()},t.prototype.warn=function(e){this.isConfigDone?this.sendDataToService(this.loggerVar.warn(e)):this.configNotDone()},t.prototype.history=function(){this.isConfigDone?this.loggerVar.history():this.configNotDone()},t.prototype.sendDataToService=function(t){var s,o,r=this;e.utilsClass.isFeaturePresent(1)?(o="application/json; charset=utf-8",s=JSON.stringify(t)):(o="application/x-www-form-urlencoded",s="message="+t.message+"&messageType="+t.messageType+"&eventDT="+t.eventDT+"&stack="+t.stack+"&browserDetails="+t.browserDetails),this.$http({url:this.loggerVar.getConfig().url,method:"POST",data:s,headers:o}).then(function(){},function(e){r.loggerVar.handleError(1,e.statusText)})},t.$inject=["$http"],t}();e.loggerService=t}(consoleLogger||(consoleLogger={}));