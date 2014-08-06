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
         private isConfigDone:boolean=false;
         public config(shouldLog:boolean ,sendDataOptions?:consoleLogger.sendDataSettings) {

              this.isConfigDone=true;
              sendDataOptions.isFramework=true;
              this.loggerVar = new consoleLogger.logger(shouldLog,sendDataOptions);
         }

        public error(message:any){
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
            if(this.isConfigDone){
                //config done
                this.loggerVar.history();

            }
            else{
                //initial config not done
                this.configNotDone();
            }
        }
        public sendDataToService(logData:logWrapperClass){
            this.$http({
                url:this.loggerVar.getConfig().url,
                method: 'POST',
                data:JSON.stringify(logData),
                headers: this.loggerVar.getConfig().headers
            }).then(function(){
                //success
            },function(){
                //error
            });
        }
        private configNotDone(){
            if(!this.loggerVar)
                this.loggerVar =new consoleLogger.logger(true);
            this.loggerVar.messageManager('Initial config not done, try doing consoleLogger.config ')
        }
        static $inject = ['$http'];

        constructor(public $http) {

        }
    }
}
