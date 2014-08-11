/**
 * Created by prandutt on 8/8/2014.
 */
module consoleLogger.utils{
    export class utilities {
        public trim(message:string):string {
                   try{
                       return message.toString().trim();
                   }
                   catch(e)
                   {
                      return message.toString().replace(/^\s+|\s+$/gm,'');
                   }
        }
    }
}