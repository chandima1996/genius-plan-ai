import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateRoadmap = async (req, res) => {
  const { topic, duration, level } = req.body;
  if (!topic || !duration)
    return res.status(400).json({ error: "Missing details" });

  try {
    const prompt = `Create a learning roadmap for "${topic}" (Level: ${level}, Duration: ${duration}).
    Return ONLY valid JSON. No markdown. No text outside JSON.
    Structure: { "title": "...", "description": "...", "weeks": [{ "weekNumber": 1, "topic": "...", "details": ["Detail 1", "Detail 2"], "resources": ["..."] }] }`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    let content = completion.choices[0]?.message?.content || "";
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const json = JSON.parse(content);

    if (json.weeks && Array.isArray(json.weeks)) {
      json.weeks = json.weeks.map((week) => ({
        ...week,
        details: Array.isArray(week.details)
          ? week.details.map((detail) => ({
              text: detail,
              completed: false,
            }))
          : [],
      }));
    }

    res.status(200).json(json);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: "AI Generation Failed" });
  }
};

export const chatWithAI = async (req, res) => {
  const { message, context } = req.body;

  if (!message) return res.status(400).json({ error: "Message required" });

  try {
    const systemPrompt = `You are a helpful AI Tutor assisting a student. 
    The student is currently following this learning roadmap:
    Title: "${context.title}"
    Description: "${context.description}"
    
    Answer the student's question specifically related to this topic. Keep answers concise, encouraging, and easy to understand.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't understand that.";

    res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ error: "Chat failed" });
  }
};

export const generateQuiz = async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: "Topic required" });

  try {
    const prompt = `Generate 3 multiple-choice questions (MCQ) to test a student's knowledge on: "${topic}".
    Return ONLY valid JSON array. Structure:
    [
      {
        "question": "Question text?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "correctAnswer": 0 (index of correct option 0-3)
      }
    ]`;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
    });

    let content = completion.choices[0]?.message?.content || "[]";
    content = content
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const quiz = JSON.parse(content);
    res.status(200).json(quiz);
  } catch (error) {
    console.error("Quiz Error:", error);
    res.status(500).json({ error: "Quiz generation failed" });
  }
};
