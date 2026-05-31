import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Player from "../models/Player.js";

// CREATE PLAYER
// export const createPlayer = async (req, res) => {
//   try {
//     const player = await Player.create({
//       ...req.body,
//       playerImage: req.file ? req.file.filename : "",
//     });

//     res.status(201).json(player);
//   } catch (error) {
//     console.log("CREATE ERROR:", error);

//     if (error.code === 11000) {
//       return res.status(400).json({
//         message:
//           "Jersey number already exists. Please choose a unique jersey number.",
//       });
//     }

//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const createPlayer = async (req, res) => {
  try {
    const playerData = {
      ...req.body,
      age: Number(req.body.age),
      matchesPlayed: Number(req.body.matchesPlayed || 0),
      totalRuns: Number(req.body.totalRuns || 0),
      totalWickets: Number(req.body.totalWickets || 0),
      dateOfBirth: req.body.dateOfBirth || null,
      isCaptain: req.body.isCaptain === "true" || req.body.isCaptain === true,
      isViceCaptain: req.body.isViceCaptain === "true" || req.body.isViceCaptain === true,
      playerImage: req.file ? req.file.path : "",
    };

    // 🧢 ENFORCE SINGLE CAPTAIN
    if (playerData.isCaptain) {
      await Player.updateMany({}, { isCaptain: false });
    }

    // ⭐ ENFORCE SINGLE VICE CAPTAIN
    if (playerData.isViceCaptain) {
      await Player.updateMany({}, { isViceCaptain: false });
    }

    const player = await Player.create(playerData);

    res.status(201).json(player);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL PLAYERS
export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find();
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSinglePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        message: "Player not found",
      });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PLAYER
// export const updatePlayer = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const updatedData = {
//       ...req.body,
//     };

//     // If new image uploaded, update it
//     if (req.file) {
//       updatedData.playerImage = req.file.filename;
//     }

//     const player = await Player.findByIdAndUpdate(id, updatedData, {
//       returnDocument: "after",
//       runValidators: true,
//     });

//     if (!player) {
//       return res.status(404).json({
//         message: "Player not found",
//       });
//     }

//     res.status(200).json(player);
//   } catch (error) {
//     console.log("CREATE ERROR:", error);

//     if (error.code === 11000) {
//       return res.status(400).json({
//         message:
//           "Jersey number already exists. Please choose a unique jersey number.",
//       });
//     }
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    const body = req.body;

    // update fields safely
    player.fullName = body.fullName || player.fullName;
    player.age = body.age ? Number(body.age) : player.age;
    player.role = body.role || player.role;
    player.jerseyNumber = body.jerseyNumber || player.jerseyNumber;
    player.battingStyle = body.battingStyle || player.battingStyle;
    player.bowlingStyle = body.bowlingStyle || player.bowlingStyle;

    player.matchesPlayed = body.matchesPlayed
      ? Number(body.matchesPlayed)
      : player.matchesPlayed;

    player.totalRuns = body.totalRuns
      ? Number(body.totalRuns)
      : player.totalRuns;

    player.totalWickets = body.totalWickets
      ? Number(body.totalWickets)
      : player.totalWickets;

    player.dateOfBirth = body.dateOfBirth || player.dateOfBirth;

    // 🧢 CAPTAIN LOGIC
    const isCaptain = body.isCaptain === "true" || body.isCaptain === true;
    const isViceCaptain = body.isViceCaptain === "true" || body.isViceCaptain === true;

    if (isCaptain) {
      await Player.updateMany(
        { _id: { $ne: player._id } },
        { isCaptain: false }
      );
      player.isCaptain = true;
      player.isViceCaptain = false; // safety rule
    } else {
      player.isCaptain = false;
    }

    if (isViceCaptain) {
      await Player.updateMany(
        { _id: { $ne: player._id } },
        { isViceCaptain: false }
      );
      player.isViceCaptain = true;
      player.isCaptain = false; // safety rule
    }

    // image
    if (req.file) {
      player.playerImage = req.file.path;
    }

    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
// DELETE PLAYER
// export const deletePlayer = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const player = await Player.findById(id);

//     if (!player) {
//       return res.status(404).json({
//         message: "Player not found",
//       });
//     }

//     // SAFE IMAGE DELETE
//     if (player.playerImage) {
//       const imagePath = path.join(process.cwd(), "uploads", player.playerImage);

//       try {
//         if (fs.existsSync(imagePath)) {
//           fs.unlinkSync(imagePath);
//         }
//       } catch (fileError) {
//         console.log("File delete error:", fileError.message);
//       }
//     }

//     await Player.findByIdAndDelete(id);

//     res.status(200).json({
//       message: "Player deleted successfully",
//     });
//   } catch (error) {
//     console.log("DELETE ERROR:", error);
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

export const deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;

    const player = await Player.findByIdAndDelete(id);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Top Run Scorers
export const getTopRunScorers = async (req, res) => {
  try {
    const players = await Player.find().sort({ totalRuns: -1 }).limit(10);

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Top Wicket Takers
export const getTopWicketTakers = async (req, res) => {
  try {
    const players = await Player.find().sort({ totalWickets: -1 }).limit(10);

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
