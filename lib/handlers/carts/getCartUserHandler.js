const CartHandler = require('./cartHandler');

class GetCartUserHandler extends CartHandler {
    constructor(dataModelProvider) {
        super(dataModelProvider, 'GET');
    }

    handle({headers}) {
        return this.getUserCart(headers.user).then(cartModel => {
            return {
                'statusCode': 200,
                'data': cartModel
            };
        }).catch(err => {
            return err;
        })
    }
}

module.exports = GetCartUserHandler;