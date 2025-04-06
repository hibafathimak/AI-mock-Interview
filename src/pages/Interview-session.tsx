import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Interview as InterviewType } from "@/types";
import {
  Loader2,
  Mic,
  ArrowRightCircle,
  Video,
  XCircle,
} from "lucide-react";
import Webcam from "react-webcam";

const InterviewSession = () => {
  const { interviewId } = useParams();
  const [interview, setInterview] = useState<InterviewType | null>(null);
  const [currentQnIndex, setCurrentQnIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const [typedAnswers, setTypedAnswers] = useState<string[]>([]);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) return;
      try {
        const ref = doc(db, "interviews", interviewId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() as InterviewType;
          setInterview({ ...data, id: snap.id });
        } else {
          console.warn("No such interview");
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterview();
  }, [interviewId]);



  const submitAnswer = () => {
    const answer = typedAnswers[currentQnIndex];
    if (!answer || answer.trim() === "") {
      alert("Please type an answer before submitting.");
      return;
    }

    console.log("Submitted Answer:", {
      question: currentQuestion.question,
      answer,
    });


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

  if (!interview) {
    return <div className="p-6 text-red-500">Interview data not found.</div>;
  }

  const currentQuestion = interview.questions[currentQnIndex];

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] md:flex-row gap-6 md:gap-10 md:px-10 px-4 py-6">
      {/* Left Panel */}
      <div className="flex-1 bg-white shadow border-2 rounded-2xl p-4 md:p-6 relative">
        <h2 className="text-2xl font-bold mb-4">
          Mock Interview: {interview.position}
        </h2>

        <div className="space-y-6">
          <p className="text-lg  text-gray-600">
            Question {currentQnIndex + 1} of {interview.questions.length}
          </p>
          <p className="text-xl font-semibold text-gray-700">{currentQuestion.question}</p>

          {/* Question Navigator */}
          <div className="flex flex-wrap gap-2">
            {interview.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQnIndex(index)}
                type="button"
                className={`px-3 py-1 rounded-lg shadow text-sm transition ${
                  index === currentQnIndex
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                #{index + 1} Question
              </button>
            ))}
          </div>

          {/* Textarea for Answer */}
          <textarea
            value={typedAnswers[currentQnIndex] || ""}
            onChange={(e) => {
              const updatedAnswers = [...typedAnswers];
              updatedAnswers[currentQnIndex] = e.target.value;
              setTypedAnswers(updatedAnswers);
                      }}
                      readOnly
            placeholder="Start recording your answer..."
            className="w-full p-3 border rounded-lg resize-none outline-0 cursor-auto h-32"
          />

          <div className="flex flex-col bottom-5 absolute sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg transition"
            >
              <Mic size={20} /> Record Answer
            </button>

            <button
              onClick={submitAnswer}
              type="button"
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg transition"
            >
              <ArrowRightCircle size={20} /> Submit Answer
            </button>
          </div>
        </div>
      </div>

      {/* Right Panel - Webcam */}
      <div className="md:w-[30%] w-full flex flex-col gap-4">
        <div className="border-2 border-gray-300 rounded-2xl h-52 md:h-64 flex items-center justify-center bg-gray-100 shadow-inner overflow-hidden">
          {cameraOn ? (
            <Webcam
              ref={webcamRef}
              audio={true}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <Video className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
          )}
        </div>

        <button
          onClick={() => setCameraOn((prev) => !prev)}
          type="button"
          className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-xl shadow transition w-full"
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
