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
const socket_service_1 = require('../shared/socket.service');
let HomeComponent = class HomeComponent {
    constructor(_socketService) {
        this._socketService = _socketService;
        this.selfAuthored = false;
        this.toastMessage = "";
        this.WinMessage = "";
    }
    ngOnInit() {
        this.messages = new Array();
        do {
            this.playerNickName = prompt("הכנס כינוי");
        } while (this.playerNickName == null || this.playerNickName == "");
        //Update all users on new user entered
        this._socketService.emit('player-added', this.playerNickName);
        //Listen to player array changes
        this._socketService.on('player-array', (playerArray) => {
            this.playersArray = playerArray.playing;
            this.vs = "";
            if (this.playersArray.length == 1 && this.type != '-') {
                this.toastMessage = "מחכה ליריב";
            }
            else if (this.type == '-') {
                this.toastMessage = "אתה צופה במשחק";
            }
            if (this.playersArray.length == 2 && this.type != '-') {
                this.toastMessage = "משחק החל בהצלחה";
                this.vs = this.playersArray[1].nickName + "(X)  vs  " + this.playersArray[0].nickName + " (O)";
            }
            this.watingPlayers = playerArray.waiting;
        });
        this._socketService.on('type', (data) => {
            this.type = data.type;
            this.turn = data.turn;
        });
        this._socketService.on('message-received', (msg) => {
            this.messages.unshift(msg);
        });
        //Listen to board changes
        this._socketService.on('change-board', (data) => {
            this.boardTicTacToe = data.board;
            if (data.turn == this.type) {
                this.turn = data.turn;
                if (data.message == 1) {
                    this.WinMessage = "הפסדת בהצלחה פעם הבאה";
                    setTimeout(() => { this.WinMessage = ""; }, 2000);
                }
                else if (data.message == 0) {
                    this.WinMessage = "תיקו";
                    setTimeout(() => { this.WinMessage = ""; }, 2000);
                }
            }
        });
    }
    sendMessage() {
        const message = {
            nickName: this.playerNickName,
            text: this.messageText,
            date: Date.now()
        };
        this._socketService.emit('send-message', message);
        this.messageText = '';
    }
    //Board on click listener
    changeBoard(row, col) {
        if (this.playersArray.length == 2 && this.type != '-' && this.boardTicTacToe[row][col] != "X" && this.boardTicTacToe[row][col] != "O" && this.turn == this.type) {
            this.toastMessage = "";
            this.boardTicTacToe[row][col] = this.type;
            if (this.turn == 'X') {
                this.turn = "O";
            }
            else {
                this.turn = "X";
            }
            let state = this.checkIfWin();
            if (state == 1) {
                this.WinMessage = "ניצחת כל הכבוד";
                setTimeout(() => { this.WinMessage = ""; }, 2000);
                this._socketService.emit('send-board', { board: this.boardTicTacToe, turn: this.turn, message: state });
                this._socketService.emit('win-board', "clear");
            }
            else if (state == 0) {
                this.toastMessage = "תיקו";
                setTimeout(() => { this.toastMessage = ""; }, 2000);
                this.boardTicTacToe = [["-", "-", "-", "-"], ["-", "-", "-", "-"], ["-", "-", "-", "-"], ["-", "-", "-", "-"]];
                this._socketService.emit('send-board', { board: this.boardTicTacToe, turn: this.turn, message: state });
            }
            else {
                this._socketService.emit('send-board', { board: this.boardTicTacToe, turn: this.turn, message: state });
            }
        }
        else if (this.playersArray.length == 2 && this.type != '-' && this.turn != this.type) {
            this.toastMessage = this.turn + " לא תורך לשחק תור ";
        }
        else if (this.playersArray.length == 2 && this.type != '-' && (this.boardTicTacToe[row][col] === "X" || this.boardTicTacToe[row][col] === "O")) {
            this.toastMessage = "מקום זה תפוס בחר מקום אחר";
        }
        else if (this.type == '-') {
            this.toastMessage = "אתה רק צופה";
        }
    }
    checkIfWin() {
        let win = 0;
        //Check win in rows
        for (let row = 0; row < this.boardTicTacToe.length; row++) {
            win = 0;
            for (let col = 0; col < this.boardTicTacToe[row].length; col++) {
                if (this.boardTicTacToe[row][col] === this.type) {
                    win++;
                }
            }
            if (win == this.boardTicTacToe.length) {
                return 1;
            }
        }
        //Check win in cols
        for (let row = 0; row < this.boardTicTacToe.length; row++) {
            win = 0;
            for (let col = 0; col < this.boardTicTacToe[row].length; col++) {
                if (this.boardTicTacToe[col][row] === this.type) {
                    win++;
                }
            }
            if (win == this.boardTicTacToe.length) {
                return 1;
            }
        }
        win = 0;
        //Check win in left diagonal (Top-Left -> Bottom-Right)
        for (let row = 0; row < this.boardTicTacToe.length; row++) {
            if (this.boardTicTacToe[row][row] === this.type) {
                win++;
            }
            if (win == this.boardTicTacToe.length) {
                return 1;
            }
        }
        win = 0;
        //Check win in right diagonal (Top-Right -> Bottom-Left)
        for (let row = this.boardTicTacToe.length - 1; row >= 0; row--) {
            if (this.boardTicTacToe[row][this.boardTicTacToe.length - row - 1] == this.type) {
                win++;
            }
            if (win == this.boardTicTacToe.length) {
                return 1;
            }
        }
        win = 0;
        //Check draw
        for (let row = 0; row < this.boardTicTacToe.length; row++) {
            for (let col = 0; col < this.boardTicTacToe[row].length; col++) {
                if (this.boardTicTacToe[row][col] !== "-") {
                    win++;
                }
            }
            if (win == this.boardTicTacToe.length * this.boardTicTacToe.length) {
                return 0;
            }
        }
        //Game not finish
        return -1;
    }
};
HomeComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'ng-home',
        styleUrls: ['home.styles.css'],
        templateUrl: 'home.template.html'
    }), 
    __metadata('design:paramtypes', [socket_service_1.SocketService])
], HomeComponent);
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map