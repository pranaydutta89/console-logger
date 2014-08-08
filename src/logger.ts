/**
 * Created by prandutt on 7/28/2014.
 */
/// <reference path="../dependencies/jquery.d.ts"/>
/// <reference path="interface.ts"/>
/// <reference path="utils.ts"/>
module consoleLogger{
    var  utils:consoleLogger.utils.utilities = new consoleLogger.utils.utilities();
   export enum logType{
        warn =1,
        fatal,
        error ,
        debug,
        log,
        info
    }

    export enum errorType{
        jsonNotPresent,
        ajaxError,
        historyEmpty,
        configNotDone
    }

    export class logWrapperClass{
        public message:string;
        public messageType:logType;
        public stack:string;
        public eventDT : Date ;
        public browserDetails:string = window.navigator.userAgent;

    }

    export class sendDataSettings{
        public url:string;
        //default will to send whole data
        public toSend:number =1; //fatal,error :1 , all:2
        public headers:string ="application/json; charset=utf-8";
        //for angular it will have its own service to send
        public isFramework:boolean = false;

    }


    export class logger implements ILogger{

        private logging:boolean =true;
        private showAsHtml:boolean=false;
        private sendData:sendDataSettings;

        private logHistory:Array<logWrapperClass> =[];


        //private functions



        private config(sendDataOptions:sendDataSettings){
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

            var logWarpperObj:logWrapperClass =this.messageFormatting(message);
            logWarpperObj.messageType=logT;
            this.logHistory.push(logWarpperObj);
            this.showLog(logWarpperObj);
            return logWarpperObj;
        }



        private messageFormatting(mes:any){
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
            switch (errT){
                case errorType.ajaxError:
                    this.messageManager('Ajax Error:'+ message || '');
                    break;

                case errorType.jsonNotPresent:
                    this.messageManager('Json is undefined ,try including json2/json3'+ message || '');
                    break;

                case errorType.historyEmpty:
                    this.messageManager('No recent activity yet!!'+ message || '');

                    case errorType.configNotDone:
                    this.messageManager('Initial config not done.');

            }
        }

        public getConfig():sendDataSettings{
            return this.sendData;
        }

        public sendDataToService(logData:logWrapperClass){
               if(this.sendData && !this.sendData.isFramework)
               {
                  //TODO:fallback to xhr if jquery is not present
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
            //checking jQuery presence

            if(showAsHtml)
            this.showAsHtml =showAsHtml;
            this.logging = shouldLog;
            this.config(sendDataOptions);

        }

    }


   }