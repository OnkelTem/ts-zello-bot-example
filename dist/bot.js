"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const ts_zello_1 = require("ts-zello");
const utils_1 = require("./utils");
const CREDENTIALS_PATH = "credentials.json";
const ZELLO_SERVER = "wss://zello.io/ws";
let raw = fs_1.readFileSync(CREDENTIALS_PATH, "utf8");
const credentials = JSON.parse(raw);
let ctl;
function simpleActivityMonitorBot() {
    return __awaiter(this, void 0, void 0, function* () {
        let usersOnline;
        ctl = yield ts_zello_1.zello(ZELLO_SERVER, function* ({ commands, events }) {
            yield commands.logon(credentials);
            console.log(`Connected to the channel: ${credentials.channel}`);
            events.onChannelStatus((data) => {
                const t = utils_1.getTime();
                if (usersOnline != null) {
                    if (usersOnline > data.users_online) {
                        console.log(`[${t}] <-- {${data.users_online}}`);
                    }
                    else if (usersOnline < data.users_online) {
                        console.log(`[${t}] --> {${data.users_online}}`);
                    }
                }
                usersOnline = data.users_online;
            });
            events.onTextMessage((data) => {
                const t = utils_1.getTime();
                console.log(`[${t}] ${utils_1.formatName(data.from)} | ${utils_1.formatText(data.text)}`);
            });
        });
    });
}
function shutdownBot() {
    return __awaiter(this, void 0, void 0, function* () {
        if (ctl && ctl.status() === "OPEN") {
            yield ctl.close();
        }
    });
}
process.on("SIGINT", function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.warn("Stopped by user");
        yield shutdownBot();
        process.exit();
    });
});
process.once("SIGUSR2", function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.warn("Restarting by nodemon");
        yield shutdownBot();
        process.kill(process.pid, "SIGUSR2");
    });
});
/**
 * Main function
 */
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield simpleActivityMonitorBot();
}))();
//# sourceMappingURL=bot.js.map