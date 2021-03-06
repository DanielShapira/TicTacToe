"use strict";
const Observable_1 = require('../Observable');
const Subscription_1 = require('../Subscription');
const SubscriptionLoggable_1 = require('./SubscriptionLoggable');
const applyMixins_1 = require('../util/applyMixins');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ColdObservable extends Observable_1.Observable {
    constructor(messages, scheduler) {
        super(function (subscriber) {
            const observable = this;
            const index = observable.logSubscribedFrame();
            subscriber.add(new Subscription_1.Subscription(() => {
                observable.logUnsubscribedFrame(index);
            }));
            observable.scheduleMessages(subscriber);
            return subscriber;
        });
        this.messages = messages;
        this.subscriptions = [];
        this.scheduler = scheduler;
    }
    scheduleMessages(subscriber) {
        const messagesLength = this.messages.length;
        for (let i = 0; i < messagesLength; i++) {
            const message = this.messages[i];
            subscriber.add(this.scheduler.schedule(({ message, subscriber }) => { message.notification.observe(subscriber); }, message.frame, { message, subscriber }));
        }
    }
}
exports.ColdObservable = ColdObservable;
applyMixins_1.applyMixins(ColdObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);
//# sourceMappingURL=ColdObservable.js.map