import "dotenv/config";
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import multer from "multer";
import OpenAI from "openai";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const upload = multer({ storage: multer.memoryStorage() });

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

/* ================= RECONSTRUCT ================= */
app.post("/reconstruct", upload.single("image"), async (req, res) => {
  try {
    const base64Image = req.file.buffer.toString("base64");

    // Step 1: Get detailed description
    const analysis = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Describe this damaged ancient artifact in detail." },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${base64Image}`
            }
          ]
        }
      ]
    });

    const description = analysis.output_text;

    // Step 2: Generate reconstructed image
    const imageResult = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `Create a photorealistic complete reconstruction of this artifact: ${description}`,
      size: "1024x1024"
    });

    res.json({
      reconstructed: `data:image/png;base64,${imageResult.data[0].b64_json}`
    });

  } catch (err) {
    console.error("RECONSTRUCT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});
/* ================= 3D GENERATION ================= */
app.post("/generate-3d", upload.single("image"), async (req, res) => {
  try {
    const base64Image = req.file.buffer.toString("base64");

    // Step 1: Analyze the image
    const analysis = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Describe this artifact clearly for 3D rendering." },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${base64Image}`
            }
          ]
        }
      ]
    });

    const description = analysis.output_text;

    // Step 2: Generate 3D-style render
    const imageResult = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `Create a realistic museum-style 3D render of this artifact: ${description}`,
      size: "1024x1024"
    });

    res.json({
      model3d: `data:image/png;base64,${imageResult.data[0].b64_json}`
    });

  } catch (err) {
    console.error("3D ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});
/* ================= AGE DETECTION ================= */

app.post("/detect-age", upload.single("image"), async (req, res) => {
  try {
    const base64Image = req.file.buffer.toString("base64");

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: "Estimate the historical age of this artifact briefly."
            },
            {
              type: "input_image",
              image_url: `data:image/jpeg;base64,${base64Image}`
            }
          ]
        }
      ]
    });

    res.json({
      age: response.output_text,
    });

  } catch (err) {
    console.error("AGE ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});