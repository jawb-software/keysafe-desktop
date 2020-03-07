
class ViewConfiguration {

    constructor(src) {
        this.showUserName      = src && src.hasOwnProperty('showUserName') ? src.showUserName : true;
        this.showPassword      = src && src.hasOwnProperty('showPassword') ? src.showPassword : false;
        this.showLastChange    = src && src.hasOwnProperty('showLastChange') ? src.showLastChange : false;
        this.showPasswordScore = src && src.hasOwnProperty('showPasswordScore') ? src.showPasswordScore : false;
    }

    apply(src){

        if(src){
            for(const key in src) {
                if (!this.hasOwnProperty(key)) {
                    throw new Error("unknown key '" + key + "' in class ViewConfiguration");
                }

                this[key] = src[key];
            }
        }
    }

    clone(){
        return new ViewConfiguration({
            showUserName: this.showUserName,
            showPassword : this.showPassword,
            showPasswordScore : this.showPasswordScore,
            showLastChange : this.showLastChange
        });
    }

}

export default ViewConfiguration;
