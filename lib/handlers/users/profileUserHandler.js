const UserHandler = require('./userHandler');

class ProfileUserHandler extends UserHandler {

    constructor(dataModelProvider) {
        super(dataModelProvider, 'GET');
    }

    handle({headers}) {
        const userDataModel = this._dataModelProvider.users;
        return userDataModel.get(headers.user).then((userModel) => {
            delete userModel.data.password;
            return {
                'statusCode': 200,
                'data': userModel
            };
        }).catch((err) => {
            return {
                'statusCode': 500,
                'data': {'message': err}
            };
        });
    }
}

module.exports = ProfileUserHandler;