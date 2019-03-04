/**
 * Homework Assignment #2
 * Main file
 */
'use strict';

// Dependencies
const config = require('./lib/config');
const HttpServer = require('./lib/server/httpServer');
const HandlerManager = require('./lib/server/httpRequestHandler').HandlerManager;
const ModelDataProvider = require('./lib/data/modelDataProvider');

// Http Handler Manager
const handlerManager = new HandlerManager();

// Model Data
const modelDataProvider = new ModelDataProvider();

// Middlewares
const AuthoritationMiddleware = require('./lib/middlewares/authoritationMiddleware');
handlerManager.addMiddleware(new AuthoritationMiddleware(modelDataProvider));

// User handlers
const CreateUserHandler = require('./lib/handlers/users/createUserHandler');
handlerManager.addHandler(new CreateUserHandler(modelDataProvider));
const ProfileUserHandler = require('./lib/handlers/users/profileUserHandler');
handlerManager.addHandler(
    new ProfileUserHandler(modelDataProvider),
    AuthoritationMiddleware.getName()
);
const EditUserHandler = require('./lib/handlers/users/editUserHandler');
handlerManager.addHandler(
    new EditUserHandler(modelDataProvider),
    AuthoritationMiddleware.getName()
);
const DeleteUserHandler = require('./lib/handlers/users/deleteUserHandler');
handlerManager.addHandler(
    new DeleteUserHandler(modelDataProvider),
    AuthoritationMiddleware.getName()
);

// Token handlers
const CreateTokenHandler = require('./lib/handlers/tokens/createTokenHandler');
handlerManager.addHandler(new CreateTokenHandler(modelDataProvider));
const DeleteTokenHandler = require('./lib/handlers/tokens/deleteTokenHandler');
handlerManager.addHandler(new DeleteTokenHandler(modelDataProvider));

// Product handlers
const ListProductsHandler = require('./lib/handlers/products/listProductsHandler');
handlerManager.addHandler(
    new ListProductsHandler(modelDataProvider),
    AuthoritationMiddleware.getName()
);

// Cart handlers
const GetCartUserHandler = require('./lib/handlers/carts/getCartUserHandler');
handlerManager.addHandler(
    new GetCartUserHandler(modelDataProvider),
    AuthoritationMiddleware.getName()
);
const AddToCartHandler = require('./lib/handlers/carts/addToCartHandler');
handlerManager.addHandler(
    new AddToCartHandler(modelDataProvider),
    AuthoritationMiddleware.getName()
);
const DeleteFromCartHandler = require('./lib/handlers/carts/deleteFromCartHandler');
handlerManager.addHandler(
    new DeleteFromCartHandler(modelDataProvider),
    AuthoritationMiddleware.getName()
);
const UpdateCartHandler = require('./lib/handlers/carts/updateCartHandler');
handlerManager.addHandler(
    new UpdateCartHandler(modelDataProvider),
    AuthoritationMiddleware.getName()
);

// Instantiate HTTP server
const httpServer = new HttpServer.Builder('http')
    .setHandlerManager(handlerManager)
    .build();
// Start HTTP server
httpServer.listen(config.httpPort);