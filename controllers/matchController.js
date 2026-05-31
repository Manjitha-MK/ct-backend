import Match from "../models/Match.js";

// CREATE MATCH
export const createMatch = async (req, res) => {
    try {
        const match = await Match.create(req.body);
        res.status(201).json(match);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET ALL MATCHES
export const getMatches = async (req, res) => {
    try {
        const matches = await Match.find().sort({
            createdAt: -1
        });

        res.json(matches);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// UPDATE MATCH
export const updateMatch = async (req, res) => {
    try {
        const match = await Match.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(match);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE MATCH
export const deleteMatch = async (req, res) => {
    try {
        await Match.findByIdAndDelete(req.params.id);

        res.json({
            message: "Match deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};