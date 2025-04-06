import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useNavigate } from "react-router-dom";

const SignInPage = () => {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("User Logged In:", result.user);
      navigate("/home");
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleGoogleSignUp = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google Login Success:", result.user);
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="flex justify-center items-center p-4">
      <div className="h-fit">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold ">
            Login to existing account
          </h1>
          <p className="text-gray-500 ">Enter your details to get started</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center ">
              Sign In
            </CardTitle>
            <CardDescription className="text-gray-500 text-center">
              Sign In with Google or with your email
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="mb-2">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100"
                onClick={handleGoogleSignUp}
              >
                <Mail className="h-5 w-5" />
                Continue with Google
              </Button>
            </div>

            <div className="flex items-center w-full gap-2 my-2">
              <hr className="w-1/2 border-1 rounded-full" />
              <span className="text-xs text-center text-gray-400">
                OR CONTINUE WITH
              </span>
              <hr className="w-1/2 border-1 rounded-full" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="email" className="text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 border-gray-300 focus:ring focus:ring-blue-300"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 border-gray-300 focus:ring focus:ring-blue-300"
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              <Button type="submit" className="w-full ">
                Login to Account
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/signup"
                className="text-gray-500 hover:underline font-medium"
              >
                Sign Up
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignInPage;
