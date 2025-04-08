import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export const evaluateAnswer = async (
  question: string,
  userAns: string,
  correctAns: string
) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      },
    });

    const prompt = `Question: "${question}"
  User Answer: "${userAns}"
  Correct Answer: "${correctAns}"
  Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) and feedback in JSON format like:
  {
    "rating": 7,
    "feedback": "Your answer is partially correct..."
  }
  Only return raw JSON. Do not include markdown or code formatting.
    `; 

    const result = await model.generateContent(prompt);
    let response = result.response.text();
    response = response.replace(/```json|```/g, "").trim();

    return JSON.parse(response) as { rating: number; feedback: string };
  } catch (error: any) {
    console.error("AI Evaluation Error:", error);

    
    if (error.message.includes("429")) {
      throw new Error("Rate limited. Please wait a moment and try again.");
    }

    return {
      rating: 0,
      feedback:
        "Unable to generate feedback at this time. Please try again later.",
    };
  }
};
