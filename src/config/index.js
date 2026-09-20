import { readFile } from "fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 1. Recreate __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadConfig() {
  try {
    const filePath = path.join(__dirname, "config.json");
    const bacaData = await readFile(filePath, "utf-8");
    const ubahJSON = JSON.parse(bacaData);
    return ubahJSON;
  } catch (err) {
    console.log("[CONFIG] Error read config file");
  }
}
const config = await loadConfig();
export default config;
