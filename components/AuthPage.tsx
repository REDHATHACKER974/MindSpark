
import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Loader2, Sparkles, Globe } from 'lucide-react';
import { translations, Language } from '../utils/translations';

interface AuthPageProps {
  onLogin: (user: { name: string; email: string }) => void;
  isDarkMode: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onLogin, isDarkMode, language, setLanguage }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const t = (key: string) => translations[language][key] || translations['en'][key] || key;

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

  return (
    <div className="min-h-screen w-full flex overflow-hidden dark:bg-slate-950 bg-slate-50 transition-colors duration-300">
      
      {/* Left Side - Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-indigo-900 overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        {/* Animated Background Blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative z-10 flex justify-between items-start">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <Sparkles className="text-cyan-400" size={28} />
            </div>
            <span className="text-3xl font-bold tracking-tight">{t('app.name')}</span>
          </div>

          {/* Language Selector */}
          <div className="relative">
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white flex items-center gap-1">
                    <Globe size={20} />
                    <span className="text-sm font-medium uppercase">{language}</span>
                </button>
                <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                    <option value="en" className="text-slate-900">English</option>
                    <option value="es" className="text-slate-900">Español</option>
                    <option value="fr" className="text-slate-900">Français</option>
                    <option value="hi" className="text-slate-900">Hindi</option>
                    <option value="zh" className="text-slate-900">Chinese</option>
                </select>
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
              {isLogin ? t('auth.welcome') : t('auth.create')}
            </h2>
            <p className="dark:text-slate-400 text-slate-500">
              {isLogin ? t('auth.signin_desc') : t('auth.signup_desc')}
            </p>
          </div>

          <div className="space-y-4">
            
            {/* Email/Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="space-y-1">
                        <label className="text-sm font-medium dark:text-slate-300 text-slate-700 ml-1">{t('auth.name')}</label>
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
                    <label className="text-sm font-medium dark:text-slate-300 text-slate-700 ml-1">{t('auth.email')}</label>
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
                    <label className="text-sm font-medium dark:text-slate-300 text-slate-700 ml-1">{t('auth.password')}</label>
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
                        <button type="button" className="text-sm font-medium text-indigo-500 hover:text-indigo-400">{t('auth.forgot')}</button>
                    </div>
                )}

                <button 
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : (
                        <>
                            <span>{isLogin ? t('auth.signin_btn') : t('auth.signup_btn')}</span>
                            <ArrowRight size={20} />
                        </>
                    )}
                </button>
            </form>
          </div>

          <div className="text-center">
            <p className="text-sm dark:text-slate-400 text-slate-500">
                {isLogin ? t('auth.no_account') + " " : t('auth.has_account') + " "}
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
