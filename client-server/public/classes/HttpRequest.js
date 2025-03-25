//Classe de abstrai a lógica de HTTP requests e responses.
class HttpRequest{

    static get(url, params = {}){
        return HttpRequest.request('GET', url, params);
    }

    
    static post(url, params = {}){
        return HttpRequest.request('POST', url, params);
    }

    static delete(url, params = {}){
        return HttpRequest.request('DELETE', url, params);
    }

    static put(url, params = {}){
        return HttpRequest.request('PUT', url, params);
    }

    static request(method, url, params = {} ){
        
        return new Promise((resolve, reject)=>{
            let ajax = new XMLHttpRequest();
        
            ajax.open(method.toUpperCase(), url); 
            
            ajax.onerror = event => {
                reject(e);
            }

            // Define um evento para ser executado quando a requisição for concluída com sucesso.
            ajax.onload = event => {
    
                // Inicializa um objeto vazio
                let obj = { };
    
                try {
                    // Tenta converter a resposta do servidor (que vem como texto) em um objeto JSON.
                    obj = JSON.parse(ajax.responseText);
                } catch (e) {
                    // Caso ocorra um erro na conversão do JSON, exibe a mensagem de erro no console.
                    console.error(e);
                    reject(e);
                }
                
                resolve(obj);
                
            };
    
            // Envia a requisição para o servidor.
            // Como é uma requisição GET, não há necessidade de passar dados no corpo da requisição.
            
            ajax.setRequestHeader('Content-Type', 'application/json');
            
            ajax.send(JSON.stringify(params));
    
        });

    }
}