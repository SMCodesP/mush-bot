const mineflayer = require("mineflayer");
const pathfinder = require("mineflayer-pathfinder").pathfinder;
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear, GoalBlock } = require("mineflayer-pathfinder").goals;
const pvp = require("mineflayer-pvp").plugin;
var Socks = require("socks5-client");
const fs = require("fs");
const data = fs.readFileSync("proxies.txt", "utf-8");
require("dotenv").config();

const proxies = data.split("\n");

const heads = [
  "ewogICJ0aW1lc3RhbXAiIDogMTYwMjcxOTE2NDgzMywKICAicHJvZmlsZUlkIiA6ICJhZDJjYzAyMjUxNWU0YjNiYjY4ZWU2YTlkZjEwYzFiOCIsCiAgInByb2ZpbGVOYW1lIiA6ICJTd2FydGgiLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDYxNmJhMWI0MTI1Y2M3NDhhNTZkZjYyMjNlNjkxOWIxZTRlMGFjNTc3OWU3MDgxYzdjNzc1Zjg0ZWFmY2ZlNyIKICAgIH0KICB9Cn0=",
  "ewogICJ0aW1lc3RhbXAiIDogMTYwMjcxOTIwNDUwOCwKICAicHJvZmlsZUlkIiA6ICJhZDJjYzAyMjUxNWU0YjNiYjY4ZWU2YTlkZjEwYzFiOCIsCiAgInByb2ZpbGVOYW1lIiA6ICJTd2FydGgiLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGVmZGFjMmFkNjdkNjAzNjQzZTg4ODg4ZmM4NDY0YTQ4YTljYzM0NmIxOGU0M2U1MDUyZTcwNWQ0MDFmZDZmOCIKICAgIH0KICB9Cn0",
  "ewogICJ0aW1lc3RhbXAiIDogMTYwMjcxOTIwNDUwOCwKICAicHJvZmlsZUlkIiA6ICJhZDJjYzAyMjUxNWU0YjNiYjY4ZWU2YTlkZjEwYzFiOCIsCiAgInByb2ZpbGVOYW1lIiA6ICJTd2FydGgiLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGVmZGFjMmFkNjdkNjAzNjQzZTg4ODg4ZmM4NDY0YTQ4YTljYzM0NmIxOGU0M2U1MDUyZTcwNWQ0MDFmZDZmOCIKICAgIH0KICB9Cn0=",
];

// const nickbot = process.argv[2];

const permmited = ["LOUISWALKERS", "FL0RASTEY_"];

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const verifyUserPermmited = (message) => {
  return permmited.some((permmited) => message.includes(permmited));
};

async function createBot(nickbot) {
  const proxy = proxies[Math.floor(Math.random() * proxies.length)].split(":");

  const bot = mineflayer.createBot({
    username: nickbot, // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
    auth: "offline", // for offline mode servers, you can set this to 'offline'
    version: "1.8.8",
    // host: "penissssss.feathermc.gg",
    host: "131.196.199.104",
    checkTimeoutInterval: 120 * 1000,
    port: 25568,
    // stream: Socks.createConnection({
    //   host: "mush.com.br", // minecraft server ip
    //   port: 25565,
    //   socksHost: "gate.smartproxy.com",
    //   socksPort: 7000,
    //   socksUsername: "user-spbr8hsdl4-country-br",
    //   socksPassword: "we6Pc8oHk~wo77zYNs",
    // }),
  });

  bot.loadPlugin(pathfinder);
  bot.loadPlugin(pvp);

  async function craftItem(name, amount) {
    amount = parseInt(amount, 10);
    const item = bot.registry.itemsByName[name];

    if (item) {
      const recipe = bot.recipesFor(item.id, null, 1, null)[0];
      if (recipe) {
        try {
          await bot.craft(recipe, amount, null);
        } catch (err) {}
      }
    }
  }

  bot.once("spawn", () => {
    // mineflayerViewer(bot, { port: 3000, firstPerson: true });
    const defaultMove = new Movements(bot);
    console.info("Nasceu");
    bot.chat("/play pvp");
    bot.pathfinder.setMovements(defaultMove);
    // setTimeout(async () => {
    //   bot.setQuickBarSlot(3);
    //   const myGoal = new GoalBlock(2, 34, 19);
    //   await bot.pathfinder.goto(myGoal);
    //   // function recursiveEnterFPS() {
    //   //   const entity = bot.entityAtCursor();
    //   //   if (entity) {
    //   //     bot.attack(entity);
    //   //   } else {
    //   //     recursiveEnterFPS();
    //   //   }
    //   // }
    //   // recursiveEnterFPS();
    // }, 750);
  });

  bot.on("windowOpen", async (window) => {
    const slot = window.slots.find((slot) =>
      heads.includes(
        slot?.nbt.value.SkullOwner.value.Properties.value.textures.value
          .value[0].Value.value
      )
    );

    if (!slot) {
      console.log(
        window.slots.map(
          (slot) =>
            slot?.nbt.value.SkullOwner.value.Properties.value.textures.value
              .value[0].Value.value
        )
      );
      console.log("não achei a cabeça");
      return;
    }

    await window.withdraw(slot.type, slot.metadata, slot.count, slot.nbt);
    bot.chat("/logar Teste123");
  });

  bot.on("kicked", (type) => {
    console.log(`Kicked ${nickbot}`);
    bot.quit("kicked");
    console.log(type);
    createBot(nickbot);
  });

  bot.on("error", console.log);

  const recraft = async () => {
    // const amount_brown_mushroom = bot.inventory.slots
    //   .filter((slot) => slot !== null)
    //   .filter((slot) => slot?.name === "brown_mushroom")[0]?.count;
    // const amount_red_mushroom = bot.inventory.slots
    //   .filter((slot) => slot !== null)
    //   .filter((slot) => slot?.name === "red_mushroom")[0]?.count;

    // const min_amount = Math.min(amount_brown_mushroom, amount_red_mushroom);
    craftItem("mushroom_stew", 1);
  };

  const refil = async () => {
    try {
      const slots = bot.inventory.slots
        .filter((slot) => slot !== null)
        .filter((slot) => slot?.name === "mushroom_stew")
        .slice(0, 8);

      if (slots.length === 0) {
        console.log("não tinha sopa");
        await recraft();
        return;
      }

      for (const [id, slot] of slots.entries()) {
        await bot.moveSlotItem(
          slot.slot,
          bot.QUICK_BAR_START + id + 1,
          console.log
        );
      }
    } catch (error) {
      console.log("error refil", error);
    }
  };

  const dropBowl = async () => {
    try {
      const slots = bot.inventory.slots.filter(
        (slot) => slot?.type === 281 && slot?.count < 9
      );
      for (const [_, slot] of slots.entries()) {
        await bot.tossStack(slot, console.log);
      }
    } catch (error) {
      console.log("error dropBowl", error);
    }
  };

  let refilling = false;

  bot.on("health", async () => {
    const health = bot.health;
    if (health < 16.5) {
      if (refilling) return;
      const slot = bot.inventory.slots
        .filter((slot) => slot?.slot > 36)
        .find((slot) => slot.name === "mushroom_stew");

      if (slot) {
        console.log(slot.slot - 36);
        bot.setQuickBarSlot(slot.slot - 36);
        bot.activateItem();
        // console.log(slot);
        // bot.tossStack(slot.slot);
        setTimeout(async () => {
          await dropBowl();
          bot.setQuickBarSlot(0);
        }, 400);
        console.log("tomei sopa e troquei para espada");
      } else {
        console.log("não tinha sopa");
        refilling = true;
        await refil();
        refilling = false;
      }
    }
  });

  // const channel = client.channels.cache.get("1215358457901875241");
  bot.on("message", async (jsonMsg) => {
    if (jsonMsg.extra) {
      const message = jsonMsg.extra
        .map((message) => message.json.text || " ")
        .join("")
        .trim();

      if (message.includes("/register") || message.includes("/registrar")) {
        bot.chat("/register Teste123 Teste123");
        bot.chat("/warp fps");
      }
      if (message.includes("/login") || message.includes("/logar")) {
        bot.chat("/login Teste123");
        bot.chat("/warp fps");
      }

      if (!verifyUserPermmited(message)) return;

      if (message.includes(`recraft`)) {
        await recraft();
      }

      if (message.includes(`frente`)) {
        bot.setControlState("forward", true);
        setTimeout(() => {
          bot.setControlState("forward", false);
        }, 5000);
      }

      if (message.includes(`slot 2`)) {
        bot.setQuickBarSlot(3);
      }

      if (message.includes(`atacar`)) {
        const playerName = message.split(`atacar`)[1].trim();
        const player = bot.players[playerName];

        bot.setQuickBarSlot(0);
        bot.pvp.attack(player.entity);
      }

      if (message.includes(`stop`)) {
        console.log("stop");
        bot.pvp.stop();
        bot.pvp.forceStop();
      }

      if (message.includes(`escuta`)) {
        const myGoal = new GoalNear(13, 74, 4, 1);
        await bot.pathfinder.goto(myGoal);
        bot.setControlState("jump", true);
      }

      if (message.includes(`spawn`)) {
        const myGoal = new GoalNear(9, 73, 2, 1);
        await bot.pathfinder.goto(myGoal);
        await bot.look(0, 0);
      }

      if (message.includes(`lobby`)) {
        bot.chat("/lobby");
      }

      if (message.includes(`sp`)) {
        bot.chat("/spawn");
      }

      if (message.includes("aceita")) {
        console.log("aceita party");
        bot.chat("/party aceitar FL0RASTEY_");
      }

      if (message.includes("c4")) {
        bot.chat("c4");
      }
    }
  });
}

async function recursiveTryCreateBot(nickbot) {
  try {
    console.log("createBot");
    await createBot(nickbot);
  } catch (error) {
    console.log(error);
    await recursiveTryCreateBot(nickbot);
  }
}

// client.on("ready", () => {
// console.log(`Logged in as ${client.user.tag}!`);
recursiveTryCreateBot("LokiDora");
recursiveTryCreateBot("Zingkun");
recursiveTryCreateBot("Zinggoi");
// recursiveTryCreateBot("Zyeyummy");
// recursiveTryCreateBot("MVSebt");
// recursiveTryCreateBot("Remingtonoff");
// /party invite LokiDora Zingkun Zinggoi Zyeyummy MVSebt Remingtonoff
// recursiveTryCreateBot("Bustlinglitz");
// recursiveTryCreateBot("SmoggyRemington");
// recursiveTryCreateBot("Bustlingsson");
// recursiveTryCreateBot("Ryosadie");
// });

// client.login(process.env.DISCORD_TOKEN);
