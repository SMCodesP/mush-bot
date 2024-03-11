const mc = require("minecraft-protocol");
const mineflayer = require("mineflayer");
var Socks = require("socks5-client");
const fs = require("fs");
const SocksClient = require("socks").SocksClient;

const data = fs.readFileSync("proxies.txt", "utf-8");
require("dotenv").config();

const proxies = data.split("\n");
const proxies_deu_certo = [];

async function createBot(username, proxy) {
  return new Promise(async (res, rej) => {
    // const info = await SocksClient.createConnection({
    //   proxy: {
    //     host: proxy[0],
    //     port: Number(proxy[1]),
    //     type: 5,
    //   },
    //   destination: {
    //     host: "131.196.199.104",
    //     port: 25565,
    //   },
    //   command: "connect",
    // });
    // const stream = Socks.createConnection({
    //   host: "131.196.199.104",
    //   port: 25565,
    //   socksHost: proxy[0],
    //   socksPort: proxy[1],
    // });
    const bot = mineflayer.createBot({
      username,
      auth: "offline",
      version: "1.8.8",
      stream: Socks.createConnection({
        host: "131.196.199.104",
        port: 25565,
        socksHost: proxy[0],
        socksPort: proxy[1],
      }),
    });

    bot.on("spawn", () => {
      setInterval(() => {
        console.log(bot.player.ping);
      }, 1000);
      res("Entrou com sucesso!");
      bot.end("arst");
    });

    bot.on("kicked", (err) => {
      console.log(err);
      rej("Não conseguiu entrar");
    });

    bot.on("error", (err) => {
      console.log(err);
      rej("Não conseguiu entrar");
    });
  });
}

async function checkProxies() {
  for (const proxy of proxies) {
    try {
      console.log("Tentando entrar com o proxy: ", proxy.split(":"));
      await createBot("Zinggoi", proxy.split(":"));
      console.log("deu certo");
      proxies_deu_certo.push(proxy);
      console.log(proxies_deu_certo);
    } catch (error) {
      console.log("Não conseguiu entrar");
    }
  }
  console.log(proxies_deu_certo);
}
checkProxies();
