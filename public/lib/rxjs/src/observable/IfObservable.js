"use strict";
const Observable_1 = require('../Observable');
const subscribeToResult_1 = require('../util/subscribeToResult');
const OuterSubscriber_1 = require('../OuterSubscriber');
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
class IfObservable extends Observable_1.Observable {
    constructor(condition, thenSource, elseSource) {
        super();
        this.condition = condition;
        this.thenSource = thenSource;
        this.elseSource = elseSource;
    }
    static create(condition, thenSource, elseSource) {
        return new IfObservable(condition, thenSource, elseSource);
    }
    _subscribe(subscriber) {
        const { condition, thenSource, elseSource } = this;
        return new IfSubscriber(subscriber, condition, thenSource, elseSource);
    }
}
exports.IfObservable = IfObservable;
class IfSubscriber extends OuterSubscriber_1.OuterSubscriber {
    constructor(destination, condition, thenSource, elseSource) {
        super(destination);
        this.condition = condition;
        this.thenSource = thenSource;
        this.elseSource = elseSource;
        this.tryIf();
    }
    tryIf() {
        const { condition, thenSource, elseSource } = this;
        let result;
        try {
            result = condition();
            const source = result ? thenSource : elseSource;
            if (source) {
                this.add(subscribeToResult_1.subscribeToResult(this, source));
            }
            else {
                this._complete();
            }
        }
        catch (err) {
            this._error(err);
        }
    }
}
//# sourceMappingURL=IfObservable.js.map