/**
 * Created by prandutt on 8/6/2014.
 * contract which each logger service have to expose
 */


module consoleLogger{
    export interface ILogger {
        error:(message:any) => void;
        fatal:(message:any) => void;
        warn:(message:any) => void;
        debug:(message:any) => void;
        history():void;
        sendDataToService:(logData:logWrapperClass) => void;



    }
}