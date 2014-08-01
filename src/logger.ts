/**
 * Created by prandutt on 7/28/2014.
 */
/// <reference path="../dependencies/jquery.d.ts"/>

module consoleLogger{
    export class logWrapperClass{
        public message:string;
        public messageType:string;
        public stack:string;
        public eventDT : Date ;
        public browserDetails:string = window.navigator.userAgent;

    }

    export class sendDataSettings{
        public url:string;
        //default will to send whole data
        public toSend:number =1; //fatal,error :1 , all:2
        public headers:string ="application/json; charset=utf-8";

    }

    export class logger{

        public logging:boolean =true;
        public sendData:sendDataSettings =new sendDataSettings();

        private logHistory:Array<logWrapperClass> =[];
        //private functions
        private performCommonJob(message:logWrapperClass){
            this.logHistory.push(message);
            this.showLog(message);
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


        private sendDataToService(logData:logWrapperClass){
               if(this.sendData)
               {

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
                if(mes.messageType)
                console.log('Type:'+mes.messageType +'\n\nMessage:' + mes.message +'\n\nStack:' + mes.stack  + '\n\nEvent Time:' + mes.eventDT);
                else
                console.log(mes.message);
            }

        }

        private messageManager(message:string){
            //its basically sysout for user
            var msg = new logWrapperClass();
            msg.message=message;
            this.showLog(msg);
        }
        //end private functions
        //public functions

        error =(message:any) =>{

            //in error push to history ,show log and send to server
            var logWarpperObj:logWrapperClass =this.messageFormatting(message);
            logWarpperObj.messageType='ERROR';
            this.performCommonJob(logWarpperObj);
            this.sendDataToService(logWarpperObj);
        }

        fatal =(message:any) =>{
            var logWarpperObj:logWrapperClass =this.messageFormatting(message);
            logWarpperObj.messageType='FATAL';
            this.performCommonJob(logWarpperObj);
            this.sendDataToService(logWarpperObj);
        }

        debug =(message:any) =>{
            var logWarpperObj:logWrapperClass =this.messageFormatting(message);
            logWarpperObj.messageType='DEBUG';
            this.performCommonJob(logWarpperObj);
            if(this.sendData && this.sendData.toSend ==2) //2 means to send all
                this.sendDataToService(logWarpperObj);
        }

        warn =(message:any)=>{
            var logWarpperObj:logWrapperClass =this.messageFormatting(message);
            logWarpperObj.messageType='WARN';
            this.performCommonJob(logWarpperObj);
            if(this.sendData && this.sendData.toSend ==2) //2 means to send all
                this.sendDataToService(logWarpperObj);
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
                if (sendDataOptions) {

                    if(sendDataOptions.toSend)
                        this.sendData.toSend = sendDataOptions.toSend;

                    if(sendDataOptions.headers)
                    this.sendData.headers = sendDataOptions.headers;

                    if(sendDataOptions.url)
                        this.sendData.url= sendDataOptions.url;
                }
            }
            else{
                //jQuery is undefined show error to console
                this.messageManager('jQuery is not present');
            }






        }

    }
}