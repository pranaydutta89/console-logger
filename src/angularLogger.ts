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
            var def =this.$q.defer();
           if(this.isConfigDone){
               //config done
               this.sendDataToService(this.loggerVar.error(message)).then(()=>{
                   def.resolve();
               },()=>{
                   def.reject();
               });

           }
           else{
               //initial config not done
                this.configNotDone();
               def.reject();
           }

            return def.promise;

        }

        public debug(message:any){
            var def =this.$q.defer();
            if(this.isConfigDone){
                //config done
                this.sendDataToService(this.loggerVar.debug(message)).then(()=>{

                    def.resolve();
                },()=>{

                    def.reject();
                });

            }
            else{
                //initial config not done
                this.configNotDone();
                def.reject();
            }
            return def.promise;

        }

        public fatal(message:any){

            var def =this.$q.defer();
            if(this.isConfigDone){
                //config done
                this.sendDataToService(this.loggerVar.fatal(message)).then(()=>{

                    def.resolve();
                },()=>{
                    def.reject();
                });

            }
            else{
                //initial config not done
                this.configNotDone();
                def.reject();
            }
              return def.promise;
        }

        public warn(message:any){

            var def =this.$q.defer();
            if(this.isConfigDone){
                //config done
                this.sendDataToService(this.loggerVar.warn(message)).then(()=>{

                    def.resolve();
                },()=>{

                    def.reject();
                });

            }
            else{
                //initial config not done
                this.configNotDone();
                def.reject();
            }
              return def.promise;
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

             var data:any;
             var header:string;
             if(utilsClass.isFeaturePresent(utils.browserFeatureCheck.json)) {
                 //try to send data as json
                 header='application/json; charset=utf-8';
                 data = JSON.stringify(logData)
             }
             else{
                 //if json is not there then send data as form
                 header='application/x-www-form-urlencoded';
                 data ='message='+logData.message+'&messageType='+logData.messageType+'&eventDT='+logData.eventDT+'&stack='+logData.stack+'&browserDetails='+logData.browserDetails
             }

             return this.$http({
                url:this.loggerVar.getConfig().url,
                method: 'POST',
                data:data,
                withCredentials: true,
                headers: {
                    'Content-Type':header
                }
            });
        }
       //End Public Function's


        //for minification purpose using inject
        static $inject = ['$http','$q'];

        constructor(public $http:ng.IHttpService,public $q) {

        }
    }
}
