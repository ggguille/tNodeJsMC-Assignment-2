const helpers = require('../helpers');
const Model = require('./model');

class User extends Model {
    constructor({name, email, address, password, id = false}) {
        super();
        this.id = id || helpers.createRandomString(20);
        this.name = name;
        this.email = email;
        this.address = address
        this.password = password;
    }

    get id() {
        return this.data.id;
    }
    set id(value) {
        this.data.id = typeof(value) == 'string' && value.trim().length == 20 ? value : false;
    }

    get name() {
        return this.data.name;
    }
    set name(value) {
        this.data.name = typeof(value) == 'string' && value.trim().length > 0 ? value : false;
    }

    get password() {
        return this.data.password;
    }
    set password(value) {
        this.data.password = typeof(value) == 'string' && value.trim().length > 0 ? value : false;
    }

    get email() {
        return this.data.email;
    }
    set email(value) {
        this.data.email = helpers.validateEmail(value) ? value : false;
    }

    get address() {
        return this.data.address;
    }
    set address(value) {
        this.data.address = typeof(value) == 'string' && value.trim().length > 0 ? value : false;
    }    
}

module.exports = User;