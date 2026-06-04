import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import Player from "../models/Player.js";
import cloudinary from "../config/cloudinary.js";

// CREATE PLAYER

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
      isViceCaptain:
        req.body.isViceCaptain === "true" || req.body.isViceCaptain === true,
      playerImage: req.file
        ? {
            url: req.file.path,
            public_id: req.file.filename,
          }
        : null,
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
    const isViceCaptain =
      body.isViceCaptain === "true" || body.isViceCaptain === true;

    if (isCaptain) {
      await Player.updateMany(
        { _id: { $ne: player._id } },
        { isCaptain: false },
      );
      player.isCaptain = true;
      player.isViceCaptain = false;
    } else {
      player.isCaptain = false;
    }

    if (isViceCaptain) {
      await Player.updateMany(
        { _id: { $ne: player._id } },
        { isViceCaptain: false },
      );
      player.isViceCaptain = true;
      player.isCaptain = false;
    }

    // =========================
    // ✅ IMAGE UPDATE FIX
    // =========================
    if (req.file) {
      // STEP 1: DELETE OLD IMAGE FIRST
      if (
        player.playerImage &&
        typeof player.playerImage === "object" &&
        player.playerImage.public_id
      ) {
        try {
          await cloudinary.uploader.destroy(player.playerImage.public_id);
        } catch (err) {
          console.log("Cloudinary delete error:", err.message);
        }
      }

      // STEP 2: SET NEW IMAGE
      player.playerImage = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updatedPlayer = await player.save();
    res.json(updatedPlayer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    // delete image from cloudinary
    if (player.playerImage?.public_id) {
      await cloudinary.uploader.destroy(player.playerImage.public_id);
    }

    await Player.findByIdAndDelete(req.params.id);

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
