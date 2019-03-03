const helpers = require('../helpers');
const ModelData = require('./modelData');
const Cart = require('../models/cartModel');

class CartData extends ModelData {
    constructor() {
        super('carts');
    }

    create(cart) {
        if (cart instanceof Cart) {
            return super.create(cart);
        }
        return Promise.reject('Error, unknown cart model');
    }

    update(user, lineItems) {
        return new Promise((resolve, reject) => {
            this.get(user).then((cart) => {
                if (lineItems) {
                    cart.lineItems = lineItems;
                }

                if (cart.isValid && cart.lineItems.length === lineItems.length) {
                   super.update(user, cart).then(resolve).catch(reject);
                } else {
                    reject('Error, invalid parameters');
                }
            }).catch((err) => {
                reject(err);
            });
        });
    }

    get(user) {
        return super.get(user).then((data) => {
            return new Cart(data);
        }, (err) => {
            return false;
        });
    }
}

module.exports = CartData;