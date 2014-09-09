/**
 * Created by prandutt on 8/8/2014.
 *
 * utilities function will be here which are different from core library
 */

module consoleLogger.utils{

   export enum browserFeatureCheck{
        sessionStorage,
        json,
        console,
        canDownloadLog,
       canUseSessionStorage
    }

    export class utilities {




        public isFeaturePresent(feature:browserFeatureCheck):boolean{

            switch(feature){
                case browserFeatureCheck.sessionStorage:
                     //check if session storage is present in browser
                     return window.sessionStorage && typeof sessionStorage !="undefined"



                case browserFeatureCheck.json:
                      //json is present or not
                     return typeof JSON !="undefined";

                case browserFeatureCheck.console:
                     //browser console is there or not
                     return (typeof console !="undefined" || window.console) ? true :false;


                case browserFeatureCheck.canDownloadLog:
                    //check is blob saver is present in browser
                    return  window.sessionStorage && typeof sessionStorage !="undefined" && typeof JSON !="undefined"&& window.saveAs

                case browserFeatureCheck.canUseSessionStorage:
                     return window.sessionStorage && typeof sessionStorage !="undefined" && typeof JSON !="undefined"

                   }


            return false;


        }

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