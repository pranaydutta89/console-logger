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
module consoleLogger{
    var  utils:consoleLogger.utils.utilities = new consoleLogger.utils.utilities();
   export enum logType{
       //types of log are here
        warn =1,//starts with because 0 was causing false in IF statement
        fatal,
        error ,
        debug,
        log,
        info
    }

    export enum errorType{

        //error types, easy to organize error through this
        jsonNotPresent,
        ajaxError,
        historyEmpty,
        configNotDone
    }

    export class logWrapperClass{

        //log message get wrapped in the instance of this class
        public message:string;
        public messageType:logType;
        public stack:string;
        public eventDT : Date ;
        public browserDetails:string = window.navigator.userAgent;

    }

    export class sendDataSettings{

        //config section provided to the user
        public url:string;
        //default will to send whole data
        public toSend:number =1; //fatal,error :1 , all:2
        public headers:string ="application/json; charset=utf-8";
        //true when we are using any other service to send data like angular etc etc.
        public isFramework:boolean = false;

    }

//we need to implement ILogger so that consistency is maintained if we create another logger class like angularLogger.ts
    export class logger implements ILogger{

        //This is the main core class

        private logging:boolean =true;
        private showAsHtml:boolean=false;
        private sendData:sendDataSettings;

        private logHistory:Array<logWrapperClass> =[];


        //private functions



        private config(sendDataOptions:sendDataSettings){

           //all the config part will be done here

            if (sendDataOptions) {
                this.sendData =new sendDataSettings()
                if(sendDataOptions.toSend)
                    this.sendData.toSend = sendDataOptions.toSend;

                if(sendDataOptions.headers)
                    this.sendData.headers = sendDataOptions.headers;

                if(sendDataOptions.url)
                    this.sendData.url= sendDataOptions.url;

                if(sendDataOptions.isFramework)
                    this.sendData.isFramework= sendDataOptions.isFramework;
            }
        }

        private performCommonJob(message:any,logT:logType):logWrapperClass{


            //common jobs which don't require any flag check done here

            var logWarpperObj:logWrapperClass =this.messageFormatting(message);
            logWarpperObj.messageType=logT;
            this.logHistory.push(logWarpperObj);
            this.showLog(logWarpperObj);
            return logWarpperObj;
        }



        private messageFormatting(mes:any){

            //user send a string or a object it is being wrapped here
            var logWarpperObj =  new logWrapperClass();
            logWarpperObj.eventDT =new Date();
            if(typeof(mes) === 'object' ) {
                if(mes.message)
                    logWarpperObj.message =utils.trim(mes.message);
                else
                    logWarpperObj.message='NA';

                if(mes.stack)
                    logWarpperObj.stack = utils.trim(mes.stack);
                else
                    logWarpperObj.stack='NA';
            }
            else if(typeof(mes) ==='string'){

                logWarpperObj.message = utils.trim(mes);
                logWarpperObj.stack ='NA';

            }
            else{
                //no supported format
                logWarpperObj.message ='UnSupported format, logging actual data:'+ mes;
                logWarpperObj.stack ='NA';

            }
            return logWarpperObj;
        }

        private showLog(mes:logWrapperClass){

            //for showing the log to the console

            if(console && this.logging && mes)
            {
                //console is present show them the logs
                var message:string;
                if(mes.messageType  && mes.messageType !== logType.log)
                    message= 'Type:'+logType[mes.messageType] +'\n\nMessage:' + mes.message +'\n\nStack:' + mes.stack || 'NA'  + '\n\nEvent Time:' + mes.eventDT ;
                else
                    message=mes.message;

                switch (mes.messageType){

                    case logType.warn: console.warn(message);
                        break;
                    case logType.fatal:
                    case logType.error:console.error(message);
                        break;
                    case  logType.info:console.info(message);
                        break;
                    case logType.debug:
                    case logType.log:console.log(message);
                        break;
                }
                this.showLogAsHtml(mes);
            }

        }

        private showLogAsHtml(mes:logWrapperClass){

            //when we want to render log as HTML use this function
            //its not called directly called via showlog()


            //don't use any lib to manipulate the dom
            //since we want to create non dependent lib
            if(this.showAsHtml) {
                var msg:string;
                var root = document.getElementsByTagName('body')[0];
                var parentDiv = document.createElement('div');
                if (mes.messageType && mes.messageType !== logType.log)
                    msg = '<div style="padding: 2%;text-align: center;font-family: "Bookman", Georgia, "Times New Roman", serif"><strong>Type:</strong>' + logType[mes.messageType] + '<br/><strong>Message:</strong>' + mes.message + '<br/><strong>Stack:</strong>' + mes.stack + '<br/><strong>Event Time:</strong>' + mes.eventDT + '<br/></div><br/>'
                else
                    msg = '<div style="padding: 2%;text-align: center;font-family: "Bookman", Georgia, "Times New Roman", serif"><strong>Type:</strong>Log<br/><strong>Message:</strong>' + mes.message + '</div><br/>';

                parentDiv.innerHTML = msg;
                root.appendChild(parentDiv);
            }
        }

        //end private functions


        //public functions



        public handleError(errT:errorType,message?:string){
            //generic error handler to organize the code

            switch (errT){
                case errorType.ajaxError:
                    this.messageManager('Ajax Error:'+ message || '');
                    break;

                case errorType.jsonNotPresent:
                    this.messageManager('Json is undefined ,try including json2/json3 '+ message || '');
                    break;

                case errorType.historyEmpty:
                    this.messageManager('No recent activity yet!! '+ message || '');
                    break;

               case errorType.configNotDone:
                    this.messageManager('Initial config not done. '+ message || '');
                    break;

            }
        }

        public getConfig():sendDataSettings{
            return this.sendData;
        }

        public sendDataToService(logData:logWrapperClass){

            //send data to remote server generic method using xhr
               if(this.sendData && !this.sendData.isFramework)
               {

                       if(JSON) {
                           var that = this;
                           var xmlhttp = new XMLHttpRequest();   // new HttpRequest instance
                           xmlhttp.open("POST", this.sendData.url);
                           xmlhttp.setRequestHeader("Content-Type", this.sendData.headers);
                           xmlhttp.send(JSON.stringify(logData));
                           xmlhttp.onreadystatechange = function () {
                               if ((this.readyState != 4 || this.status != 200))
                                   that.handleError(errorType.ajaxError,this.statusText);

                           }


                       }
                       else{
                           this.handleError(errorType.jsonNotPresent);
                       }
               }
          }


        public messageManager(message:string) {
            //its basically sysout for user
            var msg = new logWrapperClass();
            msg.message=message;
            msg.messageType=logType.log;
            this.showLog(msg);
        }

        public history(){
             //shows us the log history ,does not render as html
            if(this.logHistory.length ==0) {
                this.handleError(errorType.historyEmpty);
            }
            else
            {
                for(var idx in this.logHistory){
                    this.messageManager('Sr No:' + (parseInt(idx,10)+1).toString());
                    this.showLog(this.logHistory[idx]);
                }
            }
        }

        error =(message:any):logWrapperClass =>{

            //in error push to history ,show log and send to server
            var logData =this.performCommonJob(message,logType.error);
            this.sendDataToService(logData);
            return logData;
        }

        fatal =(message:any):logWrapperClass =>{
            var logData =this.performCommonJob(message,logType.fatal);
            this.sendDataToService(logData)
            return logData;
        }

        debug =(message:any):logWrapperClass => {

            var logData =this.performCommonJob(message,logType.debug);
            if (this.sendData && this.sendData.toSend == 2) //2 means to send all
              this.sendDataToService(logData)

            return logData;
        }

        warn =(message:any):logWrapperClass=>{

            var logData =this.performCommonJob(message,logType.warn);
            if(this.sendData && this.sendData.toSend ==2) //2 means to send all
               this.sendDataToService(logData)

            return logData;
        }




        //end public functions


        constructor(shouldLog:boolean,showAsHtml?:boolean,sendDataOptions?:sendDataSettings){

           //INIT

            if(showAsHtml)
            this.showAsHtml =showAsHtml;
            this.logging = shouldLog;
            this.config(sendDataOptions);

        }

    }


   }