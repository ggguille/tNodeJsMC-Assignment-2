const CartHandler = require('./cartHandler');

class DeleteFromCartHandler extends CartHandler {
    constructor(dataModelProvider) {
        super(dataModelProvider, 'DELETE');
    }

    handle({headers, data}) {
        const user = typeof(headers.user) === 'string' ? headers.user : false;
        if (!user) {
            return Promise.resolve({
                'statusCode': 403,
                'data': {'message': 'User not sent'}
            });
        }

        const cartDataModel = this._dataModelProvider.carts;

        const {product} = data;
        return this.getUserCart(user).then(cart => {
            let productNotFound = true;
            const lineItems = cart.lineItems.filter(cartLineItem => {
                if (cartLineItem.product !== product) {
                    return cartLineItem;
                } else {
                    productNotFound = false;
                }
            });

            if (productNotFound) {
                return Promise.reject({
                    'statusCode': 404,
                    'data': {'message': 'Product not found into cart'}
                });
            }

            return new Promise((resolve, reject) => {
                cartDataModel.update(user, lineItems).then(() => {
                    cart.lineItems = lineItems;
                    resolve(cart);
                }).catch((err) => {
                    reject({
                        'statusCode': 500,
                        'data': {'message': err}
                    });
                });
            });
        }).then((cart) => {
            return {
                'statusCode': 200,
                'data': {'cart': cart}
            };
        }).catch((err) => {
            return err
        });
    }
}

module.exports = DeleteFromCartHandler;