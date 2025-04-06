import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { auth, Googleprovider } from '@/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      setLoading(false);
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      if (result.user) {
        await updateProfile(result.user, { displayName: name });
        navigate('/home');
      }
    } catch (error: any) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const result = await signInWithPopup(auth, Googleprovider);
      console.log('Google Sign-In:', result.user);
      navigate('/home');
    } catch (err) {
      console.error(err);
      setError('Google Sign-In failed');
    }
  };

  return (
    <div className="flex justify-center items-center p-4 w-full">
      <div className="w-[350px]">
      <div className="text-center mb-4">
          <h1 className="text-3xl font-bold ">Create an Account</h1>
          <p className="text-gray-500 mt-2">Enter your details to get started</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-center ">Sign Up</CardTitle>
            <CardDescription className="text-gray-500 text-center">
              Sign up with Google or create an account with your email
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100" onClick={handleGoogleSignUp}>
              <Mail className="h-5 w-5" />
              Continue with Google
            </Button>

            <div className="flex items-center my-4">
              <hr className="w-full border-gray-300" />
              <span className="px-2 text-xs text-gray-400">OR</span>
              <hr className="w-full border-gray-300" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <Label>Full Name</Label>
              <Input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />

              <Label>Email</Label>
              <Input type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />

              <Label>Password</Label>
              <Input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />

              {error && <p className="text-xs text-red-500">{error}</p>}

              <Button type="submit" className="w-full  text-white " disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="text-center">
            <p className="text-sm ">
              Already have an account?{' '}
              <a href="/signin" className=" text-gray-500 hover:underline font-medium">
                Sign In
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SignUpPage;
