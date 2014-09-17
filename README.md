console-logger
==============

Features 

1) Simple browser console logging <br/>
2) Show log data on your html page <br/>
3) View log history  <br/>
4) Central on/off facility   <br/>
5) Send log data to remote server  <br/>
6) Export data in csv format (only for supported browser's)

Hidden Features:

1) Use as a Angularjs service <br/>
2) No dependency to jQuery or any other library <br/>
3) Uses localStorage of HTML5 if available <br/>
4) Uses JSON and fallbacks to forms in old browsers <br/>
5) CORS supported <br/>
6) almost supported to every available browser <br/>



How to do ? 

1) Init: Let's do some config
  
    var loggerObj = new consoleLogger.logger(); //by default its true 
    
    var loggerObj = new consoleLogger.logger(false); //if don't want to log (eg: in prod)
    
    
    //if you want to log as an html
    
    var loggerObj = new consoleLogger.logger(true,true);
    //second argument is for log as an html, default is false 
    
    /*Note: you can use "on/off" in place of true/false*/

2) Use: one liner's piece of cake !!

  a) DEBUG
    
    loggerObj.debug('this is a debug log');
    //or
    loggerObj.debug(e); //e => error object
 
  
  b) FATAL
  
    loggerObj.fatal('this is a fatal log');
    //or
    loggerObj.fatal(e); //e => error object
 
  
  a) ERROR
 
    loggerObj.error('this is a error log');
    //or
    loggerObj.error(e); //e => error object
  
  
  a) WARN
 
     loggerObj.warn('this is a warn log');
     //or
     loggerObj.warn(e); //e => error object
 
  
3) View log history:  

    loggerObj.history();
  
4) Send Data to server (config): 


    //configure your logger object
   
    var loggerObj = new consoleLogger.logger(true,false,{url:'testUrlHere',toSend:2});
    
    /*second argument is for log as an html
     *third argument is config for sending data for remote server
     *Config example => {url:'testurl',toSend:'1 or 2',headers:'any custom ajax headers default is json'}
     *toSend=1 => send only error and fatal
     *toSend=2 => send all logs
     *even if logging is false then also data will be sent to server
     */

5)  Use As an Angularjs Service  

   a) Register the module dependency and do some configuration
   
    var app =angular.module('logTest',['consoleLogger']).run(function (loggerService) {

    loggerService.config(true, false, {url: 'testUrlHere', toSend: 2})
    /* fatal,error :1 , all:2
     * see point 4 for config options
     */
    loggerService.error('Error from run')
    });
    
    
  b) Use same as point 2 above inside controller or services 
    
    app.controller('demoController',function($scope,loggerService){
    
    loggerService.debug('this is a debug log');
    loggerService.error('this is a error log');
    loggerService.history(); //to see log history
    
    });

6) Export data in csv format:

   a) If your log as html is true than you can export the log data to client machine in .csv format <br/>
   b) To use export feature you need to include filesaver.js to your project <br/>
   c) IE >=10, chrome-1 ,firefox -1 , safari -1 ,opera -1 are supported <br/>
   
 Browser compatibility: 
 
 IE 6+(6-7 don't have console but still you can send logs) <br/>
 All other browser's that support >= ECMAScript 3. 
 
 Note:
 
- IE6 to IE8 json2/json3.js 
(sorry can't help it. If it's not present then transport will fallback to form)


<h2>Contribute</h2>

- clone the repo
- run npm install in bash or anywhere,to install the necessary node packages
- to compile typeScript use 'gulp build'
- to watch use 'gulp'
