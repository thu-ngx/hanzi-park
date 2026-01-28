import express from "express";
import {
  lookup,
  search,
  getSaved,
  save,
  updateNotes,
  remove,
} from "../controllers/characterController.js";

const router = express.Router();

// analysis endpoints (no saved state needed)
router.post("/lookup", lookup);
router.get("/search", search);

// user collection endpoints
router.get("/saved", getSaved);
router.post("/save", save);
router.put("/:id/notes", updateNotes);
router.delete("/:id", remove);

export default router;
