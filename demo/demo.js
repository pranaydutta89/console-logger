/**
 * Created by prandutt on 7/30/2014.
 */
    /// <reference path="../dist/logger.min/logger.js"/>
/*var loggerObj = new consoleLogger.logger(true,{url:'testUrlHere',toSend:2});


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
*/

var app =angular.module('logTest',['consoleLogger']).run(function (loggerService) {

        loggerService.config(true, {url: 'testUrlHere', toSend: 2})
        loggerService.error('show me error')

});

app.controller('demoController',function($scope,loggerService){
    loggerService.error('show me error1')
});