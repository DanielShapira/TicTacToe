"use strict";
exports.empty = {
    closed: true,
    next(value) { },
    error(err) { throw err; },
    complete() { }
};
//# sourceMappingURL=Observer.js.map