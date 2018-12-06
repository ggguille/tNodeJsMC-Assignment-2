const TokenHandler = require('./tokenHandler');
const TokenModel = require('../../models/tokenModel');
const helpers = require('../../helpers');

class CreateTokenHandler extends TokenHandler {
    constructor(dataModelProvider) {
        super(dataModelProvider, 'POST');
    }

    handle({headers, data}) {
        const {id, password} = data;

        const userDataModel = this._dataModelProvider.users;
        const tokenDataModel = this._dataModelProvider.tokens;

        return userDataModel.get(id).then((user) => {
            if (user) {
                let hashPassword = helpers.hash(password);
                return user.password === hashPassword;
            }
            throw {
                'statusCode': 403,
                'data': {'message': 'User not found'}
            };
        }).then((isUser) => {
            if (isUser) {
                return new TokenModel({'user': id});
            }
            throw {
                'statusCode': 403,
                'data': {'message': 'Password error'}
            };
        }).then((tokenModel) => {
            return new Promise((resolve, reject) => {
                tokenDataModel.create(tokenModel).then(() => {
                    resolve(tokenModel.id);
                })
                .catch((err) => {
                    reject({
                        'statusCode': 500,
                        'data': {'message': err}
                    });
                });
            });
        }).then((tokenId) => {
            return {
                'statusCode': 200,
                'data': {'token_id': tokenId}
            };
        }).catch((err) => {
            return err
        });
    }
}

module.exports = CreateTokenHandler;