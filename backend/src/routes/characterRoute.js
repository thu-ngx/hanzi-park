import express from "express";
import {
    getCharacter,
    searchCharacters,
} from "../controllers/characterController.js";

const router = express.Router();

router.get("/search", searchCharacters);
router.get("/:char", getCharacter);

export default router;
