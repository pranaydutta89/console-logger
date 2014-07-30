var consoleLogger;!function(e){var t=function(){function e(){this.browserDetails=window.navigator.userAgent}return e}();e.logWrapperClass=t;var o=function(){function e(){this.toSend=1}return e}();e.sendDataSettings=o;var s=function(){function e(e,t){var o=this;this.logging=!0,this.logHistory=[],this.errorLog=function(e){var t=o.messageFormatting(e);t.messageType="ERROR",o.performCommonJob(t),o.sendDataToService(t)},this.fatalLog=function(e){var t=o.messageFormatting(e);t.messageType="FATAL",o.performCommonJob(t),o.sendDataToService(t)},this.debugLog=function(e){var t=o.messageFormatting(e);t.messageType="DEBUG",o.performCommonJob(t),2==o.sendData.toSend&&o.sendDataToService(t)},this.warnLog=function(e){var t=o.messageFormatting(e);t.messageType="WARN",o.performCommonJob(t),2==o.sendData.toSend&&o.sendDataToService(t)},"function"==typeof $?(this.logging=e,t&&(this.sendData=t)):this.messageManager("jQuery is not present")}return e.prototype.performCommonJob=function(e){this.logHistory.push(e),this.showLog(e)},e.prototype.messageFormatting=function(e){var o=new t;return o.eventDT=new Date,"object"==typeof e?(o.message=e.message?$?$.trim(e.message):e.message:"NA",o.stack=e.stack?$?$.trim(e.stack):e.stack:"NA"):"string"==typeof e?(o.message=$?$.trim(e):e,o.stack="NA"):(o.message="UnSupported format, logging actual data:"+e,o.stack="NA"),o},e.prototype.sendDataToService=function(e){if(this.sendData){var t=this;$.ajax({url:this.sendData.url,method:"POST",data:e}).done(function(){}).fail(function(e){t.messageManager("AJAX error:"+e)})}},e.prototype.showLog=function(e){console&&this.logging&&e&&console.log("Type:"+e.messageType+"\n\nMessage:"+e.message+"\n\nStack:"+e.stack+"\n\nEvent Time:"+e.eventDT)},e.prototype.messageManager=function(e){var o=new t;o.message=e,this.showLog(o)},e.prototype.history=function(){if(0==this.logHistory.length)this.messageManager("No activity yet!!");else for(var e in this.logHistory)this.messageManager("Sr No:"+(parseInt(e,10)+1).toString()),this.showLog(this.logHistory[e])},e}();e.logger=s}(consoleLogger||(consoleLogger={}));