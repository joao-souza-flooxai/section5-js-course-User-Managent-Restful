
//Exportando esse modulo para ser chamado na aplicação no padrão do consign
module.exports = app =>{ //o app é a instancia do Express que é passada no consign.include 
    
    //Fazendo as coisas da rota padrão(/)
    app.get('/', (req,res)=>{
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>Olá</h1>');
    });
};


