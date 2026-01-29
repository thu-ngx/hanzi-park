import express from "express";
import {
  getEntry,
  lookup,
  search,
} from "../controllers/characterController.js";

const router = express.Router();

// Dictionary/character lookup endpoints (public)
router.get("/search", search);
router.post("/lookup", lookup);
router.get("/:char", getEntry);

export default router;
