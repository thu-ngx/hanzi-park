import express from "express";
import { getDictionaryEntry } from "../controllers/dictionaryController.js";

const router = express.Router();

router.get("/:char", getDictionaryEntry);

export default router;
