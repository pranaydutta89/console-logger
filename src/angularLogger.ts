/**
 * Created by prandutt on 8/6/2014.
 */
/// <reference path="../dependencies/angular.d.ts"/>
/// <reference path="interface.ts"/>


module consoleLogger {
    export var app:ng.IModule = function () {
        return angular.module('consoleLogger', []).service(consoleLogger)

    }();


    export class loggerService implements ILogger{
         private loggerVar:consoleLogger.logger;
         private logging:boolean =true;
         private sendData:consoleLogger.sendDataSettings;
         public config(shouldLog:boolean ,sendDataOptions?:any) {
              this.logging=shouldLog;
             if (sendDataOptions) {
                   this.sendData = new consoleLogger.sendDataSettings();
                 if(sendDataOptions.toSend)
                     this.sendData.toSend = sendDataOptions.toSend;

                 if(sendDataOptions.headers)
                     this.sendData.headers = sendDataOptions.headers;

                 if(sendDataOptions.url)
                     this.sendData.url= sendDataOptions.url;
             }
             this.loggerVar = new consoleLogger.logger(this.logging,this.sendData);
         }

        public error(message:any){
           if(this.sendData){
               //config done
               this.loggerVar.error(message);

           }
           else{
               //initial config not done
                this.configNotDone();
           }

        }

        public debug(message:any){
            if(this.sendData){
                //config done
                this.loggerVar.debug(message);

            }
            else{
                //initial config not done
                this.configNotDone();
            }

        }

        public fatal(message:any){
            if(this.sendData){
                //config done
                this.loggerVar.fatal(message);

            }
            else{
                //initial config not done
                this.configNotDone();
            }

        }

        public warn(message:any){
            if(this.sendData){
                //config done
                this.loggerVar.warn(message);

            }
            else{
                //initial config not done
                this.configNotDone();
            }

        }

        public history(){
            if(this.sendData){
                //config done
                this.loggerVar.history();

            }
            else{
                //initial config not done
                this.configNotDone();
            }
        }

        private configNotDone(){
            if(!this.loggerVar)
                this.loggerVar =new consoleLogger.logger(true);
            this.loggerVar.messageManager('Initial config not done, try consoleLogger.config ')
        }
        static $inject = ['$http'];

        constructor(public $http) {

        }
    }
}
