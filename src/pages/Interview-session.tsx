import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Interview as InterviewType, UserAnswer } from "@/types";
import {
  Loader2,
  Mic,
  ArrowRightCircle,
  Video,
  XCircle,
  MicOff,
  AlertTriangle,
  Volume2,
} from "lucide-react";
import Webcam from "react-webcam";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/authContext";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const InterviewSession = () => {
  const { interviewId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interview, setInterview] = useState<InterviewType | null>(null);
  const [currentQnIndex, setCurrentQnIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [typedAnswers, setTypedAnswers] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [submittedIndexes, setSubmittedIndexes] = useState<number[]>([]);

  const webcamRef = useRef<Webcam>(null);
  const recognitionRef = useRef<any | null>(null);
  const currentIndexRef = useRef(currentQnIndex);

  const userId = user?.uid;

  useEffect(() => {
    if (!interviewId || !userId) {
      setLoading(false);
      return;
    }

    const fetchInterview = async () => {
      try {
        const ref = doc(db, "interviews", interviewId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as InterviewType;
          setInterview({ ...data, id: snap.id });
        }
      } catch (err) {
        console.error("Error fetching interview:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId, userId]);

  useEffect(() => {
    currentIndexRef.current = currentQnIndex;
  }, [currentQnIndex]);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  const getCurrentQuestion = () => {
    if (
      !interview ||
      !interview.questions ||
      !interview.questions[currentQnIndex]
    ) {
      return null;
    }
    return interview.questions[currentQnIndex];
  };

  const currentQuestion = getCurrentQuestion();

  const readQuestionAloud = () => {
    if (!currentQuestion?.question) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question);
    utterance.lang = "en-US";
    window.speechSynthesis.speak(utterance);
  };

  const toggleRecording = () => {
    if (
      !("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim();
        const idx = currentIndexRef.current;
        setTypedAnswers((prev) => {
          const updated = [...prev];
          updated[idx] = (updated[idx] || "") + " " + transcript;
          return updated;
        });
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        alert("Speech recognition failed.");
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const getAIResponse = async (
    question: string,
    userAns: string,
    correctAns: string
  ) => {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.7,
      },
    });

    const prompt = `
  Question: "${question}"
  User Answer: "${userAns}"
  Correct Answer: "${correctAns}"
  Please compare the user's answer to the correct answer, and provide a rating (from 1 to 10) and feedback in JSON format like:
  {
    "rating": 7,
    "feedback": "Your answer is partially correct..."
  }
  Only return raw JSON. Do not include markdown or code formatting.
    `;

    try {
      const result = await model.generateContent(prompt);
      let response = result.response.text();

      response = response.replace(/```json|```/g, "").trim();

      const parsed = JSON.parse(response);
      return {
        rating: parsed.rating ?? 0,
        feedback: parsed.feedback ?? "No feedback provided.",
      };
    } catch (err: any) {
      console.error("Gemini AI error:", err);

      if (err.message.includes("429")) {
        alert("Too many requests to Gemini API. Please wait and try again.");
      }

      return {
        rating: 0,
        feedback: "Unable to generate feedback at the moment. Try again later.",
      };
    }
  };

  const submitAnswer = async () => {
    if (!interview || !userId || !interviewId || !currentQuestion) return;

    const answer = typedAnswers[currentQnIndex];

    if (!answer || answer.trim() === "") {
      alert("Please type or record an answer before submitting.");
      return;
    }

    const question = currentQuestion.question;
    const correct_ans = currentQuestion.answer || "";
    const docId = `${userId}_${interviewId}_${currentQnIndex}`;
    const docRef = doc(db, "userAnswers", docId);

    try {
      const existingSnap = await getDoc(docRef);
      let rating = 0;
      let feedback = "Not evaluated.";

      if (
        !existingSnap.exists() ||
        (existingSnap.exists() && answer !== existingSnap.data().user_ans)
      ) {
        const aiResult = await getAIResponse(question, answer, correct_ans);
        rating = aiResult.rating;
        feedback = aiResult.feedback;
      } else {
        rating = existingSnap.data().rating;
        feedback = existingSnap.data().feedback;
      }

      const newAnswer: UserAnswer = {
        id: docId,
        mockIdRef: interviewId,
        question,
        correct_ans,
        user_ans: answer,
        feedback,
        rating,
        userId,
        createdAt: existingSnap.exists()
          ? existingSnap.data().createdAt
          : Timestamp.now(),
        updateAt: Timestamp.now(),
      };

      await setDoc(docRef, newAnswer);

      setSubmittedIndexes((prev) =>
        prev.includes(currentQnIndex) ? prev : [...prev, currentQnIndex]
      );

      if (currentQnIndex < interview.questions.length - 1) {
        setCurrentQnIndex((prev) => prev + 1);
      } else {
        navigate(`/feedback/${interviewId}`);
      }
    } catch (err) {
      console.error("Error saving answer:", err);
      alert("Failed to save the answer. Please try again.");
    }
  };

  const videoConstraints = {
    width: 300,
    height: 200,
    facingMode: "user",
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mr-2" />
        Loading Interview Session...
      </div>
    );
  }

  if (!interview || !userId) {
    return (
      <div className="p-6 text-red-500">
        {!userId
          ? "User authentication required. Please log in."
          : "Interview data not found."}
      </div>
    );
  }

  return (
    <div className="flex  min-h-[calc(100vh-160px)] md:flex-row flex-col-reverse gap-6 md:gap-10 md:px-10 px-4 pt-6">
      <div className="md:w-[50%]  flex-1 bg-white shadow border-2 rounded-2xl p-4 md:p-6 h-fit">
        <h2 className="text-2xl font-bold mb-4">
          Mock Interview: {interview.position}
        </h2>

        <div className="space-y-6">
          <p className="text-lg text-gray-600">
            Question {currentQnIndex + 1} of {interview.questions.length}
          </p>
          {currentQuestion ? (
            <div className="text-xl font-semibold text-gray-700 flex items-start gap-2">
              {currentQuestion.question}
              <button
                onClick={readQuestionAloud}
                disabled={!currentQuestion}
                className={`text-gray-500 hover:text-gray-700 transition ${
                  !currentQuestion ? "opacity-50 cursor-not-allowed" : ""
                }`}
                aria-label="Read question aloud"
              >
                <Volume2 />
              </button>
            </div>
          ) : (
            <p className="text-xl font-semibold text-red-500">
              Question not available
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {interview.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  window.speechSynthesis.cancel();
                  setCurrentQnIndex(index);
                }}
                className={`px-3 py-1 rounded-lg shadow text-sm ${
                  index === currentQnIndex
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                #{index + 1}
              </button>
            ))}
          </div>

          <textarea
            value={typedAnswers[currentQnIndex] || ""}
            onChange={(e) => {
              const updated = [...typedAnswers];
              updated[currentQnIndex] = e.target.value;
              setTypedAnswers(updated);
            }}
            placeholder="Start typing or use voice input..."
            className="w-full p-3 border rounded-lg resize-none h-32"
          />

          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 ">
            <button
              onClick={toggleRecording}
              disabled={!currentQuestion}
              className={`flex items-center gap-2 ${
                isRecording ? "bg-red-600" : "bg-primary"
              } text-white px-4 py-2 rounded-lg ${
                !currentQuestion ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              {isRecording ? "Listening..." : "Record Answer"}
            </button>

            <button
              onClick={submitAnswer}
              disabled={
                submittedIndexes.includes(currentQnIndex) || !currentQuestion
              }
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white ${
                submittedIndexes.includes(currentQnIndex) || !currentQuestion
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary"
              }`}
            >
              <ArrowRightCircle size={20} />
              {submittedIndexes.includes(currentQnIndex)
                ? "Already Submitted"
                : "Submit Answer"}
            </button>
          </div>
        </div>
      </div>

      <div className="md:w-[30%] w-full flex flex-col gap-4">
        <div className="p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded-md shadow text-sm md:text-base">
          <div className="flex items-start gap-3 text-start">
            <span>
              <AlertTriangle className="w-5 h-5 mt-1 text-blue-600" />
            </span>
            <div>
              <p>
                Please enable your webcam and microphone to start the
                AI-generated mock interview. The interview consists of five
                questions. You’ll receive a personalized report based on your
                responses at the end.
              </p>
              <p className="mt-4">
                <span className="font-medium">Note:</span> Your video is{" "}
                <strong>never recorded</strong>. You can disable your webcam at
                any time.
              </p>
            </div>
          </div>
        </div>

        <div className="border-2 border-gray-300 rounded-2xl h-52 md:h-64 flex items-center justify-center bg-gray-100 shadow-inner overflow-hidden">
          {cameraOn ? (
            <Webcam
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <Video className="w-10 h-10 text-gray-400" />
          )}
        </div>

        <button
          onClick={() => setCameraOn((prev) => !prev)}
          className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-xl shadow"
        >
          {cameraOn ? (
            <>
              <XCircle size={20} /> Stop Camera
            </>
          ) : (
            <>
              <Video size={20} /> Start Camera
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default InterviewSession;
