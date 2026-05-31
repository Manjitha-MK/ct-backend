import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
{
    opponentTeam: {
        type: String,
        required: true
    },

    venue: {
        type: String,
        required: true
    },

    matchDate: {
        type: Date,
        required: true
    },

    ourScore: {
        type: String
    },

    opponentScore: {
        type: String
    },

    result: {
        type: String,
        enum: ["Win", "Loss", "Draw", "Upcoming"],
        default: "Upcoming"
    },

    matchType: {
        type: String,
        enum: ["Friendly", "Tournament", "League"],
        required: true
    }
},
{
    timestamps: true
}
);

export default mongoose.model("Match", matchSchema);