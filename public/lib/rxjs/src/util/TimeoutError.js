"use strict";
/**
 * An error thrown when duetime elapses.
 *
 * @see {@link timeout}
 *
 * @class TimeoutError
 */
class TimeoutError extends Error {
    constructor() {
        const err = super('Timeout has occurred');
        this.name = err.name = 'TimeoutError';
        this.stack = err.stack;
        this.message = err.message;
    }
}
exports.TimeoutError = TimeoutError;
//# sourceMappingURL=TimeoutError.js.map