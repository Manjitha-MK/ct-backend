import express from "express";
import {
    createMatch,
    getMatches,
    updateMatch,
    deleteMatch
} from "../controllers/matchController.js";

const router = express.Router();

router.post("/", createMatch);
router.get("/", getMatches);
router.put("/:id", updateMatch);
router.delete("/:id", deleteMatch);

export default router;