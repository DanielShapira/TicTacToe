"use strict";
const Subscriber_1 = require('../Subscriber');
const async_1 = require('../scheduler/async');
/**
 * @param scheduler
 * @return {Observable<TimeInterval<any>>|WebSocketSubject<T>|Observable<T>}
 * @method timeInterval
 * @owner Observable
 */
function timeInterval(scheduler = async_1.async) {
    return this.lift(new TimeIntervalOperator(scheduler));
}
exports.timeInterval = timeInterval;
class TimeInterval {
    constructor(value, interval) {
        this.value = value;
        this.interval = interval;
    }
}
exports.TimeInterval = TimeInterval;
;
class TimeIntervalOperator {
    constructor(scheduler) {
        this.scheduler = scheduler;
    }
    call(observer, source) {
        return source.subscribe(new TimeIntervalSubscriber(observer, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TimeIntervalSubscriber extends Subscriber_1.Subscriber {
    constructor(destination, scheduler) {
        super(destination);
        this.scheduler = scheduler;
        this.lastTime = 0;
        this.lastTime = scheduler.now();
    }
    _next(value) {
        let now = this.scheduler.now();
        let span = now - this.lastTime;
        this.lastTime = now;
        this.destination.next(new TimeInterval(value, span));
    }
}
//# sourceMappingURL=timeInterval.js.map