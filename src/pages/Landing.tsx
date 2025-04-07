import { Button } from "@/components/ui/button";
import { Mic, BarChart, History, Sparkles, Bot, CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <>
      <div className=" flex flex-col">
        <nav className="h-[80px]">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <a
              href="/"
              className="text-2xl font-bold cursor-pointer text-gray-900 flex items-center gap-2"
            >
              <Sparkles className="w-6 h-6 text-blue-500" />
              MockAI
            </a>

            <Button
              variant="outline"
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => {
                navigate("/signin");
              }}
            >
              <CircleUserRound className="w-5 h-5" />
              Login
            </Button>
          </div>
        </nav>

        <section className="flex-1 flex flex-col justify-center items-center text-center px-6 py-36 max-w-screen-xl mx-auto">
          <img
            src="/icon.png"
            alt="AI Interview Icon"
            width={200}
            height={200}
            className="mx-auto mb-6"
          />

          <h1 className="text-4xl font-bold mb-4">
            AI-Powered Mock Interviews
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Improve your interview skills with real-time AI feedback and
            insights.
          </p>
          <Button
            onClick={() => {
              navigate("/signup");
            }}
            className="mt-6 px-6 py-3 text-lg cursor-pointer"
          >
            Get Started
          </Button>
        </section>
        <section className="py-16 flex flex-col justify-center items-center text-center px-6">
        
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How MockAI Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-8 bg-white bg-opacity-90 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center h-full">
              <div className="p-4 bg-[#DBE1EE] rounded-full mb-6">
                <Bot className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI-Powered Questions</h3>
              <p className="text-gray-600 text-center">Get dynamically generated interview questions tailored to your skills and experience.</p>
            </div>
            
            <div className="p-8 bg-white bg-opacity-90 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center h-full">
              <div className="p-4 bg-[#DBE1EE] rounded-full mb-6">
                <Mic className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Voice Interaction</h3>
              <p className="text-gray-600 text-center">Simulate authentic interview scenarios with natural voice-enabled AI conversations.</p>
            </div>
            
            <div className="p-8 bg-white bg-opacity-90 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center h-full">
              <div className="p-4 bg-[#DBE1EE] rounded-full mb-6">
                <BarChart className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Performance Analytics</h3>
              <p className="text-gray-600 text-center">Receive detailed feedback and comprehensive analytics to identify areas for improvement.</p>
            </div>
            
            <div className="p-8 bg-white bg-opacity-90 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center h-full">
              <div className="p-4 bg-[#DBE1EE] rounded-full mb-6">
                <History className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Past Interviews</h3>
              <p className="text-gray-600 text-center">Track your progress over time by reviewing previous interview sessions and insights.</p>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-16 px-6">
        <div className=" text-gray-600 text-center py-12 px-6 rounded-2xl max-w-5xl mx-auto shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Ready to Ace Your Next Interview?</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8 leading-relaxed">
            Level up your interview game with MockAI — get tailored feedback and insights to help you land your dream job.
            </p>
            <Button 
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-medium rounded-full shadow-md hover:shadow-lg transition-all duration-300" 
              onClick={() => navigate('/signup')}
            >
              Join Now
            </Button>
          </div>

          <div className="absolute top-0 left-0 w-full h-full bg-white ">
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-blue-50 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-50 -ml-20 -mb-20"></div>
          </div>
        </div>
      </section>
  
      </div>
    </>
  );
}
