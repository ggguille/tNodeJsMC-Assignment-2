const TokenModelData = require('./tokenData');
const UserModelData = require('./userData');
const ProductModelData = require('./productData');
const CartModelData = require('./cartData');

const provideDataModel = (dataModels, key, dataModelClass) => {
    if (typeof dataModels[key] === 'undefined')
        dataModels[key] = new dataModelClass();

    return dataModels[key];
};

class ModelDataProvider {
    constructor() {
        this._dataModels = {};
    }

    get tokens() {
        return provideDataModel(this._dataModels, 'tokens', TokenModelData);
    }
    
    get users() {
        return provideDataModel(this._dataModels, 'users', UserModelData);
    }

    get products() {
        return provideDataModel(this._dataModels, 'products', ProductModelData);
    }

    get carts() {
        return provideDataModel(this._dataModels, 'carts', CartModelData);
    }
}

module.exports = ModelDataProvider;