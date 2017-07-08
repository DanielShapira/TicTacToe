"use strict";
const Subscriber_1 = require('../Subscriber');
const async_1 = require('../scheduler/async');
/**
 * @param scheduler
 * @return {Observable<Timestamp<any>>|WebSocketSubject<T>|Observable<T>}
 * @method timestamp
 * @owner Observable
 */
function timestamp(scheduler = async_1.async) {
    return this.lift(new TimestampOperator(scheduler));
}
exports.timestamp = timestamp;
class Timestamp {
    constructor(value, timestamp) {
        this.value = value;
        this.timestamp = timestamp;
    }
}
exports.Timestamp = Timestamp;
;
class TimestampOperator {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }
    call(observer, source) {
        return source.subscribe(new TimestampSubscriber(observer, this.scheduler));
    }
}
class TimestampSubscriber extends Subscriber_1.Subscriber {
    constructor(destination, scheduler) {
        super(destination);
        this.scheduler = scheduler;
    }
    _next(value) {
        const now = this.scheduler.now();
        this.destination.next(new Timestamp(value, now));
    }
}
//# sourceMappingURL=timestamp.js.map