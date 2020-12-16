export default class Login{

    constructor(...args){
        this.popup = window.open(...args);
        this.promise = new Promise((resolve, reject) => {
            this.interval = setInterval(() => {
                try{
                    let queries = new URLSearchParams(this.popup.location.search);
                    let code = queries.get('code');

                    if(code){
                        resolve(code);
                        return this.close();
                    } else if(queries.get('error')){
                        reject();
                        return this.close();
                    }
                }catch(e){}
            }, 500);
        });
    }

    close(){
        clearInterval(this.interval);
        this.popup.close();
    }

}