const UserHandler = require('./userHandler');

class DeleteUserHandler extends UserHandler {
    
    constructor(dataModelProvider) {
        super(dataModelProvider, 'DELETE');
    }

    handle({headers, data}) {
        // TODO: delete rest of user data
        const userDataModel = this._dataModelProvider.users;
        return userDataModel.delete(headers.user).then(() => {
            return {
                'statusCode': 200,
                'data': {'message': 'User deleted'}
            };
        }).catch((err) => {
            return {
                'statusCode': 500,
                'data': {'message': err}
            };
        });
    }
}

module.exports = DeleteUserHandler;