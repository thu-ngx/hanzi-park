import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        character: {
            type: String,
            required: true,
            trim: true,
        },
        pinyin: {
            type: String,
            trim: true,
        },
        meaning: {
            type: String,
            trim: true,
        },
        semanticRadical: {
            radical: { type: String },
            meaning: { type: String },
            pinyin: { type: String },
        },
        phoneticComponent: {
            component: { type: String },
            sound: { type: String },
        },
        frequencyRank: {
            type: Number,
        },
        strokeCount: {
            type: Number,
        },
        notes: {
            type: String,
            maxlength: 2000,
        },
    },
    {
        timestamps: true,
    },
);

// compound index: one user can save the same character only once
noteSchema.index({ userId: 1, character: 1 }, { unique: true });

export default mongoose.model("Note", noteSchema);
