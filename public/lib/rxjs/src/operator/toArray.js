"use strict";
const Subscriber_1 = require('../Subscriber');
/**
 * @return {Observable<any[]>|WebSocketSubject<T>|Observable<T>}
 * @method toArray
 * @owner Observable
 */
function toArray() {
    return this.lift(new ToArrayOperator());
}
exports.toArray = toArray;
class ToArrayOperator {
    call(subscriber, source) {
        return source.subscribe(new ToArraySubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ToArraySubscriber extends Subscriber_1.Subscriber {
    constructor(destination) {
        super(destination);
        this.array = [];
    }
    _next(x) {
        this.array.push(x);
    }
    _complete() {
        this.destination.next(this.array);
        this.destination.complete();
    }
}
//# sourceMappingURL=toArray.js.map