import { useState, useCallback } from "react";
import { addDoc, collection, doc, setDoc, Timestamp } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { db } from "@/firebaseConfig";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useAuth } from "@/contexts/authContext";
import { useNavigate } from "react-router-dom";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export default function CreateInterview() {
  const { user } = useAuth();
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [experience, setExperience] = useState<number>(0);
  const [techStack, setTechStack] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate()


  const generateQuestions = useCallback(async () => {
    if (!position || !techStack || !user) return;
    setLoading(true);
    setError(null);
  
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  
      const prompt = `
        Generate a JSON array of 5 technical interview questions with answers for a ${position} role requiring ${experience} years of experience in ${techStack}. 
        Format:
        [
          { "question": "<Question text>", "answer": "<Answer text>" },
          ...
        ]
        Output only the JSON array, without extra text.
      `;
  
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
  

      const jsonMatch = responseText.match(/\[.*\]/s);
      if (!jsonMatch) throw new Error("Invalid JSON format from AI");
  
      const parsedQuestions = JSON.parse(jsonMatch[0]);
      if (!Array.isArray(parsedQuestions)) throw new Error("Response was not an array");
  
   
  

      const docRef = await addDoc(collection(db, "interviews"), {
        userId: user.uid,
        position,
        description,
        experience,
        techStack,
        questions: parsedQuestions,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
  
      await setDoc(doc(db, "interviews", docRef.id), { id: docRef.id }, { merge: true });
  
      console.log("Interview saved with ID:", docRef.id);
  

      navigate(`/interview-session/${docRef.id}`);
  
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || "Failed to generate questions.");
    } finally {
      setLoading(false);
    }
  }, [position, techStack, experience, description, user, navigate]);
  

  return (
    <>
      <h1 className="text-2xl font-bold mx-10">Create Interview</h1>
      <div className="min-h-screen p-6 border-2 mx-8 mt-4 rounded-3xl">
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Position</label>
          <input type="text" value={position} onChange={(e) => setPosition(e.target.value)} className="border border-gray-400 rounded-lg p-2 w-full" required />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="border border-gray-400 rounded-lg p-2 w-full h-24" required></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Experience (years)</label>
          <input type="number" value={experience} onChange={(e) => setExperience(Number(e.target.value))} className="border border-gray-400 rounded-lg p-2 w-full" min="0" required />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Tech Stack (comma-separated)</label>
          <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)} className="border border-gray-400 rounded-lg p-2 w-full" required />
        </div>

        <div className="mt-6">
          <Button type="button" onClick={generateQuestions} disabled={loading || !position || !techStack} className={`text-white p-2 rounded ${loading || !position || !techStack ? "opacity-50 cursor-not-allowed" : ""}`}>
            {loading ? "Generating..." : "Generate Questions"}
          </Button>
        </div>
      </div>
    </>
  );
}