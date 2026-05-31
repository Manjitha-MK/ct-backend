import express from "express";
import upload from "../server/middleware/uploadMiddleware.js";
import {
    getPlayers,
    getSinglePlayer,
    createPlayer,
    updatePlayer,
    deletePlayer,
    getTopRunScorers,
    getTopWicketTakers

} from "../controllers/playerController.js";

const router = express.Router();

router.get("/", getPlayers);

router.get("/leaderboard/top-runs", getTopRunScorers);
router.get("/leaderboard/top-wickets", getTopWicketTakers);

router.get("/:id", getSinglePlayer);

router.post("/", upload.single("playerImage"), createPlayer);

router.put("/:id", upload.single("playerImage"), updatePlayer);

router.delete("/:id", deletePlayer);


export default router;