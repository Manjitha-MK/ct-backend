import express from "express";
import upload from "../server/middleware/uploadMiddleware.js";

import {
    uploadImage,
    getGalleryImages,
    deleteGalleryImage,
    likeImage,
    addComment
} from "../controllers/galleryController.js";
import protect from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post(
    "/",
    upload.single("image"),
    uploadImage
);

router.get("/", getGalleryImages);

router.delete("/:id", deleteGalleryImage);

router.put("/:id/like",protect, likeImage)

router.post("/:id/comment",protect ,addComment)

export default router;