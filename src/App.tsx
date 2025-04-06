import { Routes, Route } from "react-router-dom";
import PublicLayout from "./layouts/public-layout";

import AuthenticationLayout from "./layouts/auth-layout";
import SignUpPage from "./pages/Singup";
import SignInPage from "./pages/Singin";
import ProtectedRoute from "./layouts/protectedRoute";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/createPage";
import Feedback from "./pages/Feedback";
import Interview from "./pages/Interview";
import InterviewSession from "./pages/Interview-session";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route index element={<Landing />} />
        </Route>

        {/* Authentication Routes */}
        <Route element={<AuthenticationLayout />}>
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/signin" element={<SignInPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-mock" element={<CreateInterview />} />
          <Route path="/interview-session/:interviewId" element={<Interview />} />
          <Route path="/interview-session/:interviewId/start" element={<InterviewSession />} />
          <Route path="/feedback/:interviewId" element={<Feedback />} />
        </Route>

        {/* Default Route */}
        <Route path="*" element={<SignInPage />} />
      </Routes>
    </>
  );
}

export default App;
