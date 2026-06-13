import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import playerRoutes from "./routes/playerRoutes.js";
import dashboardRoues from "./routes/dashboardRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";
import galleryRoutes from "./routes/galleryRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/players", playerRoutes);
// app.use("/uploads", express.static("uploads"));
app.use("/api/dashboard", dashboardRoues);
app.use("/api/matches", matchRoutes);
app.use("/api/gallery", galleryRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err);
  });



// app.listen(process.env.PORT, () =>
//     console.log(`Server running on port ${process.env.PORT}`)
// );

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: err.message,
    error: err,
  });
});