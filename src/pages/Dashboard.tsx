import { Plus, Sparkles, Trash2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { Interview } from "@/types";
import { db } from "@/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/authContext"; 

export default function Dashboard() {
  const { user } = useAuth(); 
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return; 

    setLoading(true);

    const interviewQuery = query(
      collection(db, "interviews"),
      where("userId", "==", user.uid) 
    );

    const unsubscribe = onSnapshot(interviewQuery, (snapshot) => {
      const interviewData = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as Interview)
      );
      setInterviews(interviewData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]); 

  const deleteInterview = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      await deleteDoc(doc(db, "interviews", id));
    }
  };

  return (
<TooltipProvider>
<div className="h-[calc(100vh-160px)] overflow-y-scroll border-2 mx-4 sm:mx-8 mt-4 rounded-3xl scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
    <div className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row justify-between border-b">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-600">Create and start your AI Mock Interview</p>
      </div>
      <Button
        onClick={() => navigate("/create-mock")}
        className="mt-4 sm:mt-0 flex items-center gap-2"
      >
        <Plus className="w-5 h-5" /> Create Interview
      </Button>
    </div>

    {loading ? (
      <div className="p-6 text-center text-gray-500">Loading interviews...</div>
    ) : interviews.length === 0 ? (
      <div className="p-6 h-[500px] flex flex-col items-center justify-center text-center text-gray-500">
        <h2 className="text-xl font-semibold">Welcome!</h2>
        <p className="mt-2">No interviews found. Start by creating one.</p>
      </div>
    ) : (
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {interviews.map((interview) => (
          <div
            key={interview.id}
            className="bg-white relative p-4 shadow-md rounded-lg"
          >
            <h2 className="text-lg font-semibold">{interview.position}</h2>
            <p className="text-gray-600 mb-2">{interview.description}</p>

            <div className="flex flex-wrap gap-2 my-2">
              {interview.techStack?.split(",").map((tech) => (
                <span
                  key={tech.trim()}
                  className="bg-gray-200 text-sm px-2 py-1 rounded-md"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>

            <div className="flex pt-5 justify-between items-center">
              <p className="text-xs text-gray-500">
                {interview.createdAt
                  ? new Date(interview.createdAt.toDate()).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  : "No Date"}
              </p>

              <div className="flex space-x-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() =>
                        navigate(`/interview-session/${interview.id}`)
                      }
                      size="icon"
                      variant="ghost"
                      className="hover:bg-gray-100"
                    >
                      <Sparkles className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Start Interview</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() =>
                        navigate(`/feedback/${interview.id}`)
                      }
                      size="icon"
                      variant="ghost"
                      className="hover:bg-gray-100"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Get Feedback</TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => deleteInterview(interview.id)}
                      size="icon"
                      variant="ghost"
                      className="hover:bg-gray-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete Interview</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</TooltipProvider>
  );
}
