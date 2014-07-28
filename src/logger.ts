/**
 * Created by prandutt on 7/28/2014.
 */
/// <reference path="../dependencies/jquery.d.ts"/>

module consoleLogger{
    export class logWrapper{
        public message:string;
        public stack:string;
        public eventDT : Date ;
        public browserDetails:string = window.navigator.userAgent;

    }

    export class logger{

        public logging:boolean =false;
        private logHistory:Array<logWrapper> =[];
        setAndShowLog(mes){

            var logWarpperObj =  new logWrapper();
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
                this.showLog('No recent activity yet!!');
            }
            else
            {
                for(var idx in this.logHistory){
                    this.showLog('Sr No:' + (parseInt(idx,10)+1).toString());
                    this.showLog(this.logHistory[idx]);
                }
            }
        }
        private showLog(mes){
            if(console && this.logging && mes)
            {
                //console is present show them the logs
                console.log('Message:' + mes.message +'\n' +'Stack:' + mes.stack  + '\n\n'+ 'Event Time:' + mes.eventDT);
            }

        }
        constructor(public shouldLog){

            this.logging =shouldLog;


        }

    }
}