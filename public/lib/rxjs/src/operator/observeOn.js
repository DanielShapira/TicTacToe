"use strict";
const Subscriber_1 = require('../Subscriber');
const Notification_1 = require('../Notification');
/**
 * @see {@link Notification}
 *
 * @param scheduler
 * @param delay
 * @return {Observable<R>|WebSocketSubject<T>|Observable<T>}
 * @method observeOn
 * @owner Observable
 */
function observeOn(scheduler, delay = 0) {
    return this.lift(new ObserveOnOperator(scheduler, delay));
}
exports.observeOn = observeOn;
class ObserveOnOperator {
    constructor(scheduler, delay = 0) {
        this.scheduler = scheduler;
        this.delay = delay;
    }
    call(subscriber, source) {
        return source.subscribe(new ObserveOnSubscriber(subscriber, this.scheduler, this.delay));
    }
}
exports.ObserveOnOperator = ObserveOnOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ObserveOnSubscriber extends Subscriber_1.Subscriber {
    constructor(destination, scheduler, delay = 0) {
        super(destination);
        this.scheduler = scheduler;
        this.delay = delay;
    }
    static dispatch(arg) {
        const { notification, destination } = arg;
        notification.observe(destination);
    }
    scheduleMessage(notification) {
        this.add(this.scheduler.schedule(ObserveOnSubscriber.dispatch, this.delay, new ObserveOnMessage(notification, this.destination)));
    }
    _next(value) {
        this.scheduleMessage(Notification_1.Notification.createNext(value));
    }
    _error(err) {
        this.scheduleMessage(Notification_1.Notification.createError(err));
    }
    _complete() {
        this.scheduleMessage(Notification_1.Notification.createComplete());
    }
}
exports.ObserveOnSubscriber = ObserveOnSubscriber;
class ObserveOnMessage {
    constructor(notification, destination) {
        this.notification = notification;
        this.destination = destination;
    }
}
exports.ObserveOnMessage = ObserveOnMessage;
//# sourceMappingURL=observeOn.js.map