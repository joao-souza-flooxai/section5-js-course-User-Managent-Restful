const { response } = require("../../app");

//Classe de abstrai a lógica de HTTP requests e responses.
class Fetch{

    static get(url, params = {}){
        return Fetch.request('GET', url, params);
    }

    
    static post(url, params = {}){
        return Fetch.request('POST', url, params);
    }

    static delete(url, params = {}){
        return Fetch.request('DELETE', url, params);
    }

    static put(url, params = {}){
        return Fetch.request('PUT', url, params);
    }

    static request(method, url, params = {} ){
        
        return new Promise((resolve, reject)=>{
            
            //Construindo a request com base no metodo(GET,POST,PUT,DELETE)
            let request;

            switch (method.toLowerCase()){
                //Se for get use, apenas a url(sem body)
                case 'get':
                    request = url;
                break;
                
                default:
                    //Os demais tem body e o headers é setado
                    request = new Request(url,{
                        method,
                        body: JSON.stringify(params),
                        headers: new Headers({
                            'Content-Type':'application/json'
                        })
                    });
            }

            fetch(request).then(response=>{

                response.json().then(json=>{
                    resolve(json);
                }).catch(e=>{
                    reject(e);
                });

            }).catch(e=>{
                reject(e);
            });
    
        });

    }
}