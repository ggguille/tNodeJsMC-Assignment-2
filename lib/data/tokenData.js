const ModelData = require('./modelData');
const Token = require('../models/tokenModel');

class TokenData extends ModelData {
    constructor() {
        super('tokens');
    }

    create(token) {
        if (token instanceof Token) {
            return super.create(token);
        }
        return Promise.reject('Error, unknown token model');
    }

    update(id, {expires = false}) {
        return new Promise((resolve, reject) => {
            this.get(id).then((token) => {
                if (expires) {
                    token.expires = expires;
                }
                
                if (token.isValid) {
                   super.update(id, token).then(resolve).catch(reject);
                } else {
                    reject('Error, invalid parameters');
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    get(id) {
        return new Promise((resolve, reject) => {
            super.get(id).then((data) => {
                resolve(new Token(data));
            }).catch(reject);
        });
    }
}

module.exports = TokenData;