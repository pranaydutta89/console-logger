console-logger
==============

Features 

1) Simple console logging <br/>
2) View log history  <br/>
3) on/off faciltiy   <br/>
4) send log data to remote server  <br/>


How to do ? 

1) Init: 
  
 <code>var loggerObj = new consoleLogger.logger(); //by default its true 
  </code>
      <br/>
      <code>
        var loggerObj = new consoleLogger.logger(false); //if dn't want to log     
  
 </code>

2) Use: 
  a)
    
  <code>
      loggerObj.debug('this is a debug log');//or
      </code>
      <br/>
      <code>
      loggerObj.debug(e) //e => error object
  </code>
  
  b) FATAL
  <code>
      loggerObj.fatal('this is a fatal log');//or
      </code>
      <br/>
      <code>
      loggerObj.fatal(e) //e => error object
  </code>
  
  a) ERROR
  <code>
      loggerObj.error('this is a error log');//or
      </code>
      <br/>
      <code>
      loggerObj.error(e) //e => error object
  </code>
  
  a) WARN
  <code>
      loggerObj.warn('this is a warn log');//or
      </code>
      <br/>
      <code>
      loggerObj.warn(e) //e => error object
  </code>
  
3) View log history:  

  <code>loggerObj.history() </code>
  
4) Send Data to server: 

  <code>
    //configure your logger object
    </code>
      <br/>
      <code>
    var loggerObj = new consoleLogger.logger(true,{url:'testUrlHere',toSend:2});
    </code>
      <br/>
      <code>
    //toSend=1 => send only error and fatal
    //toSend=2 => send all logs
    //even if logging is false then also data will be sent to server
  </code>
  
 
 Browser compatibility 
 
 IE 6+, Chrome-1 ,opera -1 ,firefox -1
 
 
 Dependency
 
 - jQuery > 1.7.1 
 - IE6 to IE8 json2/json3
