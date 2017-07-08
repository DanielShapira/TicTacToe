"use strict";
const root_1 = require('./root');
function assignImpl(target, ...sources) {
    const len = sources.length;
    for (let i = 0; i < len; i++) {
        const source = sources[i];
        for (let k in source) {
            if (source.hasOwnProperty(k)) {
                target[k] = source[k];
            }
        }
    }
    return target;
}
exports.assignImpl = assignImpl;
;
function getAssign(root) {
    return root.Object.assign || assignImpl;
}
exports.getAssign = getAssign;
exports.assign = getAssign(root_1.root);
//# sourceMappingURL=assign.js.map