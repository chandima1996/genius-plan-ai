import mongoose from "mongoose";

const RoadmapSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  topic: { type: String, required: true },
  duration: { type: String, required: true },
  level: { type: String, required: true },
  content: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Roadmap", RoadmapSchema);
