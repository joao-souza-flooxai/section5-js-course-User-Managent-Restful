class User{

    constructor(name, gender, birth, country, email, password, photo, admin){

        this._id;
        this._name = name;
        this._gender = gender;
        this._birth = birth;
        this._country = country;
        this._email = email;
        this._password = password;
        this._photo = photo;
        this._admin = admin;
        this._register = new Date();

    }

    get id(){
        return this._id;
    }

    get register(){
        return this._register;
    }

    get name(){
        return this._name;
    }

    get gender() {
        return this._gender;
    }

    get birth() {
        return this._birth;
    }

    get country() {
        return this._country;
    }

    get email() {
        return this._email;
    }

    get photo() {
        return this._photo;
    }

    get admin() {
        return this._admin;
    }

    set photo(value){
        this._photo = value;
    }

    loadFromJSON(json){
        for (let name in json){
            switch(name){
                case '_register':
                    this[name] = new Date(json[name]);
                break;
                default:
                    if(name.substring(0, 1) === '_') this[name] = json[name];

            }
        }
    }


    static getUsersStorage() {

        let users = [];

        if (localStorage.getItem("users")) {

            users = JSON.parse(localStorage.getItem("users"));

        }

        return users;

    }

    toJSON(){
    //Metodo para transformar o objeto em um json
        let json = {};
        Object.keys(this).forEach(key => {
            if (this[key] !== undefined) json[key] = this[key];
        });

        return json;

    }


    save(){

        return new Promise((resolve, reject) => {

            let promise;

            if (this.id) {
                //Se já existir id desse objeto, edite(put)
                promise = HttpRequest.put(`/users/${this.id}`, this.toJSON());

            } else {
                 //Se não existir, crie(post)
                promise = HttpRequest.post(`/users`, this.toJSON());

            }

            promise.then(data => {

                this.loadFromJSON(data);

                resolve(this);

            }).catch(e => {

                reject(e);

            });

        });
    }

    remove(){
        return HttpRequest.delete(`/users/${this.id}`);
    }

}