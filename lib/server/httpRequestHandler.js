/**
 * Classes to handle http server requests
 */
'use strict';

const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

class Handler {
    static validate(handler) {
        return (
            typeof(handler.id) === 'string' &&
            typeof(handler.method) === 'string' &&
            typeof(handler.handle) === 'function'
        );
    }

    constructor(id = '', method = '') {
        this._data = {
            'id': id,
            'method': method
        };
    }

    get method() {
        return this._data.method;
    }
    
    get id() {
        return this._data.id;
    }

    handle({headers, data}) {
        return Promise.resolve({
            'statusCode': 200,
            'data': {'message': 'It works!'}
        });
    }
}

class NotFoundHandler extends Handler {
    handle() {
        return Promise.resolve({
            'statusCode': 404,
            'data': {'message': 'Not found!'}
        });
    }
}

class Middleware {
    static validate(middleware) {
        return (
            typeof(middleware.name) === 'string' &&
            typeof(middleware.handle) === 'function' &&
            typeof(middleware.handle) === 'function'
        );
    }

    constructor(name = 'middleware') {
        this.name = name;
        this.requests = [];
    }

    addRequest({method, id}) {
        this.requests.push({
            'method': method.toUpperCase(),
            'id': id
        });
    }

    match({method, id}) {
        let found = false;
        let i = 0;
        let req;
        while (!found && i < this.requests.length) {
            req = this.requests[i];
            found = (req.id === id && req.method === method);
            i++;
        }
        return found;
    }

    handle({headers, data}, handler) {
        if (Handler.validate(handler)) {
            return handler.handle({
                'headers': headers, 
                'data': data
            });
        } else {
            return Promise.resolve({
                'statusCode': 500,
                'data': {'message': 'Error'}
            });
        }
    }
}

class HandlerManager {
    static validate(handlerManager) {
        return (
            typeof(handlerManager.addHandler) === 'function' &&
            typeof(handlerManager.handle) === 'function'
        );
    }

    constructor() {
        this.handlers = {};
        this.middlewares = {};
    }

    // Add handler for a specific request
    addHandler(handler, middlewareName = null) {
        if (Handler.validate(handler)) {
            let key = `${handler.method.toUpperCase()}.${handler.id}`;
            this.handlers[key] = handler;
            if (middlewareName && this.middlewares[middlewareName]) {
                this.middlewares[middlewareName].addRequest({
                    'method': handler.method.toUpperCase(),
                    'id': handler.id
                });
            }
        }
    }

    getHandler({method, path}) {
        // Get specific request handler
        let handler;
        const trimmedPath = path.replace(/^\/+|\/+$/g, '');
        if (trimmedPath === '') {
            handler = new Handler();
        } else {
            handler = this.handlers[`${method.toUpperCase()}.${trimmedPath}`];
        }

        if (typeof(handler) === 'undefined') {
            // If one is not found, use the notFound handler
            return new NotFoundHandler();
        } else {
            return handler;
        }
    }

    addMiddleware(middleware) {
        if (Middleware.validate(middleware)) {
            this.middlewares[middleware.name] = middleware;
        }
    }

    getMiddleware({method, path}) {
        const trimmedPath = path.replace(/^\/+|\/+$/g, '');
        if (trimmedPath === '') {
            return null;
        }

        let middleware = null;
        let middlewareKeys = Object.keys(this.middlewares);
        let i = 0;
        while (!middleware && i < middlewareKeys.length) {
            let middlewareName = middlewareKeys[i];
            if (this.middlewares[middlewareName].match({'method': method, 'id': trimmedPath})) {
                middleware = this.middlewares[middlewareName];
            }
            i++;
        }

        return middleware;
    }

    // Handle http request
    handle(request, response) {
        // Get the url and parse it
        const parsedUrl = url.parse(request.url);

        const middleware = this.getMiddleware({
            'method': request.method,
            'path': parsedUrl.pathname
        });

        // Choose the handler this request should go to.
        const requestHandler = this.getHandler({
            'method': request.method,
            'path': parsedUrl.pathname
        });
        
         // Get the payload, if any
        const decoder = new StringDecoder('utf-8');
        let buffer = '';
        request.on('data', (data) => {
            buffer += decoder.write(data);
        });
        request.on('end', () => {
            buffer += decoder.end();
            const payload = buffer === '' ? null : JSON.parse(buffer);
            // Get handler data to response
            if (middleware) {
                middleware.handle({
                    'headers': request.headers,
                    'data': Object.assign({}, parsedUrl.query, payload)
                }, requestHandler).then(({statusCode, data}) => {
                    // Send response
                    this.sendResponse(response, {
                        'statusCode': statusCode,
                        'data': data
                    });
                });
            } else {
                requestHandler.handle({
                    'headers': request.headers,
                    'data': Object.assign({}, parsedUrl.query, payload)
                }).then(({statusCode, data}) => {
                    // Send response
                    this.sendResponse(response, {
                        'statusCode': statusCode,
                        'data': data
                    });
                });
            }            
        });
    }

    sendResponse(response, {statusCode, data}) {
        response.setHeader('Content-Type', 'application/json');
        response.writeHead(statusCode);
        response.end(JSON.stringify(data));
    }
}

module.exports = {
    'Handler': Handler,
    'Middleware': Middleware,
    'HandlerManager': HandlerManager
}