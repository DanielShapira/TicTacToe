"use strict";
/**
 * @see {@link ajax}
 *
 * @interface
 * @name AjaxRequest
 * @noimport true
 */
class AjaxRequestDoc {
    constructor() {
        /**
         * @type {string}
         */
        this.url = '';
        /**
         * @type {number}
         */
        this.body = 0;
        /**
         * @type {string}
         */
        this.user = '';
        /**
         * @type {boolean}
         */
        this.async = false;
        /**
         * @type {string}
         */
        this.method = '';
        /**
         * @type {Object}
         */
        this.headers = null;
        /**
         * @type {number}
         */
        this.timeout = 0;
        /**
         * @type {string}
         */
        this.password = '';
        /**
         * @type {boolean}
         */
        this.hasContent = false;
        /**
         * @type {boolean}
         */
        this.crossDomain = false;
        /**
         * @type {Subscriber}
         */
        this.progressSubscriber = null;
        /**
         * @type {string}
         */
        this.responseType = '';
    }
    /**
     * @return {XMLHttpRequest}
     */
    createXHR() {
        return null;
    }
    /**
     * @param {AjaxResponse} response
     * @return {T}
     */
    resultSelector(response) {
        return null;
    }
}
exports.AjaxRequestDoc = AjaxRequestDoc;
//# sourceMappingURL=MiscJSDoc.js.map