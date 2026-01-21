import Roadmap from "../models/Roadmap.js";

export const saveRoadmap = async (req, res) => {
  try {
    const { userId, roadmapData, topic, duration, level } = req.body;
    const newRoadmap = new Roadmap({
      userId,
      title: roadmapData.title,
      description: roadmapData.description,
      topic,
      duration,
      level,
      content: roadmapData,
    });
    const saved = await newRoadmap.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserRoadmaps = async (req, res) => {
  try {
    const { userId } = req.params;
    const roadmaps = await Roadmap.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(roadmaps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRoadmapProgress = async (req, res) => {
  try {
    const { roadmapId, content } = req.body;

    const updatedRoadmap = await Roadmap.findByIdAndUpdate(
      roadmapId,
      { content: content },
      { new: true }
    );

    if (!updatedRoadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    res.status(200).json(updatedRoadmap);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPublicRoadmap = async (req, res) => {
  try {
    const { id } = req.params;
    const roadmap = await Roadmap.findById(id);

    if (!roadmap) {
      return res.status(404).json({ error: "Roadmap not found" });
    }

    res.status(200).json(roadmap);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch roadmap" });
  }
};
