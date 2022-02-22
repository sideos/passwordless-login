"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItem = exports.setItem = void 0;
var storage = {};
const setItem = (key, value) => {
    storage[key] = value;
};
exports.setItem = setItem;
const getItem = (key) => {
    return storage[key] || null;
};
exports.getItem = getItem;
// module.exports.setItem = (key, value) => {
//   storage[key] = value
// }
// module.exports.getItem = (key) => {
//   return storage[key] || null
// }
//# sourceMappingURL=redis.js.map