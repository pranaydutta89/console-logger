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
        //by default we will send fatal and error to server
        public toSend:number =1; //fatal,error :1 , all:2


    }

    export class logger{

        public logging:boolean =true;
        public sendData:sendDataSettings;

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
                      data:logData
                  }).done(function(d){
                      //sending successful
                  }).fail(function(error,xhr,status){
                     that.messageManager('AJAX error:'+ error)
                  })
               }
          }
        private showLog(mes:logWrapperClass){
            if(console && this.logging && mes)
            {
                //console is present show them the logs
                console.log('Type:'+mes.messageType +'\n\nMessage:' + mes.message +'\n\nStack:' + mes.stack  + '\n\nEvent Time:' + mes.eventDT);
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

        errorLog =(message:any) =>{

            //in error push to history ,show log and send to server
            var logWarpperObj:logWrapperClass =this.messageFormatting(message);
            logWarpperObj.messageType='ERROR';
            this.performCommonJob(logWarpperObj);
            this.sendDataToService(logWarpperObj);
        }

        fatalLog =(message:any) =>{
            var logWarpperObj:logWrapperClass =this.messageFormatting(message);
            logWarpperObj.messageType='FATAL';
            this.performCommonJob(logWarpperObj);
            this.sendDataToService(logWarpperObj);
        }

        debugLog =(message:any) =>{
            var logWarpperObj:logWrapperClass =this.messageFormatting(message);
            logWarpperObj.messageType='DEBUG';
            this.performCommonJob(logWarpperObj);
            if(this.sendData.toSend ==2) //2 means to send all
                this.sendDataToService(logWarpperObj);
        }

        warnLog =(message:any)=>{
            var logWarpperObj:logWrapperClass =this.messageFormatting(message);
            logWarpperObj.messageType='WARN';
            this.performCommonJob(logWarpperObj);
            if(this.sendData.toSend ==2) //2 means to send all
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
                if (sendDataOptions)
                    this.sendData = sendDataOptions;
            }
            else{
                //jQuery is undefined show error to console
                this.messageManager('jQuery is not present');
            }






        }

    }
}