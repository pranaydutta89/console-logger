/**
 * Created by prandutt on 7/28/2014.
 */
/// <reference path="../dependencies/jquery.d.ts"/>
/// <reference path="interface.ts"/>
module consoleLogger{

   export enum logType{
        warn,
        fatal,
        error ,
        debug,
        log,
        info
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
        public transport:Array<string>  = ['jquery','xhr'];// how you want to send data
        //for angular it will have its own service to send
        public isFramework:boolean = false;

    }


    export class logger implements ILogger{

        private logging:boolean =true;
        private sendData:sendDataSettings =new sendDataSettings();

        private logHistory:Array<logWrapperClass> =[];
        //private functions

        private config(sendDataOptions:sendDataSettings){
            if (sendDataOptions) {

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
                    logWarpperObj.message = $ ? $.trim(mes.message) :mes.message;
                else
                    logWarpperObj.message='NA';

                if(mes.stack)
                    logWarpperObj.stack = $ ? $.trim(mes.stack): mes.stack;
                else
                    logWarpperObj.stack='NA';
            }
            else if(typeof(mes) ==='string'){

                logWarpperObj.message = $ ?$.trim(mes) :mes;
                logWarpperObj.stack ='NA';

            }
            else{
                //no supported format
                logWarpperObj.message ='UnSupported format, logging actual data:'+ mes;
                logWarpperObj.stack ='NA';

            }
            return logWarpperObj;
        }

        public getConfig():sendDataSettings{
            return this.sendData;
        }
        public sendDataToService(logData:logWrapperClass){
               if(this.sendData && !this.sendData.isFramework)
               {
                  //TODO:fallback to xhr if jqquery is not present
                   var that =this;
                  $.ajax({
                      url:this.sendData.url,
                      method:'POST',
                      contentType:this.sendData.headers,
                      data:JSON.stringify(logData)
                  }).done(function(d){
                      //sending successful
                  }).fail(function(error){
                     that.messageManager('AJAX error:'+ error.statusText)
                  })
               }
          }
        private showLog(mes:logWrapperClass){
            if(console && this.logging && mes)
            {
                //console is present show them the logs
               var message:string;
                if(mes.messageType)
                    message= 'Type:'+logType[mes.messageType] +'\n\nMessage:' + mes.message +'\n\nStack:' + mes.stack  + '\n\nEvent Time:' + mes.eventDT;
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
            }

        }

        public messageManager(message:string) {
            //its basically sysout for user
            var msg = new logWrapperClass();
            msg.message=message;
            msg.messageType=logType.log;
            this.showLog(msg);
        }
        //end private functions
        //public functions

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

            if (this.sendData && this.sendData.toSend == 2) //2 means to send all
            {
                var logData =this.performCommonJob(message,logType.debug);
                this.sendDataToService(logData)
                return logData;
            }

        }

        warn =(message:any):logWrapperClass=>{

            if(this.sendData && this.sendData.toSend ==2) //2 means to send all
            {
                var logData =this.performCommonJob(message,logType.warn);
                this.sendDataToService(logData)
                return logData;
            }
        }


        history(){

            if(this.logHistory.length ==0) {
                this.messageManager('No activity yet!!');
            }
            else
            {
                for(var idx in this.logHistory){
                    this.messageManager('Sr No:' + (parseInt(idx,10)+1).toString());
                    this.showLog(this.logHistory[idx]);
                }
            }
        }

        //end public functions

        constructor(shouldLog,sendDataOptions?:sendDataSettings){
            if(typeof ($) === 'function') {
                this.logging = shouldLog;
                this.config(sendDataOptions);
            }
            else{
                //jQuery is undefined show error to console
                this.messageManager('jQuery is not present');
            }






        }

    }


   }