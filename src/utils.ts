/**
 * Created by prandutt on 8/8/2014.
 *
 * utilities function will be here which are different from core library
 */
module consoleLogger.utils{

   export enum browserFeatureCheck{
        sessionStorage,
        json,
        console
    }

    export class utilities {

        private ieVersion():number{
            var v = 3,
                div = document.createElement('div'),
                all = div.getElementsByTagName('i');

            while (
                div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i>< ![endif]-->',
                    all[0]
                );

            return v > 4 ? v : undefined;
        }


        public isFeaturePresent(feature:browserFeatureCheck):boolean{

            switch(feature){
                case browserFeatureCheck.sessionStorage:
                     //check if session storage is present in browser
                     if(window.sessionStorage && typeof sessionStorage !="undefined")
                     return true;
                  break;

                case browserFeatureCheck.json:
                      //json is present or not
                     if(typeof JSON !="undefined")
                      return true;

                    break;

                case browserFeatureCheck.console:
                     //browser console is there or not
                    if(typeof console !="undefined" || window.console)
                      return true;
                    break;

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