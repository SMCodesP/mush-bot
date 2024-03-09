const mineflayer = require("mineflayer");
const pathfinder = require("mineflayer-pathfinder").pathfinder;
const Movements = require("mineflayer-pathfinder").Movements;
const { GoalNear, GoalBlock } = require("mineflayer-pathfinder").goals;
const pvp = require("mineflayer-pvp").plugin;
const { Client, GatewayIntentBits } = require("discord.js");
const mineflayerViewer = require("prismarine-viewer").mineflayer;

const heads = [
  "ewogICJ0aW1lc3RhbXAiIDogMTYwMjcxOTE2NDgzMywKICAicHJvZmlsZUlkIiA6ICJhZDJjYzAyMjUxNWU0YjNiYjY4ZWU2YTlkZjEwYzFiOCIsCiAgInByb2ZpbGVOYW1lIiA6ICJTd2FydGgiLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvZDYxNmJhMWI0MTI1Y2M3NDhhNTZkZjYyMjNlNjkxOWIxZTRlMGFjNTc3OWU3MDgxYzdjNzc1Zjg0ZWFmY2ZlNyIKICAgIH0KICB9Cn0=",
  "ewogICJ0aW1lc3RhbXAiIDogMTYwMjcxOTIwNDUwOCwKICAicHJvZmlsZUlkIiA6ICJhZDJjYzAyMjUxNWU0YjNiYjY4ZWU2YTlkZjEwYzFiOCIsCiAgInByb2ZpbGVOYW1lIiA6ICJTd2FydGgiLAogICJzaWduYXR1cmVSZXF1aXJlZCIgOiB0cnVlLAogICJ0ZXh0dXJlcyIgOiB7CiAgICAiU0tJTiIgOiB7CiAgICAgICJ1cmwiIDogImh0dHA6Ly90ZXh0dXJlcy5taW5lY3JhZnQubmV0L3RleHR1cmUvOGVmZGFjMmFkNjdkNjAzNjQzZTg4ODg4ZmM4NDY0YTQ4YTljYzM0NmIxOGU0M2U1MDUyZTcwNWQ0MDFmZDZmOCIKICAgIH0KICB9Cn0",
];

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

async function createBot() {
  const bot = mineflayer.createBot({
    host: "mush.com.br", // minecraft server ip
    username: "TL0gg3r", // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
    auth: "offline", // for offline mode servers, you can set this to 'offline'
    version: "1.8.8",
  });

  bot.loadPlugin(pathfinder);
  bot.loadPlugin(pvp);

  bot.once("spawn", () => {
    mineflayerViewer(bot, { port: 3000, firstPerson: true });
    const defaultMove = new Movements(bot);
    console.info("Nasceu");
    bot.chat("/play pvp");

    setTimeout(async () => {
      bot.setQuickBarSlot(3);

      bot.pathfinder.setMovements(defaultMove);
      const myGoal = new GoalBlock(2, 34, 19);
      await bot.pathfinder.goto(myGoal);

      function recursiveEnterFPS() {
        const entity = bot.entityAtCursor();

        if (entity) {
          bot.attack(entity);
        } else {
          recursiveEnterFPS();
        }
      }
      recursiveEnterFPS();
    }, 750);
  });

  bot.on("windowOpen", async (window) => {
    const slot = window.slots.find((slot) =>
      heads.includes(
        slot?.nbt.value.SkullOwner.value.Properties.value.textures.value
          .value[0].Value.value
      )
    );
    if (!slot) return;

    await window.withdraw(slot.type, slot.metadata, slot.count, slot.nbt);
    bot.chat("/logar Teste123");
  });

  bot.on("kicked", (type) => {
    console.log("Kicked");
    bot.quit("kicked");
    createBot();
  });

  bot.on("error", console.log);

  const refil = async () => {
    const slots = bot.inventory.slots
      .filter((slot) => slot !== null)
      .filter((slot) => slot?.name === "mushroom_stew")
      .slice(0, 6);

    slots.forEach((slot, index) => {
      console.log(slot.slot, index + 37);
      bot.transfer({
        window: bot.inventory,
        itemType: slot.type,
        metadata: slot.metadata,
        sourceStart: slot.slot,
        sourceEnd: slot.slot + 1,
        destStart: index + 37,
        destEnd: index + 37 + 1,
      });
      // bot.moveSlotItem(slot.slot, index + 36);
    });
  };

  bot.on("health", () => {
    const health = bot.health;

    if (health < 16.5) {
      console.log("health");
      const slot = bot.inventory.slots
        .filter((slot) => slot?.slot > 36)
        .find((slot) => slot.name === "mushroom_stew");

      if (slot) {
        console.log(slot.slot - 36);
        bot.setQuickBarSlot(slot.slot - 36);
        bot.activateItem();
        setTimeout(() => {
          bot.setQuickBarSlot(0);
        }, 100);
        console.log("tomei sopa e troquei para espada");
      } else {
        console.log("não tinha sopa");
        // refil();
      }
    }
  });

  const channel = client.channels.cache.get("1215358457901875241");
  bot.on("message", async (jsonMsg) => {
    if (
      jsonMsg.extra &&
      jsonMsg.extra[1]?.text === "/registrar <senha> <senha>"
    ) {
      bot.chat("/registrar Teste123 Teste123");
      bot.chat("/play pvp");
    }
    if (jsonMsg.extra && jsonMsg.extra[1]?.text === "/logar <senha>") {
      bot.chat("/logar Teste123");
      bot.chat("/play pvp");
    }

    if (jsonMsg.extra) {
      const message = jsonMsg.extra
        .map((message) => message.json.text || " ")
        .join("")
        .trim();

      if (message && message !== "") {
        channel.send(message);
      }

      if (message.includes("TL0gg3r] frente")) {
        bot.setControlState("forward", true);
        setTimeout(() => {
          bot.setControlState("forward", false);
        }, 5000);
      }

      if (message.includes("TL0gg3r] atacar")) {
        const playerName = message.split("TL0gg3r] atacar")[1].trim();
        const player = bot.players[playerName];

        bot.pvp.attack(player.entity);
      }

      if (message.includes("TL0gg3r] stop")) {
        console.log("stop");
        bot.pvp.stop();
        bot.pvp.forceStop();
      }

      if (message.includes("TL0gg3r] escuta")) {
        const myGoal = new GoalNear(13, 74, 4, 1);
        await bot.pathfinder.goto(myGoal);
        bot.setControlState("jump", true);
      }

      if (message.includes("TL0gg3r] spawn")) {
        const myGoal = new GoalNear(9, 73, 2, 1);
        await bot.pathfinder.goto(myGoal);
        await bot.look(0, 0);
      }
    }
  });
}

async function recursiveTryCreateBot() {
  try {
    console.log("createBot");
    await createBot();
  } catch (error) {
    console.log(error);
    await recursiveTryCreateBot();
  }
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
  recursiveTryCreateBot();
});

client.login(
  "NzkwNjQ4NzY1MDg5NTc5MDEw.GlYJ_3.Dtp_5HdQdsKHEfbooMGJTR6uHNY6RDCMzpnJ1A"
);
