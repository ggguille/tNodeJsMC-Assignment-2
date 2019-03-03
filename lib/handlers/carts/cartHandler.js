const Handler = require('../../server/httpRequestHandler').Handler;
const CartModel = require('../../models/cartModel');

class CartHandler extends Handler {
    
    constructor(dataModelProvider, method = 'GET') {
        super('cart', method);
        this._dataModelProvider = dataModelProvider;
    }

    getUserCart(user) {
        const userModelProvider = this._dataModelProvider.users;
        const cartModelProvider = this._dataModelProvider.carts;
        return userModelProvider.get(user).then(userModel => {
            if (!userModel) {
                throw {
                    'statusCode': 403,
                    'data': {'message': 'User not found'}
                };
            }
            return userModel;            
        }).then(userModel => {
            return cartModelProvider.get(user);
        }).then(cart => {
            if (cart) {
                return cart;
            } 
            const newCart = new CartModel({'user': user});
            return cartModelProvider.create(newCart)
                .then(() => newCart)
                .catch(err => Promise.reject({
                    'statusCode': 500,
                    'data': {'message': err}
                }))
        });
    }

    handle({headers, data}) {
        return Promise.resolve({
            'statusCode': 200,
            'data': {'message': 'Cart handler works!'}
        });
    }
}

module.exports = CartHandler;