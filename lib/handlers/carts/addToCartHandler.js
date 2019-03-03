const CartHandler = require('./cartHandler');
const LineItemModel = require('../../models/lineItemModel')

class AddToCartHandler extends CartHandler {
    constructor(dataModelProvider) {
        super(dataModelProvider, 'POST');
    }

    handle({headers, data}) {
        const user = typeof(headers.user) === 'string' ? headers.user : false;
        if (!user) {
            return Promise.reject({
                'statusCode': 403,
                'data': {'message': 'User not sent'}
            });
        }

        const productDataModel = this._dataModelProvider.products;
        const cartDataModel = this._dataModelProvider.carts;

        const {product} = data;
        const lineItem = new LineItemModel({product});
        if (!lineItem.isValid) {
            return Promise.reject({
                'statusCode': 403,
                'data': {'message': 'Error parameters'}
            });
        }

        return productDataModel.get(lineItem.product).then(productModel => {
            if (!productModel) {
                throw {
                    'statusCode': 403,
                    'data': {'message': 'Product not found'}
                };
            }
            return this.getUserCart(user);
        }).then(cart => {
            const existsProductInCart = false;
            const lineItems = cart.lineItems.map(cartLineItem => {
                if (cartLineItem.product === lineItem.product) {
                    existsProductInCart = true;
                    return new ListItem({
                        product: cartLineItem.product,
                        quantity: cartLineItem.quantity + 1
                    });
                }
                return cartLineItem;
            });

            if (!existsProductInCart) {
                lineItems.push(lineItem);
            }

            return new Promise((resolve, reject) => {
                cartDataModel.update(user, lineItems).then(() => {
                    cart.lineItems = lineItems;
                    resolve(cart);
                }).catch((err) => {
                    reject({
                        'statusCode': 500,
                        'data': {'message': err.message}
                    });
                });
            });
        }).then((cart) => {
            return {
                'statusCode': 201,
                'data': {'cart': cart}
            };
        }).catch((err) => {
            return err
        });
    }
}

module.exports = AddToCartHandler;