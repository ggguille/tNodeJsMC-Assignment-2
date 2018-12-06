const helpers = require('../helpers');
const Model = require('./model');

class Token extends Model {
    constructor({user, id = false, expires = false}) {
        super();
        this.id = id || helpers.createRandomString(20);
        this.user = user;
        // default: set expiration date 1 hour in the future
        this.expires = expires || Date.now() + 1000 * 60 * 60;
    }

    get id() {
        return this.data.id;
    }
    set id(value) {
        this.data.id = typeof(value) == 'string' && value.trim().length == 20 ? value : false;
    }

    get user() {
        return this.data.user;
    }
    set user(value) {
        this.data.user = typeof(value) == 'string' && value.trim().length == 20 ? value : false;
    }

    get expires() {
        return this.data.expires;
    }
    set expires(value) {
        this.data.expires = typeof(value) == 'number' ? value : false;
    }
}

module.exports = Token;