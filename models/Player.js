import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
{
    fullName: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },

    dateOfBirth: {
        type: Date
    },

    role: {
        type: String,
        enum: [
            "Batsman",
            "Bowler",
            "All-Rounder",
            "Wicketkeeper"
        ],
        required: true
    },

    jerseyNumber: {
        type: Number,
        required: true,
        unique: true
    },

    battingStyle: {
        type: String
    },

    bowlingStyle: {
        type: String
    },

    matchesPlayed: {
        type: Number,
        default: 0
    },

    totalRuns: {
        type: Number,
        default: 0
    },

    totalWickets: {
        type: Number,
        default: 0
    },

    playerImage: {
        type: String
    },

    isCaptain: {
        type: Boolean,
        default: false
    },

    isViceCaptain: {
        type: Boolean,
        default: false
    }
},
{
    timestamps: true
}
);

export default mongoose.model("Player", playerSchema);