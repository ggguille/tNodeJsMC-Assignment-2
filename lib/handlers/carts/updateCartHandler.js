const CartHandler = require('./cartHandler');
const LineItemModel = require('../../models/lineItemModel')

class UpdateCartHandler extends CartHandler {
    constructor(dataModelProvider) {
        super(dataModelProvider, 'PUT');
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

        const {lineItems = false} = data;
        let lineItemsToUpdate = [];
        let errorParameters = true;
        if (lineItems instanceof Array) {
            lineItemsToUpdate = lineItems.map(data => {
                return new LineItemModel({
                    product: data.product ? data.product : false,
                    quantity: data.quantity ? data.quantity : 0
                });
            });

            errorParameters = 
                (lineItemsToUpdate.filter(model => model.isValid).length !== lineItems.length);
        }

        if (errorParameters) {
            return Promise.resolve({
                'statusCode': 403,
                'data': {'message': 'Error parameters'}
            });
        }

        return cartDataModel.get(user).then(cart => {
            if (!cart) {
                return Promise.reject({
                    'statusCode': 404,
                    'data': {'message': 'User cart not exist'}
                });
            }

            const lineItemsUpdated = cart.lineItems.map(data => {
                const lineItemToUpdate = 
                    lineItemsToUpdate.find(item => item.product === data.product);
                if (lineItemToUpdate) {
                    return lineItemToUpdate;
                }
                return data;
            });

            return new Promise((resolve, reject) => {
                cartDataModel.update(user, lineItemsUpdated).then(() => {
                    cart.lineItems = lineItemsUpdated;
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
                'statusCode': 202,
                'data': {'cart': cart}
            };
        }).catch((err) => {
            return err
        });
    }
}

module.exports = UpdateCartHandler;