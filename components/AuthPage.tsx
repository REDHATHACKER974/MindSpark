
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthPageProps {
  onLogin: (user: { name: string; email: string }) => void;
  isDarkMode: boolean;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, isDarkMode }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !name)) return;

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setLoading(false);
      onLogin({
        name: isLogin ? email.split('@')[0] : name, // Mock name extraction or use input
        email: email
      });
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    // Simulate Google Pop-up flow
    setTimeout(() => {
      setGoogleLoading(false);
      onLogin({
        name: 'Alex Johnson',
        email: 'alex.johnson@gmail.com'
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full flex overflow-hidden dark:bg-slate-950 bg-slate-50 transition-colors duration-300">
      
      {/* Left Side - Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <Sparkles className="text-cyan-400" size={28} />
            </div>
            <span className="text-3xl font-bold tracking-tight">MindSpark</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h2 className="text-4xl font-bold mb-6 leading-tight">
            Unlock your full <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">learning potential.</span>
          </h2>
          <p className="text-indigo-200 text-lg mb-8 leading-relaxed">
            "MindSpark has completely transformed how I study. The AI tutors explain things better than my textbooks, and the focus tools keep me on track."
          </p>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-4">
               {[1,2,3,4].map(i => (
                 <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-900 bg-indigo-800 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                 </div>
               ))}
            </div>
            <div className="text-sm font-medium text-indigo-200">
                Join 10,000+ Students
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-indigo-300/60">
            © 2024 MindSpark AI. All rights reserved.
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md space-y-8">
          
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold dark:text-white text-slate-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h2>
            <p className="dark:text-slate-400 text-slate-500">
              {isLogin ? 'Enter your details to access your workspace.' : 'Start your journey with a free account today.'}
            </p>
          </div>

          <div className="space-y-4">
            {/* Google Button */}
            <button 
                onClick={handleGoogleLogin}
                disabled={loading || googleLoading}
                className="w-full h-12 flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-all text-slate-700 dark:text-slate-200 font-medium shadow-sm hover:shadow disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {googleLoading ? (
                    <Loader2 size={20} className="animate-spin text-slate-500" />
                ) : (
                    <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span>Continue with Google</span>
                    </>
                )}
            </button>

            <div className="relative flex items-center py-2">
                <div className="flex-grow border-t dark:border-slate-800 border-slate-200"></div>
                <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400 uppercase tracking-widest">Or continue with</span>
                <div className="flex-grow border-t dark:border-slate-800 border-slate-200"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="space-y-1">
                        <label className="text-sm font-medium dark:text-slate-300 text-slate-700 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-slate-400" size={20} />
                            <input 
                                type="text" 
                                required={!isLogin}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-xl px-12 py-3.5 dark:text-white text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400" 
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    <label className="text-sm font-medium dark:text-slate-300 text-slate-700 ml-1">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-xl px-12 py-3.5 dark:text-white text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400" 
                            placeholder="name@example.com"
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium dark:text-slate-300 text-slate-700 ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-3.5 text-slate-400" size={20} />
                        <input 
                            type="password" 
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-xl px-12 py-3.5 dark:text-white text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400" 
                            placeholder="••••••••"
                        />
                    </div>
                </div>

                {isLogin && (
                    <div className="flex justify-end">
                        <button type="button" className="text-sm font-medium text-indigo-500 hover:text-indigo-400">Forgot password?</button>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading || googleLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : (
                        <>
                            <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>
          </div>

          <div className="text-center">
            <p className="text-sm dark:text-slate-400 text-slate-500">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button 
                    onClick={() => { setIsLogin(!isLogin); setEmail(''); setPassword(''); setName(''); }}
                    className="font-bold text-indigo-500 hover:text-indigo-400 transition-colors"
                >
                    {isLogin ? 'Sign up' : 'Log in'}
                </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
