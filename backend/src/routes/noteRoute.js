import express from "express";
import {
  getSaved,
  save,
  updateNotes,
  remove,
} from "../controllers/noteController.js";

const router = express.Router();

// user note endpoints
router.get("/", getSaved);
router.post("/", save);
router.put("/:id/notes", updateNotes);
router.delete("/:id", remove);

export default router;
