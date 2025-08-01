require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post("/recommend", async (req, res) => {
  const { input, products } = req.body;

  try {
    const model = genAI.getGenerativeModel({
      model: "models/gemini-1.5-pro-latest",
    });

    const prompt = `
You are a smart product recommendation system.

A user said: "${input}"

From the following list of products:
${products.map((p) => `- ${p.name} ($${p.price})`).join("\n")}

Choose the most relevant ones and return only the product names, separated by commas. Do NOT include any explanations.

Return only names from the list. Do not invent new products.
`;



    const result = await model.generateContent(prompt);
    const text = result.response.text();
    console.log("Gemini raw output:\n", text);


    console.log("Gemini Response:", text);

    const recommended = products.filter((product) =>
      text.toLowerCase().includes(product.name.toLowerCase())
    );

    console.log("Filtered Recommendations:", recommended);
    res.json({ recommendations: recommended });
  } catch (error) {
    console.error("Error in /recommend:", error);
    res.status(500).json({ error: "Recommendation failed" });
  }
});

app.listen(port, () => {
  console.log(`✅ Backend running at http://localhost:${port}`);
});

