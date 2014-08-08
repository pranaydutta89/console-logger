var consoleLogger;!function(e){!function(e){e[e.warn=1]="warn",e[e.fatal=2]="fatal",e[e.error=3]="error",e[e.debug=4]="debug",e[e.log=5]="log",e[e.info=6]="info"}(e.logType||(e.logType={}));var t=e.logType,o=function(){function e(){this.browserDetails=window.navigator.userAgent}return e}();e.logWrapperClass=o;var s=function(){function e(){this.toSend=1,this.headers="application/json; charset=utf-8",this.isFramework=!1}return e}();e.sendDataSettings=s;var n=function(){function e(e,t,o){var n=this;this.isJQueryPresent=!1,this.logging=!0,this.showAsHtml=!1,this.sendData=new s,this.logHistory=[],this.error=function(e){var t=n.performCommonJob(e,3);return n.sendDataToService(t),t},this.fatal=function(e){var t=n.performCommonJob(e,2);return n.sendDataToService(t),t},this.debug=function(e){if(n.sendData&&2==n.sendData.toSend){var t=n.performCommonJob(e,4);return n.sendDataToService(t),t}},this.warn=function(e){if(n.sendData&&2==n.sendData.toSend){var t=n.performCommonJob(e,1);return n.sendDataToService(t),t}},"function"==typeof $&&(this.isJQueryPresent=!0),t&&(this.showAsHtml=t),this.logging=e,this.config(o)}return e.prototype.config=function(e){e&&(e.toSend&&(this.sendData.toSend=e.toSend),e.headers&&(this.sendData.headers=e.headers),e.url&&(this.sendData.url=e.url),e.isFramework&&(this.sendData.isFramework=e.isFramework))},e.prototype.performCommonJob=function(e,t){var o=this.messageFormatting(e);return o.messageType=t,this.logHistory.push(o),this.showLog(o),o},e.prototype.messageFormatting=function(e){var t=new o;return t.eventDT=new Date,"object"==typeof e?(t.message=e.message?this.isJQueryPresent?$.trim(e.message):e.message:"NA",t.stack=e.stack?this.isJQueryPresent?$.trim(e.stack):e.stack:"NA"):"string"==typeof e?(t.message=this.isJQueryPresent?$.trim(e):e,t.stack="NA"):(t.message="UnSupported format, logging actual data:"+e,t.stack="NA"),t},e.prototype.showLog=function(e){if(console&&this.logging&&e){var o;switch(o=e.messageType&&5!==e.messageType?"Type:"+t[e.messageType]+"\n\nMessage:"+e.message+"\n\nStack:"+e.stack||"NA\n\nEvent Time:"+e.eventDT:e.message,e.messageType){case 1:console.warn(o);break;case 2:case 3:console.error(o);break;case 6:console.info(o);break;case 4:case 5:console.log(o)}}},e.prototype.showLogAsHtml=function(){var e=document.getElementsByTagName("body")[0],t=document.createElement("div");t.innerHTML="pranay",e.appendChild(t)},e.prototype.getConfig=function(){return this.sendData},e.prototype.sendDataToService=function(e){if(this.sendData&&!this.sendData.isFramework){var t=this;if(this.isJQueryPresent)$.ajax({url:this.sendData.url,method:"POST",contentType:this.sendData.headers,data:JSON.stringify(e)}).done(function(){}).fail(function(e){t.messageManager("AJAX error:"+e.statusText)});else{var o=new XMLHttpRequest;o.open("POST",this.sendData.url),o.setRequestHeader("Content-Type",this.sendData.headers),o.send(JSON.stringify(e)),o.onreadystatechange=function(){(4!=this.readyState||200!=this.status)&&t.messageManager("AJAX error:"+this.statusText)}}}},e.prototype.messageManager=function(e){var t=new o;t.message=e,t.messageType=5,this.showLog(t)},e.prototype.history=function(){if(0==this.logHistory.length)this.messageManager("No activity yet!!");else for(var e in this.logHistory)this.messageManager("Sr No:"+(parseInt(e,10)+1).toString()),this.showLog(this.logHistory[e])},e}();e.logger=n}(consoleLogger||(consoleLogger={}));var consoleLogger;!function(e){e.app=function(){return angular.module("consoleLogger",[]).service(e)}();var t=function(){function t(e){this.$http=e,this.isConfigDone=!1}return t.prototype.config=function(t,o,s){this.isConfigDone=!0,s.isFramework=!0,this.loggerVar=new e.logger(t,o,s)},t.prototype.error=function(e){this.isConfigDone?this.sendDataToService(this.loggerVar.error(e)):this.configNotDone()},t.prototype.debug=function(e){this.isConfigDone?this.sendDataToService(this.loggerVar.debug(e)):this.configNotDone()},t.prototype.fatal=function(e){this.isConfigDone?this.sendDataToService(this.loggerVar.fatal(e)):this.configNotDone()},t.prototype.warn=function(e){this.isConfigDone?this.sendDataToService(this.loggerVar.warn(e)):this.configNotDone()},t.prototype.history=function(){this.isConfigDone?this.loggerVar.history():this.configNotDone()},t.prototype.sendDataToService=function(e){var t=this;this.$http({url:this.loggerVar.getConfig().url,method:"POST",data:JSON.stringify(e),headers:this.loggerVar.getConfig().headers}).then(function(){},function(e){t.loggerVar.messageManager("Ajax Error:"+e)})},t.prototype.configNotDone=function(){this.loggerVar||(this.loggerVar=new e.logger(!0)),this.loggerVar.messageManager("Initial config not done, try doing consoleLogger.config ")},t.$inject=["$http"],t}();e.loggerService=t}(consoleLogger||(consoleLogger={}));