"use strict";
const Observable_1 = require('../Observable');
const Notification_1 = require('../Notification');
const ColdObservable_1 = require('./ColdObservable');
const HotObservable_1 = require('./HotObservable');
const SubscriptionLog_1 = require('./SubscriptionLog');
const VirtualTimeScheduler_1 = require('../scheduler/VirtualTimeScheduler');
const defaultMaxFrame = 750;
class TestScheduler extends VirtualTimeScheduler_1.VirtualTimeScheduler {
    constructor(assertDeepEqual) {
        super(VirtualTimeScheduler_1.VirtualAction, defaultMaxFrame);
        this.assertDeepEqual = assertDeepEqual;
        this.hotObservables = [];
        this.coldObservables = [];
        this.flushTests = [];
    }
    createTime(marbles) {
        const indexOf = marbles.indexOf('|');
        if (indexOf === -1) {
            throw new Error('marble diagram for time should have a completion marker "|"');
        }
        return indexOf * TestScheduler.frameTimeFactor;
    }
    createColdObservable(marbles, values, error) {
        if (marbles.indexOf('^') !== -1) {
            throw new Error('cold observable cannot have subscription offset "^"');
        }
        if (marbles.indexOf('!') !== -1) {
            throw new Error('cold observable cannot have unsubscription marker "!"');
        }
        const messages = TestScheduler.parseMarbles(marbles, values, error);
        const cold = new ColdObservable_1.ColdObservable(messages, this);
        this.coldObservables.push(cold);
        return cold;
    }
    createHotObservable(marbles, values, error) {
        if (marbles.indexOf('!') !== -1) {
            throw new Error('hot observable cannot have unsubscription marker "!"');
        }
        const messages = TestScheduler.parseMarbles(marbles, values, error);
        const subject = new HotObservable_1.HotObservable(messages, this);
        this.hotObservables.push(subject);
        return subject;
    }
    materializeInnerObservable(observable, outerFrame) {
        const messages = [];
        observable.subscribe((value) => {
            messages.push({ frame: this.frame - outerFrame, notification: Notification_1.Notification.createNext(value) });
        }, (err) => {
            messages.push({ frame: this.frame - outerFrame, notification: Notification_1.Notification.createError(err) });
        }, () => {
            messages.push({ frame: this.frame - outerFrame, notification: Notification_1.Notification.createComplete() });
        });
        return messages;
    }
    expectObservable(observable, unsubscriptionMarbles = null) {
        const actual = [];
        const flushTest = { actual, ready: false };
        const unsubscriptionFrame = TestScheduler
            .parseMarblesAsSubscriptions(unsubscriptionMarbles).unsubscribedFrame;
        let subscription;
        this.schedule(() => {
            subscription = observable.subscribe(x => {
                let value = x;
                // Support Observable-of-Observables
                if (x instanceof Observable_1.Observable) {
                    value = this.materializeInnerObservable(value, this.frame);
                }
                actual.push({ frame: this.frame, notification: Notification_1.Notification.createNext(value) });
            }, (err) => {
                actual.push({ frame: this.frame, notification: Notification_1.Notification.createError(err) });
            }, () => {
                actual.push({ frame: this.frame, notification: Notification_1.Notification.createComplete() });
            });
        }, 0);
        if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
            this.schedule(() => subscription.unsubscribe(), unsubscriptionFrame);
        }
        this.flushTests.push(flushTest);
        return {
            toBe(marbles, values, errorValue) {
                flushTest.ready = true;
                flushTest.expected = TestScheduler.parseMarbles(marbles, values, errorValue, true);
            }
        };
    }
    expectSubscriptions(actualSubscriptionLogs) {
        const flushTest = { actual: actualSubscriptionLogs, ready: false };
        this.flushTests.push(flushTest);
        return {
            toBe(marbles) {
                const marblesArray = (typeof marbles === 'string') ? [marbles] : marbles;
                flushTest.ready = true;
                flushTest.expected = marblesArray.map(marbles => TestScheduler.parseMarblesAsSubscriptions(marbles));
            }
        };
    }
    flush() {
        const hotObservables = this.hotObservables;
        while (hotObservables.length > 0) {
            hotObservables.shift().setup();
        }
        super.flush();
        const readyFlushTests = this.flushTests.filter(test => test.ready);
        while (readyFlushTests.length > 0) {
            const test = readyFlushTests.shift();
            this.assertDeepEqual(test.actual, test.expected);
        }
    }
    static parseMarblesAsSubscriptions(marbles) {
        if (typeof marbles !== 'string') {
            return new SubscriptionLog_1.SubscriptionLog(Number.POSITIVE_INFINITY);
        }
        const len = marbles.length;
        let groupStart = -1;
        let subscriptionFrame = Number.POSITIVE_INFINITY;
        let unsubscriptionFrame = Number.POSITIVE_INFINITY;
        for (let i = 0; i < len; i++) {
            const frame = i * this.frameTimeFactor;
            const c = marbles[i];
            switch (c) {
                case '-':
                case ' ':
                    break;
                case '(':
                    groupStart = frame;
                    break;
                case ')':
                    groupStart = -1;
                    break;
                case '^':
                    if (subscriptionFrame !== Number.POSITIVE_INFINITY) {
                        throw new Error('found a second subscription point \'^\' in a ' +
                            'subscription marble diagram. There can only be one.');
                    }
                    subscriptionFrame = groupStart > -1 ? groupStart : frame;
                    break;
                case '!':
                    if (unsubscriptionFrame !== Number.POSITIVE_INFINITY) {
                        throw new Error('found a second subscription point \'^\' in a ' +
                            'subscription marble diagram. There can only be one.');
                    }
                    unsubscriptionFrame = groupStart > -1 ? groupStart : frame;
                    break;
                default:
                    throw new Error('there can only be \'^\' and \'!\' markers in a ' +
                        'subscription marble diagram. Found instead \'' + c + '\'.');
            }
        }
        if (unsubscriptionFrame < 0) {
            return new SubscriptionLog_1.SubscriptionLog(subscriptionFrame);
        }
        else {
            return new SubscriptionLog_1.SubscriptionLog(subscriptionFrame, unsubscriptionFrame);
        }
    }
    static parseMarbles(marbles, values, errorValue, materializeInnerObservables = false) {
        if (marbles.indexOf('!') !== -1) {
            throw new Error('conventional marble diagrams cannot have the ' +
                'unsubscription marker "!"');
        }
        const len = marbles.length;
        const testMessages = [];
        const subIndex = marbles.indexOf('^');
        const frameOffset = subIndex === -1 ? 0 : (subIndex * -this.frameTimeFactor);
        const getValue = typeof values !== 'object' ?
                (x) => x :
                (x) => {
                // Support Observable-of-Observables
                if (materializeInnerObservables && values[x] instanceof ColdObservable_1.ColdObservable) {
                    return values[x].messages;
                }
                return values[x];
            };
        let groupStart = -1;
        for (let i = 0; i < len; i++) {
            const frame = i * this.frameTimeFactor + frameOffset;
            let notification;
            const c = marbles[i];
            switch (c) {
                case '-':
                case ' ':
                    break;
                case '(':
                    groupStart = frame;
                    break;
                case ')':
                    groupStart = -1;
                    break;
                case '|':
                    notification = Notification_1.Notification.createComplete();
                    break;
                case '^':
                    break;
                case '#':
                    notification = Notification_1.Notification.createError(errorValue || 'error');
                    break;
                default:
                    notification = Notification_1.Notification.createNext(getValue(c));
                    break;
            }
            if (notification) {
                testMessages.push({ frame: groupStart > -1 ? groupStart : frame, notification });
            }
        }
        return testMessages;
    }
}
exports.TestScheduler = TestScheduler;
//# sourceMappingURL=TestScheduler.js.map