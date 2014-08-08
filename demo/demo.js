/**
 * Created by prandutt on 7/30/2014.
 */
    /// <reference path="../dist/logger.min/logger.js"/>
var loggerObj = new consoleLogger.logger(true,false);//fatal,error :1 , all:2


loggerObj.debug('this is a debug log');

try{
    throw new Error('debug error with stack');
}catch(e){
    loggerObj.debug(e)
}

loggerObj.error('this is a error log');

try{
    throw new Error('debug error with stack');
}catch(e){
    loggerObj.error(e)

}


loggerObj.fatal('this is a fatal log');

try{
    throw new Error('debug fatal with stack');
}catch(e){
    loggerObj.fatal(e)
}


loggerObj.warn('this is a warn log');

try{
    throw new Error('debug warn with stack');
}catch(e){
    loggerObj.warn(e)
}


