const Handler = require('../../server/httpRequestHandler').Handler;

class ListProductsHandler extends Handler {

    constructor(dataModelProvider) {
        super('products', 'GET');
        this._dataModelProvider = dataModelProvider;
    }

    handle({headers, data}) {
        let productModelData = this._dataModelProvider.products;
        return productModelData.list().then((products) => {
            if (products) {
                return {
                    'statusCode': 200,
                    'data': {'products': products}
                };
            } else {
                return {
                    'statusCode': 500,
                    'data': {'message': 'Products not found'}
                }; 
            }
        });
    }
}

module.exports = ListProductsHandler;