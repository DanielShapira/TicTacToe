"use strict";
const Observable_1 = require('../../Observable');
const finally_1 = require('../../operator/finally');
Observable_1.Observable.prototype.finally = finally_1._finally;
Observable_1.Observable.prototype._finally = finally_1._finally;
//# sourceMappingURL=finally.js.map