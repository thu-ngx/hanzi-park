import dotenv from "dotenv";
import mongoose from "mongoose";
import XLSX from "xlsx";
import path from "path";
import { fileURLToPath } from "url";
import DictionaryCharacter from "../models/DictionaryCharacter.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seedFrequency() {
    await mongoose.connect(process.env.MONGODB_CONNNECTION);
    console.log("Connected to database.");

    // Parse SUBTLEX-CH-CHR.xlsx
    const xlsxPath = path.join(__dirname, "../../data/SUBTLEX-CH-CHR.xlsx");
    const workbook = XLSX.readFile(xlsxPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(sheet);

    console.log(`Parsed ${rows.length} rows from SUBTLEX-CH-CHR.xlsx`);

    // Build character -> rank map
    // SUBTLEX-CH typically has columns like: Character, CHR.WCount, etc.
    // We'll use row index + 1 as the frequency rank (1 = most common)
    const freqMap = new Map();
    rows.forEach((row, index) => {
        // Try common column names for the character
        const char = row["Character"] || row["character"] || row["Word"] || row["汉字"] || Object.values(row)[0];
        if (char && typeof char === "string" && char.length === 1) {
            freqMap.set(char, index + 1);
        }
    });

    console.log(`Built frequency map with ${freqMap.size} characters`);

    // Bulk update DictionaryCharacter documents
    const bulkOps = [];
    for (const [char, rank] of freqMap) {
        bulkOps.push({
            updateOne: {
                filter: { character: char },
                update: { $set: { frequencyRank: rank } },
            },
        });
    }

    if (bulkOps.length > 0) {
        const BATCH_SIZE = 1000;
        for (let i = 0; i < bulkOps.length; i += BATCH_SIZE) {
            const batch = bulkOps.slice(i, i + BATCH_SIZE);
            const result = await DictionaryCharacter.bulkWrite(batch);
            console.log(
                `Batch ${Math.floor(i / BATCH_SIZE) + 1}: Modified ${result.modifiedCount} documents`
            );
        }
    }

    // Verify
    const countWithRank = await DictionaryCharacter.countDocuments({
        frequencyRank: { $exists: true, $ne: null },
    });
    console.log(`Total characters with frequency rank: ${countWithRank}`);

    await mongoose.disconnect();
    console.log("Done.");
}

seedFrequency().catch((err) => {
    console.error(err);
    process.exit(1);
});
