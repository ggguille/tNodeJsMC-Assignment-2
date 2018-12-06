const helpers = require('../helpers');
const ModelData = require('./modelData');
const User = require('../models/userModel');

class UserData extends ModelData {
    constructor() {
        super('users');
    }

    create(user) {
        if (user instanceof User) {
            user.password = helpers.hash(user.password);
            return super.create(user);
        }
        return Promise.reject('Error, unknown user model');
    }

    update(id, {name = false, address = false, email = false, password = false}) {
        return new Promise((resolve, reject) => {
            this.get(id).then((user) => {
                if (name) {
                    user.name = name;
                }
                if (address) {
                    user.address = address;
                }
                if (email) {
                    user.email = email;
                }
                if (password) {
                    user.password = helpers.hash(password);
                }

                if (user.isValid) {
                   super.update(id, user).then(resolve).catch(reject);
                } else {
                    reject('Error, invalid parameters');
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    get(id) {
        return super.get(id).then((data) => {
            return new User(data);
        }, (err) => {
            return false;
        });
    }
}

module.exports = UserData;