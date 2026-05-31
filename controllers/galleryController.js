import Gallery from "../models/Gallery.js";

// CREATE IMAGE
// export const uploadImage = async (req, res) => {
//   try {
//     const gallery = await Gallery.create({
//       imageTitle: req.body.imageTitle,
//       imageUrl: req.file ? req.file.filename : "",
//       uploadedBy: "Admin",
//     });

//     res.status(201).json(gallery);
//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };

// GET ALL IMAGES
export const getGalleryImages = async (req, res) => {
  try {
    const images = await Gallery.find().sort({ createdAt: -1 });

    const fixed = images.map((img) => ({
      ...img._doc,
      likesCount: img.likesCount ?? img.likes ?? 0,
    }));

    res.json(fixed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE IMAGE
export const deleteGalleryImage = async (req, res) => {
  try {
    await Gallery.findByIdAndDelete(req.params.id);

    res.json({
      message: "Image deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// LIKE IMAGE
export const likeImage = async (req, res) => {
  try {
    const tokenUser = req.user;

    if (!tokenUser) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    const alreadyLiked = image.likedUsers.includes(tokenUser._id);

    // REMOVE LIKE
    if (alreadyLiked) {
      image.likedUsers = image.likedUsers.filter(
        (id) => id.toString() !== tokenUser._id.toString(),
      );
    } else {
      // ADD LIKE
      image.likedUsers.push(tokenUser._id);
    }

    image.likesCount = image.likedUsers.length;

    await image.save();

    res.json({
      likesCount: image.likesCount,
      likedUsers: image.likedUsers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    // USER MUST LOGIN
    if (!req.user) {
      return res.status(401).json({
        message: "Login required",
      });
    }

    const { text } = req.body;

    const image = await Gallery.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        message: "Image not found",
      });
    }

    image.comments.push({
      userName: req.user.name,
      text,
    });

    await image.save();

    res.json({
      message: "Comment added",
      comments: image.comments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const uploadImage = async (req, res) => {
  try {
      console.log("Received file:", req.file); // Debugging log

    const gallery = await Gallery.create({
      imageTitle: req.body.imageTitle,
      imageUrl: req.file ? req.file.path : "", // CLOUDINARY URL
      uploadedBy: "Admin",
    });

    res.status(201).json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};