"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
const core_1 = require('@angular/core');
const io = require('socket.io-client');
let SocketService = class SocketService {
    constructor() {
        this.socket = io.connect();
    }
    on(eventName, callback) {
        if (this.socket) {
            this.socket.on(eventName, function (data) {
                callback(data);
            });
        }
    }
    ;
    emit(eventName, data) {
        if (this.socket) {
            this.socket.emit(eventName, data);
        }
    }
    ;
    removeListener(eventName) {
        if (this.socket) {
            this.socket.removeListener(eventName);
        }
    }
    ;
};
SocketService = __decorate([
    core_1.Injectable(), 
    __metadata('design:paramtypes', [])
], SocketService);
exports.SocketService = SocketService;
//# sourceMappingURL=socket.service.js.map