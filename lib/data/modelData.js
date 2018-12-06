const _data = require('./data');
const Model = require('../models/model');

class ModelData {
    constructor(dir) {
        this.dir = dir;
    }

    create(model) {
        if (model instanceof Model && model.isValid) {
            return new Promise((resolve, reject) => {
                _data.create(this.dir, model.id, model, (err) => {
                    if (!err) {
                        resolve();
                    } else {
                        reject('Error');
                    }
                });
            });
        }
        return Promise.reject('Error, unknown model');
    }

    update(file, model) {
        if (model instanceof Model && model.isValid) {
            return new Promise((resolve, reject) => {
                _data.update(this.dir, file, model, (err) => {
                    if (!err) {
                        resolve();
                    } else {
                        reject('Error');
                    }
                });
            });
        }
        return Promise.reject('Error, unknown model');
    }

    get(id) {
        if (typeof(id) == 'string') {
            return new Promise((resolve, reject) => {
                _data.read(this.dir, id, (err, data) => {
                    if (!err && data) {
                        resolve(data);
                    } else {
                        reject('Data not found');
                    }
                });
            });
        }
        return Promise.reject('Error, unknown identifier');
    }

    delete(id) {
        if (typeof(id) == 'string') {
            return new Promise((resolve, reject) => {
                _data.delete(this.dir, id, (err) => {
                    if (!err) {
                        resolve();
                    } else {
                        reject('Error');
                    }
                });
            });
        }
        return Promise.reject('Error, unknown identifier');
    }
}

module.exports = ModelData;