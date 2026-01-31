import express from "express";
import { getSaved, save, remove, getNoteByCharacter } from "../controllers/noteController.js";

const router = express.Router();

// user note endpoints
router.get("/", getSaved);
router.get("/character/:character", getNoteByCharacter);
router.post("/", save);
router.delete("/:id", remove);

export default router;
