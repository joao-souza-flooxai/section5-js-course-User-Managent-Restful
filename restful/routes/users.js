//Importanto e instanciando o NeDB e criando a database users.db
let NeDB = require('nedb');
let db = new NeDB({
    filename:'users.db',
    autoload: true
});

//Exportando esse modulo para ser chamado na aplicação
module.exports = app =>{ //o app é a instancia do Express que é passada no consign.include 

    //Definindo a rota padrão
    let route = app.route('/users');

    //Fazendo as coisas da rota /users
    route.get((req,res)=>{

        db.find({}).sort({name:1}).exec((err,users)=>{

            if(err){
                //Utilizando o modulo exportado de utils/error.js. Somente possível porque foi colocado no consign().include no index.js
                app.utils.error.send(err, req, res);
            }else{

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({
                    users
                });

            }
        });
        
    });


    // Cadastrando os dados
    route.post((req, res) => {
        
        if (!app.utils.validator.user(app, req, res)) return false;

        db.insert(req.body,(err,user)=>{
            if(err){
                //Utilizando o modulo exportado de utils/error.js. Somente possível porque foi colocado no consign().include no index.js
                app.utils.error.send(err, req, res);
            }else{
                res.status(201).json(user);
            }        
            
        });

    });
    
    let routeId = app.route('/users/:_id');

    routeId.get((req,res)=>{
        db.findOne({_id: req.params._id}).exec((err, user)=>{
            if(err){
                //Utilizando o modulo exportado de utils/error.js. Somente possível porque foi colocado no consign().include no index.js
                app.utils.error.send(err, req, res);
            }else{
                res.status(200).json(user);
            }        
        })
    });

    routeId.put((req,res)=>{

        if (!app.utils.validator.user(app, req, res)) return false;

        db.update({_id: req.params._id}, req.body, err=>{
            if(err){
                //Utilizando o modulo exportado de utils/error.js. Somente possível porque foi colocado no consign().include no index.js
                app.utils.error.send(err, req, res);
            }else{
                res.status(200).json(Object.assign(req.params, req.body));
            }        
        })
    });

    routeId.delete((req,res)=>{
        db.remove({_id: req.params._id}, {}, err=>{
            if(err){
                //Utilizando o modulo exportado de utils/error.js. Somente possível porque foi colocado no consign().include no index.js
                app.utils.error.send(err, req, res);
            }else{
                res.status(200).json({
                    id: req.params, 
                    message: "Deleted succesfully!"
                });
            }        
        })
    });

}
