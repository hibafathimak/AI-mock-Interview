import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';

const SignInPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e:any) => {
    e.preventDefault();
    console.log('Signup attempt with:', { name, email, password });
    // Add your registration logic here
  };
  
  const handleGoogleSignUp = () => {
    console.log('Google sign-up initiated');
    // Add your Google authentication logic here
  };
  
  return (
    <div className="flex justify-center items-center  p-4">
      <div className=" h-fit">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-green-600">Login to existing account</h1>
          <p className="text-gray-500 mt-2">Enter your details to get started</p>
        </div>
        
        <Card>
          <CardHeader >
            <CardTitle className="text-lg font-semibold text-center text-green-600">Sign In</CardTitle>
            <CardDescription className="text-gray-500 text-center">
              Sign In with Google or create an account with your email
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-2">
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-100" onClick={handleGoogleSignUp}>
                <Mail className="h-5 w-5" />
                Continue with Google
              </Button>
            </div>
            
            <div className="flex items-center w-full gap-2 my-2">
              <hr className="w-1/2 border-1 rounded-full" />
              <span className="text-xs text-center text-gray-400">OR CONTINUE WITH</span>
              <hr  className="w-1/2 border-1 rounded-full" />
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <Label htmlFor="email" className="text-gray-700">Email</Label>
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
                <Label htmlFor="password" className="text-gray-700">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 border-gray-300 focus:ring focus:ring-blue-300"
                />
                {/* <p className="text-xs text-gray-500 mt-1">
                  *Must be at least 8 characters with 1 uppercase, 1 number, and 1 special character
                </p> */}
              </div>
              
              
              <Button type="submit" className="w-full bg-green-600 text-white hover:bg-green-500">
                Login to Account
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="text-center">
            <p className="text-sm text-gray-600">
            Doesn't have an account?{' '}
              <a href="/signup" className="text-green-600 hover:underline font-medium">
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
