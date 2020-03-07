
class SessionConfiguration {

    constructor(src) {
        this.sessionTimeout = src && src.hasOwnProperty('sessionTimeout') ? src.sessionTimeout : -1;
    }

    apply(src){

        if(src){
            for(const key in src) {
                if (!this.hasOwnProperty(key)) {
                    throw new Error("unknown key '" + key + "' in class SessionConfiguration");
                }
                this[key] = src[key];
            }
        }
    }

    clone(){
        return new SessionConfiguration({
            sessionTimeout: this.sessionTimeout
        });
    }

}

export default SessionConfiguration;
