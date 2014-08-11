/**
 * Created by prandutt on 8/8/2014.
 *
 * utilities function will be here which are different from core library
 */
module consoleLogger.utils{
    export class utilities {
        public trim(message:string):string {

            //using native browser trim as it is way faster
            //for old browser using regex

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