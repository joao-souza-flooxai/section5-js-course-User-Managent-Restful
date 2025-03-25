class UserController{
    /*
        Constroi a classe pegando a referência ao Formulário e a Tabela Users,
        com as quais é necessário manipular os elementos e gerar uma relação 
        entre si. 
    */
    constructor(formIdCreate, formIdUpdate, tableId){
        this.formEl = document.getElementById(formIdCreate);
        this.formElUpdate = document.getElementById(formIdUpdate);
        this.tableEl = document.getElementById(tableId);
        this.onSubmit();
        this.onEditCancel();
        this.selectAll();
    }

    onEditCancel(){
        document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e=>{
            this.showPanelCreate();

        });
      

        this.formElUpdate.addEventListener("submit", event=>{
            event.preventDefault();
            let btnSubmit = this.formElUpdate.querySelector("[type=submit]");
            btnSubmit.disable = true;

            let formValues = this.getValues(this.formElUpdate);
            let rowIndex = this.formElUpdate.dataset.trIndex
            let tr = this.tableEl.rows[rowIndex];
            let userOld =  JSON.parse( tr.dataset.user);
            //Mesclando o objeto antigo com o novo usando Object.assign.
            let resultOldNewValues = Object.assign({}, userOld, formValues);
           
            this.getPhoto(this.formElUpdate).then(
                //Arrow Function usadas para não perder o contexto do this.
                (content)=>{
                   
                    if(!formValues.photo) 
                    {
                        console.log("não achou foto");
                        resultOldNewValues._photo = userOld._photo;
                    }
                    else resultOldNewValues._photo = content;
                    
                    let user = new User();
                    user.loadFromJSON(resultOldNewValues);

                    user.save();

                    tr = this.getTr(user,tr);
                    
                    this.updateCount();
     
                    this.formElUpdate.reset();
                    btnSubmit.disable = false;
                    this.showPanelCreate();
                },
                (e)=>{
                    console.error(e);
                }
            );



        } );
    }

    selectAll(){
        //let users = User.getUsersStorage();
        ajax.open('GET', '/users'); 

        // Define um evento para ser executado quando a requisição for concluída com sucesso.
        ajax.onload = event => {    

            // Inicializa um objeto com um array "users", para armazenar os usuários recebidos.
            let obj = { users: [] };

            try {
                // Tenta converter a resposta do servidor (que vem como texto) em um objeto JSON.
                obj = JSON.parse(ajax.responseText);
            } catch (e) {
                // Caso ocorra um erro na conversão do JSON, exibe a mensagem de erro no console.
                console.error(e);
            }

            // Percorre o array de usuários obtido da resposta da API.
            obj.users.forEach(dataUser => {

                // Cria uma nova instância da classe User.
                let user = new User();

                // Carrega os dados do usuário recebido no objeto da classe User.
                user.loadFromJSON(dataUser);

                // Adiciona o usuário na table-users.
                this.addLine(user);

            });
        };

        // Envia a requisição para o servidor.
        // Como é uma requisição GET, não há necessidade de passar dados no corpo da requisição.
        ajax.send();
           
    }

    /*
        Método para adicionar novas linhas a table "Lista de Usuários" dinamicamente.
    */
    addLine(dataUser){
        /*
            Aqui, a instância da tag "tbody-table-users" é recuperada pelo id, e nela aplica-se o "InnerHTML" que insere outras 
            Tags dinamicamente conforme a Método "addLine(dataUser)" é chamada(quando um novo usuário é criado após o click do 
            botão "submit" no formulário).
        */
            let tr = this.getTr(dataUser);
            
            
            console.log(tr.dataset.user);
        
            this.tableEl.appendChild(tr);
            this.updateCount();
    }

    getTr(dataUser, tr=null){
        if(tr==null) tr = document.createElement('tr');
        //Serializando o dataset(simulando um bd) para JSON string no element tr.
        tr.dataset.user = JSON.stringify(dataUser);
        tr.innerHTML = `
            <td><img src="${dataUser.photo}" alt="User Image" class="img-circle img-sm"></td>
            <td>${dataUser.name}</td>
            <td>${dataUser.email}</td>
            <td>${(dataUser.admin) ? 'Yes': 'No'}</td>
            <td>${Utils.dateFormat(dataUser.register)}</td>
            <td>
                <button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
                <button type="button" class="btn btn-danger btn-delete btn-xs btn-flat">Excluir</button>
            </td>
        `;

        this.addEventsTr(tr);
        return tr;
    }

    addEventsTr(tr){

        tr.querySelector(".btn-delete").addEventListener("click", e => {

            if (confirm("Deseja realmente excluir?")) {

                let user = new User();

                user.loadFromJSON(JSON.parse(tr.dataset.user));

                user.remove();

                tr.remove();

                this.updateCount();

            }

        });

        tr.querySelector(".btn-edit").addEventListener("click", e=>{
            let json = JSON.parse(tr.dataset.user);
              this.formElUpdate.dataset.trIndex = tr.sectionRowIndex;
            
            for(let name in json){
               let field = this.formElUpdate.querySelector("[name =" + name.replace("_","") +  "]");
               if(field){

                switch(field.type){
                    case 'file':
                    break;

                    case'radio':
                        field = this.formElUpdate.querySelector("[name =" + name.replace("_","") +  "][value =" + json[name] + "]");
                        field.checked = true;
                    break;

                    case'checkbox':
                        field.checked = json[name];
                    break;

                    default:
                        field.value = json[name];
                }

               }

            }
            if(json._photo)
                this.formElUpdate.querySelector(".photo").src = json._photo;
            this.showPanelUpdate();
        
        });
    }

    showPanelCreate(){
        document.querySelector("#box-user-create").style.display = "block";
        document.querySelector('#box-user-update').style.display = "none";
    }

    showPanelUpdate(){
        document.querySelector("#box-user-create").style.display = "none";
        document.querySelector('#box-user-update').style.display = "block";
    }

    updateCount(){
        
        let numberUsers = 0;
        let numberAdmin = 0; 

        [...this.tableEl.children].forEach(tr =>{
            numberUsers++;
            let user = JSON.parse(tr.dataset.user);
            //Por transformarmos o Objeto User para JSON, temos que pegar como está no JSON aqui, porque convertemos ele e está como _admin.
            if(user._admin)  numberAdmin++;
        });

        document.querySelector("#number-users").innerHTML = numberUsers;  
        document.querySelector("#number-users-admin").innerHTML = numberAdmin;         
    }

    onSubmit(){
        
        /*
            Caso não usassemos arrow functions, seria necessário guardar o escopo do objeto "this" antes de entrar no EventListener
            porque quando entramos lá, o escopo muda e o "this" passa a referir "formEl".
            
            let thisGlobal = this;  
        
        */

        this.formEl.addEventListener("submit", (event)=>{
            
            event.preventDefault();

            let btnSubmit = this.formEl.querySelector("[type=submit]");
            btnSubmit.disable = true;
            let formValues = this.getValues(this.formEl);
            
            if(!formValues) return false
            //Chama a promise e executa o resolve ou reject com o .then.
            this.getPhoto(this.formEl).then(
                //Arrow Function usadas para não perder o contexto do this.
                (content)=>{
                    formValues.photo = content;
                    formValues.save();
                    this.addLine(formValues);
                    this.formEl.reset();
                    btnSubmit.disable = false;
                },
                (e)=>{
                    console.error(e);
                }
            );
            
        });

    }

    /*
        Relação de onSubmit e getPhoto.
        Usuário submete o formulário ➝ onSubmit captura os valores do formulário.
        O metodo getPhoto retorna uma Promise contendo a foto construida pelo
        FileReader(onload, resolve) ou um erro(onerror,reject) e o onSubmit trata
        esse error com o then(então) que significa: "Quando terminar a Promise, então".
        Ali, duas funções podem ser chamadas dependendo do que acontece no getPhoto, já 
        que as funções esperam paramêtros iguais(content ou e), e as usam como assinatura.
    */

    getPhoto(form){

        //Ao invés de fazer um callback, podemos executar usando Promise. Arrow Function usadas para não perder o contexto do this.
        return new Promise((resolve, reject)=>{
            //Instancica o objeto fileReader
            let fileReader = new FileReader();
            //Procura o elemento photo nos dados do formulário.
            let elements = [...form.elements].filter(item =>{
                if(item.name =='photo') return item;    
            });
            /*
                Captura o primeiro elemento no array elements(porque irá ser só 0 ou 1 elemento) 
                e 1 arquivo só(files[0]).
            */
            let file = elements[0].files[0];

      
            fileReader.onload = () =>{
                resolve(fileReader.result);
            };

            fileReader.onerror = (e) =>{
                reject(e);
            };

            if(file)
                fileReader.readAsDataURL(file);
            else 
                //Se não houver imagem(file == null) resolva com um place holder;
                resolve('dist/img/boxed-bg.jpg');
            
        });

    }

    getValues(form){

        let user = {};
        let isFormValid = true;
        //Tratando os elements como array[] e usando o Spread para detonatar todos os elementos.
        [...form.elements].forEach((field)=>{
            
            if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){
                field.parentElement.classList.add('has-error');
                isFormValid = false;
            }

            if(field.name =="gender"){
                if(field.checked) user[field.name] = field.value;
            }
            else if(field.name =='admin'){
                user[field.name] = field.checked;
            }
            else{
                user[field.name] = field.value;
            }
        });

        if(!isFormValid) return false;

        return new User(
            user.name,
            user.gender,
            user.birth,
            user.country,
            user.email,
            user.password,
            user.photo,
            user.admin
        );

    }
}