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
            var temp =  new logWrapper();
            if(typeof(mes) === 'object' )
            {

                if(mes.message)
                    temp.message = $ ? $.trim(mes.message) :mes.message;



                if(mes.stack)
                    temp.stack = $ ? $.trim(mes.stack): mes.stack;

                temp.eventDT =new Date();
                this.logHistory.push(temp);
                this.showLog(temp)

            }
            else if(typeof(mes) ==='string'){



                temp.message = $ ?$.trim(mes) :mes;

                temp.stack ='';

                temp.eventDT =new Date();
                this.logHistory.push(temp);
                this.showLog(temp);
            }
            else{
                //no supported format
                temp.message ='UnSupported format:'+ mes;

                temp.stack ='';

                temp.eventDT =new Date();
                this.logHistory.push(temp);
                this.showLog(temp);
            }



        }

        showHistory(){

            if(this.logHistory.length ==0) {
                this.showLog('No recent activity yet !!');
            }
            else
            {
                for(var x in this.logHistory){
                    this.showLog('Sr No:' + (parseInt(x,10)+1).toString());
                    this.showLog(this.logHistory[x]);
                }
            }
        }
        private showLog(mes){
            if(console && this.logging && mes)
            {
                //console is present show them the logs
                if(typeof(mes) === 'object')
                {


                    var message =$ ? $.trim(mes.message) :mes.message;

                    var stack;
                    if(mes.stack)
                        stack = $? $.trim(mes.stack): mes.stack;
                    else
                        stack ='';


                    console.log('Message:' + message +'\n' +'Stack:' + stack  + '\n\n'+ 'Event Time:' + mes.eventDT);

                }
                else if(typeof(mes) ==='string'){

                    var message = $ ?$.trim(mes) :mes;
                    console.log('Message:'+ message);

                }
                else{
                    //no supported format pass directly
                    console.log('Unsupported format:'+ mes);
                }
            }else{
                //console not supported
            }

        }
        constructor(public shouldLog){

            this.logging =shouldLog;


        }

    }
}