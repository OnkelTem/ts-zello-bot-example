import { readFileSync } from "fs";
import { zello, CommandLogonRequest, Ctl } from "ts-zello";
import { formatName, formatText, getTime } from "./utils";

const CREDENTIALS_PATH = "credentials.json";
const ZELLO_SERVER = "wss://zello.io/ws";

let raw = readFileSync(CREDENTIALS_PATH, "utf8");
const credentials = JSON.parse(raw) as CommandLogonRequest;

let ctl: Ctl;

async function simpleActivityMonitorBot() {
  let usersOnline: number;
  ctl = await zello(ZELLO_SERVER, function* ({ commands, events }) {
    yield commands.logon(credentials);
    console.log(`Connected to the channel: ${credentials.channel}`);
    events.onChannelStatus((data) => {
      const t = getTime();
      if (usersOnline != null) {
        if (usersOnline > data.users_online) {
          console.log(`[${t}] <-- {${data.users_online}}`);
        } else if (usersOnline < data.users_online) {
          console.log(`[${t}] --> {${data.users_online}}`);
        }
      }
      usersOnline = data.users_online;
    });
    events.onTextMessage((data) => {
      const t = getTime();
      console.log(`[${t}] ${formatName(data.from)} | ${formatText(data.text)}`);
    });
  });
}

async function shutdownBot() {
  if (ctl && ctl.status() === "OPEN") {
    await ctl.close();
  }
}

process.on("SIGINT", async function () {
  console.warn("Stopped by user");
  await shutdownBot();
  process.exit();
});

process.once("SIGUSR2", async function () {
  console.warn("Restarting by nodemon");
  await shutdownBot();
  process.kill(process.pid, "SIGUSR2");
});

/**
 * Main function
 */
(async () => {
  await simpleActivityMonitorBot();
})();
