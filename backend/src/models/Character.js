import mongoose from "mongoose";

const characterSchema = new mongoose.Schema({
  character: { type: String, required: true, unique: true, index: true },
  pinyin: [String],
  definitions: [String],
  decomposition: String,
  components: [String],
  etymology: {
    type: { type: String },
    phonetic: String,
    semantic: String,
    hint: String,
  },
  matches: [[String]],
  frequencyRank: { type: Number, default: null },
});

characterSchema.index({ components: 1 });
characterSchema.index({ frequencyRank: 1 });

export default mongoose.model("Character", characterSchema);
