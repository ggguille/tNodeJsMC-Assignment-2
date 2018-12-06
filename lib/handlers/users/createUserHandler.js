const UserHandler = require('./userHandler');
const UserModel = require('../../models/userModel');

class CreateUserHandler extends UserHandler {
    constructor(dataModelProvider) {
        super(dataModelProvider, 'POST');
    }

    handle({headers, data}) {
        const userDataModel = this._dataModelProvider.users;
        const model = new UserModel(data);
        return userDataModel.create(model).then(() => {
                return {
                    'statusCode': 200,
                    'data': {
                        'user_id': model.id
                    }
                };
            }).catch((err) => {
                return {
                    'statusCode': 500,
                    'data': {'message': err}
                };
            });
    }
}

module.exports = CreateUserHandler;