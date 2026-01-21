import express from "express";
import {
  generateRoadmap,
  chatWithAI,
  generateQuiz,
} from "../controllers/aiController.js";
import {
  saveRoadmap,
  getUserRoadmaps,
  updateRoadmapProgress,
  getPublicRoadmap,
} from "../controllers/roadmapController.js";

const router = express.Router();

// AI Routes
router.post("/generate", generateRoadmap);
router.post("/chat", chatWithAI);
router.post("/quiz", generateQuiz);

// DB Routes
router.post("/save", saveRoadmap);
router.get("/user/:userId", getUserRoadmaps);
router.put("/update", updateRoadmapProgress);
router.get("/public/:id", getPublicRoadmap);

export default router;
