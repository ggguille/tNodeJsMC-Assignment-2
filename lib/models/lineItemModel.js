const Model = require('./model');

class LineItem extends Model {
    constructor({product, quantity = 1}) {
        super();
        this.product = product;
        this.quantity = quantity;
    }

    get product() {
        return this.data.product;
    }
    set product(value) {
        this.data.product = (typeof value === 'string' ? value : false);
    }

    get quantity() {
        return this.data.quantity;
    }
    set quantity(value) {
        this.data.quantity = (Number.isInteger(value) && value > 0 ? value : false)
    }
}

module.exports = LineItem;