import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { UserAnswer, Interview } from "@/types";
import { Loader2, Star, Award } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Feedback = () => {
  const { interviewId } = useParams<{ interviewId: string }>();
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!interviewId) return;
      try {
        const interviewSnap = await getDoc(doc(db, "interviews", interviewId));
        if (interviewSnap.exists()) {
          setInterview({ ...interviewSnap.data(), id: interviewSnap.id } as Interview);
        }

        const snap = await getDocs(
          query(collection(db, "userAnswers"), where("mockIdRef", "==", interviewId))
        );

        const sortedAnswers = snap.docs
          .map((d) => ({ ...(d.data() as UserAnswer), id: d.id }))
          .sort((a, b) => Number(a.id.split("_").pop()) - Number(b.id.split("_").pop()));

        setAnswers(sortedAnswers);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [interviewId]);

  const overallRating = Math.round(
    (answers.reduce((sum, a) => sum + a.rating, 0) / answers.length) * 10
  ) / 10;

  const performanceLevel = overallRating >= 8.5
    ? { text: "Excellent", color: "text-green-600" }
    : overallRating >= 7
    ? { text: "Good", color: "text-blue-600" }
    : overallRating >= 5
    ? { text: "Average", color: "text-yellow-600" }
    : { text: "Needs Improvement", color: "text-red-600" };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating / 2);
    const halfStar = rating % 2 >= 1;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={16} fill="#FFD700" color="#FFD700" />);
    }
    if (halfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={16} fill="none" color="#FFD700" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star size={16} fill="#FFD700" color="#FFD700" />
          </div>
        </div>
      );
    }
    for (let i = 0; i < 5 - fullStars - (halfStar ? 1 : 0); i++) {
      stars.push(<Star key={`empty-${i}`} size={16} fill="none" color="#FFD700" />);
    }

    return <div className="flex items-center">{stars}</div>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-10 text-gray-600 min-h-[calc(100vh-160px)]">
        <Loader2 className="animate-spin mr-2" /> Loading Feedback...
      </div>
    );
  }

  if (answers.length === 0) {
    return (
      <div className="flex justify-center items-center flex-col py-10 text-gray-600 min-h-[calc(100vh-160px)]">
        <p className="text-lg mb-4">You haven’t attended this interview yet.</p>
        <a
          href={`/interview-session/${interviewId}`}
          className="inline-block bg-primary text-white font-medium py-2 px-4 rounded-lg transition"
        >
          Attend Interview
        </a>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 border border-gray-100">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-center">Interview Feedback</h1>
        {interview && (
          <div className="text-center mb-4 text-gray-700 text-sm md:text-base">
            <h2 className="text-lg md:text-xl font-semibold">{interview.position}</h2>
            <p className="text-gray-500 my-1">{interview.description}</p>
            <p className="text-gray-600">
              <span className="font-medium">Tech Stack:</span> {interview.techStack}
            </p>
          </div>
        )}
        <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 md:p-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-base md:text-lg">Overall Performance</h3>
              <p className={`font-bold text-base md:text-lg ${performanceLevel.color}`}>
                {performanceLevel.text}
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 md:gap-2">
                <Award className="text-yellow-500" size={20} />
                <span className="text-xl md:text-2xl font-bold">{overallRating}/10</span>
              </div>
              <div className="flex mt-1 justify-center">{renderStars(overallRating)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-4">Question-by-Question Feedback</h2>
        <Accordion type="multiple" className="space-y-3">
          {answers.map((ans, idx) => (
            <AccordionItem
              key={ans.id}
              value={`item-${idx}`}
              className="border border-gray-100 rounded-lg overflow-hidden shadow-sm"
            >
              <AccordionTrigger className="text-left px-3 md:px-4 py-2 md:py-3 hover:bg-gray-50 text-sm md:text-base font-medium hover:no-underline">
                <div className="flex justify-between items-center w-full pr-2 md:pr-4">
                  <span className="text-gray-700 line-clamp-1">
                    Q{idx + 1}: {ans.question}
                  </span>
                  <div className="flex items-center gap-1 ml-2 text-sm flex-shrink-0">
                    <span
                      className={`font-bold ${
                        ans.rating >= 7
                          ? "text-green-600"
                          : ans.rating >= 5
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {ans.rating}/10
                    </span>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-gray-50 p-3 md:p-4 space-y-3 md:space-y-4 text-xs md:text-sm text-gray-700">
                <div className="space-y-1 md:space-y-2">
                  <h4 className="font-bold text-gray-900 text-sm md:text-base">
                    Correct Answer:
                  </h4>
                  <p className="bg-white p-2 md:p-3 rounded border border-gray-100">
                    {ans.correct_ans}
                  </p>
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h4 className="font-bold text-gray-900 text-sm md:text-base">Your Answer:</h4>
                  <p className="bg-white p-2 md:p-3 rounded border border-gray-100">
                    {ans.user_ans}
                  </p>
                </div>
                {ans.feedback && (
                  <div className="space-y-1 md:space-y-2">
                    <h4 className="font-bold text-gray-900 text-sm md:text-base">Feedback:</h4>
                    <div className="bg-blue-50 p-3 rounded border border-blue-100 text-gray-700">
                      {ans.feedback}
                    </div>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default Feedback;
