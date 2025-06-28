const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "alldl",
  aliases: ["dl","download"],
  version: "1.7",
  author: "Nazrul",
  role: 0,
  description: "Download videos from social media",
  category: "media",
  countDown: 3,
  guide: "{pn} [url] or reply"
};

module.exports.onStart = async ({ api, event, args }) => {
  const url = event.type === "message_reply" 
    ? event.messageReply.body.match(/https?:\/\/\S+/)?.[0]
    : args[0] || event.body.match(/https?:\/\/\S+/)?.[0];

  if (!url) return api.sendMessage("❌ Please provide a valid URL", event.threadID);

  try {
    api.setMessageReaction("🙎‍♂️", event.messageID, () => {}, true);
    
    const { data: { api: apiUrl } } = await axios.get("https://raw.githubusercontent.com/nazrul4x/Noobs/main/Apis.json");
    const { data } = await axios.get(`${apiUrl}/nazrul/alldlxx?url=${encodeURIComponent(url)}`);
    
    if (!data.url) throw new Error(data.error || "No download link found");

    const filePath = path.join(__dirname, `temp_${Date.now()}.mp4`);
    const writer = fs.createWriteStream(filePath);
    const { data: videoStream } = await axios.get(data.url, { responseType: 'stream' });
    
    videoStream.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    await api.sendMessage({
      body: `Here's your downloaded video 🦆💨`,
      attachment: fs.createReadStream(filePath)
    }, event.threadID);

    fs.unlinkSync(filePath);
    api.setMessageReaction("✅", event.messageID, () => {}, true);

  } catch (error) {
    api.setMessageReaction("❌", event.messageID, () => {}, true);
    api.sendMessage(`❌ Error: ${error.message}`, event.threadID);
  }
};