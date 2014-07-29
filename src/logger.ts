/**
 * Created by prandutt on 7/28/2014.
 */
/// <reference path="../dependencies/jquery.d.ts"/>

module consoleLogger{
    export class logWrapperClass{
        public message:string;
        public stack:string;
        public eventDT : Date ;
        public browserDetails:string = window.navigator.userAgent;

    }

    export class sendDataSettings{
        public url:string;
        public sendInBatchCount:number =1;

    }

    export class logger{

        public logging:boolean =true;
        public sendData:sendDataSettings;

        private logHistory:Array<logWrapperClass> =[];
        setAndShowLog(mes){

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

            this.logHistory.push(logWarpperObj);
            this.showLog(logWarpperObj);

        }

        showHistory(){

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

        private sendDataToService(logHistory:Array<logWrapperClass>){
               if(this.sendData)
               {
                  // $.ajax()
               }
          }
        private showLog(mes:logWrapperClass){
            if(console && this.logging && mes)
            {
                //console is present show them the logs
                console.log('Message:' + mes.message +'\n' +'Stack:' + mes.stack  + '\n\n'+ 'Event Time:' + mes.eventDT);
            }

        }

        private messageManager(message:string){
            //its basically sysout for user
            var msg = new logWrapperClass();
            msg.message=message;
            this.showLog(msg);
        }
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