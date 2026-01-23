import mongoose from "mongoose";

const sessionScheme = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// auto delete document when expired
sessionScheme.index({expiresAt: 1}, {expireAfterSeconds: 0})

export default mongoose.model('Session', sessionScheme)