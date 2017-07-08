"use strict";
const SubscribeOnObservable_1 = require('../observable/SubscribeOnObservable');
/**
 * Asynchronously subscribes Observers to this Observable on the specified Scheduler.
 *
 * <img src="./img/subscribeOn.png" width="100%">
 *
 * @param {Scheduler} the Scheduler to perform subscription actions on.
 * @return {Observable<T>} the source Observable modified so that its subscriptions happen on the specified Scheduler
 .
 * @method subscribeOn
 * @owner Observable
 */
function subscribeOn(scheduler, delay = 0) {
    return this.lift(new SubscribeOnOperator(scheduler, delay));
}
exports.subscribeOn = subscribeOn;
class SubscribeOnOperator {
    constructor(scheduler, delay) {
        this.scheduler = scheduler;
        this.delay = delay;
    }
    call(subscriber, source) {
        return new SubscribeOnObservable_1.SubscribeOnObservable(source, this.delay, this.scheduler).subscribe(subscriber);
    }
}
//# sourceMappingURL=subscribeOn.js.map