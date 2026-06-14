"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHash = generateHash;
const crypto = require("crypto");
function sortObject(obj) {
    if (Array.isArray(obj)) {
        return obj.map(sortObject);
    }
    else if (obj !== null && typeof obj === 'object') {
        return Object.keys(obj).sort().reduce((result, key) => {
            result[key] = sortObject(obj[key]);
            return result;
        }, {});
    }
    return obj;
}
function generateHash(obj) {
    const sorted = sortObject(obj);
    const jsonString = JSON.stringify(sorted);
    return crypto.createHash('sha256').update(jsonString).digest('hex');
}
//# sourceMappingURL=util.functions.js.map