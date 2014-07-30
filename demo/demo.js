/**
 * Created by prandutt on 7/30/2014.
 */
    /// <reference path="../dist/logger.min/logger.js"/>
var loggerObj = new consoleLogger.logger(false,{url:'aaa',toSend:2});


loggerObj.debugLog('this is a debug log');

try{
    throw new Error('debug error with stack');
}catch(e){
    loggerObj.debugLog(e)
}

loggerObj.errorLog('this is a error log');

try{
    throw new Error('debug error with stack');
}catch(e){
    loggerObj.errorLog(e)

}


loggerObj.fatalLog('this is a fatal log');

try{
    throw new Error('debug fatal with stack');
}catch(e){
    loggerObj.fatalLog(e)
}


loggerObj.warnLog('this is a warn log');

try{
    throw new Error('debug warn with stack');
}catch(e){
    loggerObj.warnLog(e)
}
