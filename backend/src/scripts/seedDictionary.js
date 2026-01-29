import dotenv from "dotenv";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Character from "../models/Character.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const IDS_OPERATORS = new Set([
  "\u2FF0",
  "\u2FF1",
  "\u2FF2",
  "\u2FF3",
  "\u2FF4",
  "\u2FF5",
  "\u2FF6",
  "\u2FF7",
  "\u2FF8",
  "\u2FF9",
  "\u2FFA",
  "\u2FFB",
]);

function extractComponents(decomposition) {
  if (!decomposition || decomposition === "\uFF1F") return [];
  const components = [];
  for (const char of decomposition) {
    if (!IDS_OPERATORS.has(char) && char !== "\uFF1F") {
      components.push(char);
    }
  }
  return components;
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_CONNECTION);
  console.log("Connected to database.");

  const filePath = path.join(__dirname, "../../data/dictionary.txt");
  const raw = fs.readFileSync(filePath, "utf-8");
  const lines = raw.split("\n").filter(Boolean);

  const docs = lines.map((line) => {
    const entry = JSON.parse(line);
    return {
      character: entry.character,
      pinyin: entry.pinyin || [],
      definitions: entry.definition ? entry.definition.split("; ") : [],
      decomposition: entry.decomposition || "",
      components: extractComponents(entry.decomposition),
      etymology: entry.etymology || {},
      matches: entry.matches || [],
    };
  });

  await Character.deleteMany({});
  console.log("Cleared existing dictionary characters.");

  const BATCH_SIZE = 1000;
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    await Character.insertMany(docs.slice(i, i + BATCH_SIZE));
    console.log(
      `Inserted ${Math.min(i + BATCH_SIZE, docs.length)} / ${docs.length}`,
    );
  }

  console.log(`Seeded ${docs.length} dictionary characters.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
