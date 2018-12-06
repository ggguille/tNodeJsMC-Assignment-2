/**
 * Class to validate and generate model data
 */
class Model {
    constructor() {
        this.data = {};
    }

    get isValid() {
        if (typeof(this.data) == 'object') {
            let isValid = true;
            for (let prop in this.data) {
                if (!this.data[prop]) {
                    isValid = false;
                }
            }
            return isValid;
        }
        return false;
    }

    toJSON() {
        return this.data;
    }
}

module.exports = Model;