
import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  BrainCircuit, 
  Zap, 
  Globe, 
  Users, 
  CheckSquare, 
  Sun, 
  Moon,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { translations, Language } from '../utils/translations';

interface LandingPageProps {
  onGetStarted: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, isDarkMode, toggleTheme, language, setLanguage }) => {
  const t = (key: string) => translations[language][key] || translations['en'][key] || key;

  return (
    <div className="min-h-screen w-full dark:bg-slate-950 bg-slate-50 dark:text-slate-200 text-slate-800 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b dark:border-slate-800/60 border-slate-200/60 backdrop-blur-md bg-white/70 dark:bg-slate-950/70">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2 rounded-lg text-white">
                <Sparkles size={24} fill="currentColor" />
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-purple-600">
              {t('app.name')}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Language Dropdown */}
            <div className="relative">
                <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Globe size={20} />
                    <span className="text-sm font-medium uppercase">{language}</span>
                </button>
                <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="hi">Hindi</option>
                    <option value="zh">Chinese</option>
                </select>
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors text-slate-500 dark:text-slate-400"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={onGetStarted}
              className="hidden md:flex bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-all transform hover:scale-105"
            >
              {t('landing.login')}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2"></div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap size={16} fill="currentColor" />
            <span>v2.0 Now Available: Generative Images & Flashcards</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            {t('landing.hero.title')}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            {t('landing.hero.subtitle')}
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <button 
              onClick={onGetStarted}
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-purple-500/20 transition-all transform hover:scale-105 flex items-center justify-center gap-2"
            >
              {t('landing.get_started')}
              <ArrowRight size={20} />
            </button>
            <button className="w-full md:w-auto px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2">
              View Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('landing.features')}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Powerful tools powered by Google Gemini 2.5</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BrainCircuit className="text-purple-500" size={32} />}
              title={t('bot.doubtbuster')}
              description={t('bot.doubtbuster.desc')}
            />
            <FeatureCard 
              icon={<ImageIcon className="text-pink-500" size={32} />}
              title={t('bot.pixelcanvas')}
              description={t('bot.pixelcanvas.desc')}
            />
            <FeatureCard 
              icon={<Layers className="text-teal-500" size={32} />}
              title={t('bot.flashmind')}
              description={t('bot.flashmind.desc')}
            />
            <FeatureCard 
              icon={<Users className="text-indigo-500" size={32} />}
              title={t('nav.groups')}
              description="Don't study alone. Join grade-specific groups, chat with peers, and collaborate on a real-time whiteboard."
            />
            <FeatureCard 
              icon={<CheckSquare className="text-emerald-500" size={32} />}
              title={t('nav.tasks')}
              description="Stay on top of assignments with a category-based task manager featuring a built-in Pomodoro focus timer."
            />
            <FeatureCard 
              icon={<Globe className="text-cyan-500" size={32} />}
              title="TransBot"
              description="Break language barriers. Real-time translation helps you access resources in any language."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 to-purple-900 opacity-90 dark:opacity-50"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to transform your learning?</h2>
          <p className="text-indigo-100 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of students who are learning smarter, not harder, with the power of MindSpark.
          </p>
          <button 
            onClick={onGetStarted}
            className="px-10 py-5 bg-white text-indigo-900 rounded-2xl font-bold text-xl hover:bg-indigo-50 transition-all transform hover:scale-105 shadow-2xl"
          >
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t dark:border-slate-800 border-slate-200 dark:bg-slate-950 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-500" size={20} />
            <span className="font-bold text-lg dark:text-white text-slate-900">{t('app.name')}</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <a href="#" className="hover:text-purple-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-purple-500 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-purple-500 transition-colors">Contact</a>
          </div>
          <p className="text-sm text-slate-500">© 2024 MindSpark AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
  <div className="p-8 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-500/50 dark:hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/5 group cursor-default">
    <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 w-fit group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3 dark:text-white text-slate-900">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
      {description}
    </p>
  </div>
);
