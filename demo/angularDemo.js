/**
 * Created by prandutt on 8/7/2014.
 */

   /*in the run section initialize the logger with the config
   * to view history use loggerService.history()
   * use to loggerService in any service or controller
   * */

var app =angular.module('logTest',['consoleLogger']).run(function (loggerService) {

    loggerService.config(true, {url: 'testUrlHere', toSend: 2})//fatal,error :1 , all:2
    loggerService.error('Error from run')

});

app.controller('demoController',function($scope,loggerService){
    loggerService.debug('this is a debug log');

    try{
        throw new Error('debug error with stack');
    }catch(e){
        loggerService.debug(e)
    }

    loggerService.error('this is a error log');

    try{
        throw new Error('debug error with stack');
    }catch(e){
        loggerService.error(e)

    }



});


app.controller('demoController1',function($scope,loggerService){

    loggerService.fatal('this is a fatal log');

    try{
        throw new Error('debug fatal with stack');
    }catch(e){
        loggerService.fatal(e)
    }


    loggerService.warn('this is a warn log');

    try{
        throw new Error('debug warn with stack');
    }catch(e){
        loggerService.warn(e)
    }
});

app.controller('demoController2', function($scope,loggerService){
    loggerService.history();
})