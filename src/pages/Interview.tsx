import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import {
  Video,
  Loader2,
  HelpCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Interview as InterviewType } from "@/types";
import Webcam from "react-webcam";

const Interview = () => {
  const { interviewId } = useParams();
  const [interviewDetails, setInterviewDetails] =
    useState<InterviewType | null>(null);
  const [loading, setLoading] = useState(true);
  const [cameraOn, setCameraOn] = useState(false);
  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterview = async () => {
      if (!interviewId) return;

      try {
        const interviewRef = doc(db, "interviews", interviewId);
        const interviewSnap = await getDoc(interviewRef);

        if (interviewSnap.exists()) {
          const data = interviewSnap.data() as InterviewType;
          setInterviewDetails({ ...data, id: interviewSnap.id });
        } else {
          console.warn("No such interview document found!");
          setInterviewDetails(null);
        }
      } catch (error) {
        console.error("Error fetching interview:", error);
        setInterviewDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  const formatDate = (timestamp: Timestamp) => {
    return timestamp.toDate().toLocaleString();
  };

  const videoConstraints = {
    width: 300,
    height: 200,
    facingMode: "user",
  };

  return (
    <div className="min-h-[calc(100vh-160px)] md:px-10 px-4 py-6 space-y-6">
      <div className="mt-2 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-800 rounded-md shadow text-sm md:text-base">
        <div className="flex items-start gap-3 text-start">
          <AlertTriangle className="w-5 h-5 mt-1 text-blue-600" />
          <div>
            <p>
              Please enable your webcam and microphone to start the AI-generated
              mock interview. The interview consists of five questions. You'll
              receive a personalized report based on your responses at the end.
            </p>
            <p className="mt-4">
              <span className="font-medium">Note:</span> Your video is{" "}
              <strong>never recorded</strong>. You can disable your webcam at
              any time.
            </p>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col md:flex-row gap-4 md:gap-10 ">
        <div className="w-full lg:w-[70%] border-2 p-4 md:p-6 rounded-2xl bg-white shadow h-fit">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-2">
            <HelpCircle className="text-blue-500" /> Interview Info
          </h1>

          {loading ? (
            <div className="text-gray-500 flex items-center gap-2">
              <Loader2 className="animate-spin" /> Loading interview details...
            </div>
          ) : !interviewDetails ? (
            <p className="text-gray-500">No interview details available.</p>
          ) : (
            <div className="space-y-4 text-gray-800 text-sm md:text-base">
              <p>
                <span className="font-semibold">Position:</span>{" "}
                {interviewDetails.position}
              </p>
              <p>
                <span className="font-semibold">Experience:</span>{" "}
                {interviewDetails.experience} years
              </p>
              <p>
                <span className="font-semibold">Tech Stack:</span>{" "}
                {interviewDetails.techStack}
              </p>
              <p>
                <span className="font-semibold">Created At:</span>{" "}
                {formatDate(interviewDetails.createdAt)}
              </p>
              {interviewDetails.description && (
                <p>
                  <span className="font-semibold">Description:</span>{" "}
                  {interviewDetails.description}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="w-full lg:w-[30%] flex flex-col gap-4">
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

          <div className="flex flex-col items-center gap-4 w-full">
            <button
              onClick={() => setCameraOn((prev) => !prev)}
              className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-xl shadow w-full"
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

            <button
              onClick={() =>
                navigate(`/interview-session/${interviewId}/start`)
              }
              className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-xl shadow w-full"
            >
              <Sparkles size={20} /> Start Interview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
