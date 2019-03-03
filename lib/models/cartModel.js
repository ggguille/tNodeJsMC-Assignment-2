const Model = require('./model');
const LineItemModel = require('./lineItemModel')

class Cart extends Model {
    constructor({user, lineItems = []}) {
        super();
        this.id = user;
        this.user = user;
        this.lineItems = lineItems;
    }

    get user() {
        return this.data.user;
    }
    set user(value) {
        this.data.user = typeof(value) == 'string' && value.trim().length == 20 ? value : false;
    }

    get lineItems() {
        return this.data.lineItems;
    }
    set lineItems(value) {
        if (value instanceof Array) {
            this.data.lineItems = [];
            value.forEach(item => {
                if (item instanceof LineItemModel && item.isValid) {
                    this.data.lineItems.push(item);
                }
            })
        } else {
            this.data.lineItems = false;
        }
    }    
}

module.exports = Cart;