const TokenHandler = require('./tokenHandler');

class DeleteTokenHandler extends TokenHandler {
    
    constructor(dataModelProvider) {
        super(dataModelProvider, 'DELETE');
    }

    handle({headers, data}) {
        const {id} = data;
        const tokenDatModel = this._dataModelProvider.tokens;
        return tokenDatModel.delete(id).then(() => {
            return {
                'statusCode': 200,
                'data': {'message': 'Token deleted'}
            };
        }).catch((err) => {
            return {
                'statusCode': 500,
                'data': {'message': err}
            };
        });
    }
}

module.exports = DeleteTokenHandler;