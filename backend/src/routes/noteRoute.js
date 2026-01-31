import express from "express";
import { getSaved, save, deleteNote, getNoteByCharacter } from "../controllers/noteController.js";

const router = express.Router();

// user note endpoints
router.get("/", getSaved);
router.get("/character/:character", getNoteByCharacter);
router.post("/", save);
router.delete("/:noteId", deleteNote);

export default router;
