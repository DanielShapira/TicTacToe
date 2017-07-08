"use strict";
const root_1 = require('./root');
const MapPolyfill_1 = require('./MapPolyfill');
exports.Map = root_1.root.Map || (() => MapPolyfill_1.MapPolyfill)();
//# sourceMappingURL=Map.js.map