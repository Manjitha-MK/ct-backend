import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },

  text: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const gallerySchema = new mongoose.Schema(
  {
    imageTitle: {
      type: String,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: String,
      default: "Admin",
    },

    // LIKE COUNT
    likesCount: {
      type: Number,
      default: 0,
    },

    // OPTIONAL
    likedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // COMMENTS
    comments: [commentSchema],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Gallery", gallerySchema);
