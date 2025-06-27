const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "NTKhang", // original author Kshitiz
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "View command usage",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `╔══════════════╗\n🔹 COMMAND LIST 🔹\n╚══════════════╝\n`;

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n╭────────────⭓\n│『 ${category.toUpperCase()} 』`;

          const names = categories[category].commands.sort();
          names.forEach((item) => {
            msg += `\n│💠${item}💠`;
          });

          msg += `\n╰────────⭓`;
        }
      });

      const totalCommands = commands.size;
      msg += `\n𝗖𝘂𝗿𝗿𝗲𝗻𝘁𝗹𝘆, 𝘁𝗵𝗲 𝗯𝗼𝘁 𝗵𝗮𝘀 ${totalCommands} 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝘁𝗵𝗮𝘁 𝗰𝗮𝗻 𝗯𝗲 𝘂𝘀𝗲𝗱\n`;
      msg += `\n𝗧𝘆𝗽𝗲 ${prefix}𝗵𝗲𝗹𝗽 𝗰𝗺𝗱𝗡𝗮𝗺𝗲 𝘁𝗼 𝘃𝗶𝗲𝘄 𝘁𝗵𝗲 𝗱𝗲𝘁𝗮𝗶𝗹𝘀 𝗼𝗳 𝘁𝗵𝗮𝘁 𝗰𝗼𝗺𝗺𝗮𝗻𝗱\n`;
      msg += `\n🫧𝘽𝙊𝙏 𝙉𝘼𝙈𝙀🫧:🎭E R E N 🧩 BOT🪢`;
      msg += `\n🔹 𝘽𝙊𝙏 𝙊𝙒𝙉𝙀𝙍 🔹`;
      msg += `\n 	 					`;
      msg += `\n~𝙉𝘼𝙈𝙀:✰ 𝙈𝙤𝙝𝙖𝙢𝙢𝙖𝙙 𝙍𝙚𝙭𝙮✰`;
      msg += `\n~𝙁𝘽:https://www.facebook.com/share/166VHaYd36/`;

      await message.reply({
        body: msg,
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription
          ? configCommand.longDescription.en || "No description"
          : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `╭── NAME ────⭓\n` +
          `│ ${configCommand.name}\n` +
          `├── INFO\n` +
          `│ Description: ${longDescription}\n` +
          `│ Other names: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}\n` +
          `│ Version: ${configCommand.version || "1.0"}\n` +
          `│ Role: ${roleText}\n` +
          `│ Time per command: ${configCommand.countDown || 1}s\n` +
          `│ Author: ${author}\n` +
          `├── Usage\n` +
          `│ ${usage}\n` +
          `├── Notes\n` +
          `│ The content inside <REXY> can be changed\n` +
          `│ The content inside [a|b|c] is a or b or c\n` +
          `╰━━━━━━━❖`;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
       }
