/**
 * Created by prandutt on 8/6/2014.
 *
 * using angular service to log the data and do the functions same as logger
 */
/// <reference path="../dependencies/angular.d.ts"/>
/// <reference path="interface.ts"/>


module consoleLogger {


    export var app:ng.IModule = function () {
        try {
            return angular.module('consoleLogger', []).service(consoleLogger)
        }
        catch(e){
            //no angular
        }

    }();
    export class loggerService implements ILogger{
         private loggerVar:consoleLogger.logger;
         private isConfigDone:boolean=false;

        //Private function's
         private configNotDone(){
            if(!this.loggerVar)
                this.loggerVar =new consoleLogger.logger(true);
            this.loggerVar.handleError(consoleLogger.errorType.configNotDone);
        }
        //End private function's


        //Public Function's
         public config(shouldLog:boolean ,showAsHtml?:boolean,sendDataOptions?:consoleLogger.sendDataSettings) {

             //take the config and pass it to logger.ts
              this.isConfigDone=true;
              sendDataOptions.isFramework=true;
              this.loggerVar = new consoleLogger.logger(shouldLog,showAsHtml,sendDataOptions);
         }

        public error(message:any){

            //implementing the interface and its function
            //call the native logger.ts function only
           if(this.isConfigDone){
               //config done
               this.sendDataToService(this.loggerVar.error(message));

           }
           else{
               //initial config not done
                this.configNotDone();
           }

        }

        public debug(message:any){
            if(this.isConfigDone){
                //config done
                this.sendDataToService(this.loggerVar.debug(message));

            }
            else{
                //initial config not done
                this.configNotDone();
            }

        }

        public fatal(message:any){
            if(this.isConfigDone){
                //config done
                this.sendDataToService(this.loggerVar.fatal(message));

            }
            else{
                //initial config not done
                this.configNotDone();
            }

        }

        public warn(message:any){
            if(this.isConfigDone){
                //config done
                this.sendDataToService(this.loggerVar.warn(message));

            }
            else{
                //initial config not done
                this.configNotDone();
            }

        }

        public history(){
            //for history also config is mandatory
            if(this.isConfigDone){
                //config done
                this.loggerVar.history();

            }
            else{
                //initial config not done
                this.configNotDone();
            }
        }
         public  sendDataToService(logData:logWrapperClass){

             //using the native $http service to send data
             var that =this;
            this.$http({
                url:this.loggerVar.getConfig().url,
                method: 'POST',
                data:JSON.stringify(logData),
                headers: this.loggerVar.getConfig().headers
            }).then(function(){
                //success
            },function(d){
                //error
                that.loggerVar.handleError(consoleLogger.errorType.ajaxError,d.statusText);
            });
        }
       //End Public Function's


        //for minification purpose using inject
        static $inject = ['$http'];

        constructor(public $http) {

        }
    }
}
