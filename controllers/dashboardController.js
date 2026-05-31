import Player from "../models/Player.js";
import Match from "../models/Match.js";

export const getDashboardStats = async (req, res) => {
    try {
        const totalPlayers = await Player.countDocuments();

        const totalMatches = await Match.countDocuments();

        const totalWins = await Match.countDocuments({
            result: "Win"
        });

        const totalLosses = await Match.countDocuments({
            result: "Loss"
        });

        res.json({
            totalPlayers,
            totalMatches,
            totalWins,
            totalLosses
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};