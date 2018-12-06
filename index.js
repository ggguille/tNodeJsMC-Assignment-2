/**
 * Homework Assignment #1
 * Main file
 */
'use strict';

// Dependencies
const fs = require('fs');
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

// Instantiate HTTP request handler manager

// Instantiate HTTP server
const httpServer = new HttpServer.Builder('http')
    .setHandlerManager(handlerManager)
    .build();
// Start HTTP server
httpServer.listen(config.httpPort);