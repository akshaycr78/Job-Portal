import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  image: String,
  content: { type: String, required: true },
  location: String,
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  shares: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});


export default mongoose.model("Post", postSchema);
