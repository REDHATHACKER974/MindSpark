
import React, { useState, useEffect } from 'react';
import { 
  Home,
  BrainCircuit, 
  MessagesSquare, 
  BarChart2, 
  Mic, 
  Languages, 
  FileText, 
  LayoutDashboard, 
  LayoutGrid,
  Users, 
  CheckSquare, 
  LogOut,
  Sparkles,
  ArrowRight,
  Sun,
  Moon,
  Mail,
  Phone,
  MapPin,
  FileSearch,
  Trophy,
  Zap,
  Image as ImageIcon,
  Layers
} from 'lucide-react';
import { BotType, UserStats } from './types';
import { BotCard } from './components/BotCard';

// Bots
import DoubtBuster from './components/bots/DoubtBuster';
import QuizAce from './components/bots/QuizAce';
import GraphGenie from './components/bots/GraphGenie';
import EchoVoice from './components/bots/EchoVoice';
import TransBot from './components/bots/TransBot';
import ReportGenerator from './components/bots/ReportGenerator';
import DocuMind from './components/bots/DocuMind';
import PixelCanvas from './components/bots/PixelCanvas';
import FlashMind from './components/bots/FlashMind';

// Features
import StudyNexus from './components/StudyNexus';
import TaskMaster from './components/TaskMaster';

enum View {
  Home = 'home',
  BotsList = 'bots-list',
  BotActive = 'bot-active',
  StudyNexus = 'study-nexus',
  TaskMaster = 'task-master',
  ContactUs = 'contact-us',
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.Home);
  const [activeBot, setActiveBot] = useState<BotType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Gamification State
  const [userStats, setUserStats] = useState<UserStats>({
    xp: 350,
    level: 3,
    badges: ['Novice Learner']
  });
  const [xpNotification, setXpNotification] = useState<string | null>(null);

  // Toggle dark mode class on html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Gamification Logic
  const handleReward = (amount: number, message: string) => {
    setUserStats(prev => {
        const newXp = prev.xp + amount;
        const newLevel = Math.floor(newXp / 100) + 1; // Simple level formula: 1 level every 100 XP
        
        if (newLevel > prev.level) {
             setXpNotification(`Level Up! You are now Level ${newLevel}`);
        } else {
             setXpNotification(message);
        }

        return { ...prev, xp: newXp, level: newLevel };
    });

    // Clear notification after 3 seconds
    setTimeout(() => setXpNotification(null), 3000);
  };

  const renderBot = () => {
    switch (activeBot) {
      case BotType.DoubtBuster: return <DoubtBuster />;
      case BotType.QuizAce: return <QuizAce onReward={handleReward} />;
      case BotType.GraphGenie: return <GraphGenie />;
      case BotType.EchoVoice: return <EchoVoice />;
      case BotType.TransBot: return <TransBot />;
      case BotType.ReportGenerator: return <ReportGenerator />;
      case BotType.DocuMind: return <DocuMind />;
      case BotType.PixelCanvas: return <PixelCanvas />;
      case BotType.FlashMind: return <FlashMind />;
      default: return null;
    }
  };

  const renderHome = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-900/90 to-purple-900/90 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-3xl p-8 md:p-12 border border-indigo-500/20 relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">MindSpark</span>
          </h1>
          <p className="text-lg text-indigo-100 max-w-xl mb-8 leading-relaxed">
            Your personal AI-powered learning hub. Boost your productivity, collaborate with peers, and master new subjects with advanced AI tools.
          </p>
          <button 
            onClick={() => setCurrentView(View.BotsList)}
            className="group bg-white text-indigo-900 px-8 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Explore AI Tools
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <Sparkles className="absolute top-0 right-0 text-white/10 dark:text-white/5 w-96 h-96 -translate-y-1/4 translate-x-1/4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Quick Task Access */}
        <div 
          onClick={() => setCurrentView(View.TaskMaster)}
          className="dark:bg-slate-800 bg-white p-6 rounded-2xl border dark:border-slate-700 border-slate-200 hover:border-emerald-500/50 cursor-pointer transition-all group hover:shadow-lg hover:shadow-emerald-500/10"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
              <CheckSquare className="text-emerald-500" size={24} />
            </div>
          </div>
          <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">My Tasks</h3>
          <p className="dark:text-slate-400 text-slate-500 text-sm">Stay organized. Check your pending assignments and deadlines.</p>
        </div>

        {/* Quick Study Group Access */}
        <div 
          onClick={() => setCurrentView(View.StudyNexus)}
          className="dark:bg-slate-800 bg-white p-6 rounded-2xl border dark:border-slate-700 border-slate-200 hover:border-indigo-500/50 cursor-pointer transition-all group hover:shadow-lg hover:shadow-indigo-500/10"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
              <Users className="text-indigo-500" size={24} />
            </div>
          </div>
          <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">Study Groups</h3>
          <p className="dark:text-slate-400 text-slate-500 text-sm">Connect with peers. Join the discussion in your class group.</p>
        </div>

        {/* Featured Bot */}
        <div 
          onClick={() => { setActiveBot(BotType.DoubtBuster); setCurrentView(View.BotActive); }}
          className="dark:bg-slate-800 bg-white p-6 rounded-2xl border dark:border-slate-700 border-slate-200 hover:border-cyan-500/50 cursor-pointer transition-all group hover:shadow-lg hover:shadow-cyan-500/10"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
              <Sparkles className="text-cyan-500" size={24} />
            </div>
            <span className="bg-cyan-500/10 text-cyan-500 text-xs font-bold px-2 py-1 rounded-full border border-cyan-500/20">Featured</span>
          </div>
          <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">DoubtBuster</h3>
          <p className="dark:text-slate-400 text-slate-500 text-sm">Need help? Ask our AI tutor for instant, detailed explanations.</p>
        </div>
      </div>
    </div>
  );

  const renderBotsList = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-slate-900 mb-2 flex items-center gap-3">
             <BrainCircuit className="text-purple-500" />
             AI Tools Directory
          </h1>
          <p className="dark:text-slate-400 text-slate-500 max-w-2xl">
            Select a specialized AI agent to supercharge your learning and productivity.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BotCard 
          id={BotType.DoubtBuster}
          title="DoubtBuster"
          description="Your friendly AI tutor. Ask detailed questions and get step-by-step explanations."
          icon={MessagesSquare}
          color="green"
          onClick={() => { setActiveBot(BotType.DoubtBuster); setCurrentView(View.BotActive); }}
        />
        <BotCard 
          id={BotType.DocuMind}
          title="DocuMind"
          description="Upload PDFs or images and ask the AI to analyze content or summarize findings."
          icon={FileSearch}
          color="blue"
          onClick={() => { setActiveBot(BotType.DocuMind); setCurrentView(View.BotActive); }}
        />
        <BotCard 
          id={BotType.PixelCanvas}
          title="PixelCanvas"
          description="Generate educational diagrams, historical scenes, or scientific illustrations."
          icon={ImageIcon}
          color="pink"
          onClick={() => { setActiveBot(BotType.PixelCanvas); setCurrentView(View.BotActive); }}
        />
        <BotCard 
          id={BotType.FlashMind}
          title="FlashMind"
          description="Create AI-powered flashcard sets for active recall on any study topic."
          icon={Layers}
          color="teal"
          onClick={() => { setActiveBot(BotType.FlashMind); setCurrentView(View.BotActive); }}
        />
        <BotCard 
          id={BotType.QuizAce}
          title="QuizAce"
          description="Test your knowledge with AI-generated interactive quizzes on any topic."
          icon={BrainCircuit}
          color="purple"
          onClick={() => { setActiveBot(BotType.QuizAce); setCurrentView(View.BotActive); }}
        />
        <BotCard 
          id={BotType.GraphGenie}
          title="GraphGenie"
          description="Visualize complex data instantly. Turn text descriptions into stunning charts."
          icon={BarChart2}
          color="orange"
          onClick={() => { setActiveBot(BotType.GraphGenie); setCurrentView(View.BotActive); }}
        />
        <BotCard 
          id={BotType.EchoVoice}
          title="EchoVoice"
          description="Convert text into natural-sounding speech for accessibility or learning."
          icon={Mic}
          color="red"
          onClick={() => { setActiveBot(BotType.EchoVoice); setCurrentView(View.BotActive); }}
        />
        <BotCard 
          id={BotType.TransBot}
          title="TransBot"
          description="Break language barriers with real-time, accurate translation."
          icon={Languages}
          color="cyan"
          onClick={() => { setActiveBot(BotType.TransBot); setCurrentView(View.BotActive); }}
        />
        <BotCard 
          id={BotType.ReportGenerator}
          title="Report Generator"
          description="Generate study guides, assessments, and detailed reports for any grade."
          icon={FileText}
          color="yellow"
          onClick={() => { setActiveBot(BotType.ReportGenerator); setCurrentView(View.BotActive); }}
        />
      </div>
    </div>
  );

  const renderContactUs = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl font-bold dark:text-white text-slate-900 mb-4">Get in Touch</h1>
        <p className="dark:text-slate-400 text-slate-500 text-lg">
          Have questions about MindSpark? We're here to help. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="lg:col-span-1 space-y-6">
            <div className="dark:bg-slate-800 bg-white p-6 rounded-2xl border dark:border-slate-700 border-slate-200 shadow-sm">
                <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-6">Contact Information</h3>
                
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                            <Mail size={24} />
                        </div>
                        <div>
                            <p className="font-medium dark:text-slate-200 text-slate-800">Email</p>
                            <p className="text-sm dark:text-slate-400 text-slate-500">support@mindspark.ai</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-lg text-purple-500">
                            <Phone size={24} />
                        </div>
                        <div>
                            <p className="font-medium dark:text-slate-200 text-slate-800">Phone</p>
                            <p className="text-sm dark:text-slate-400 text-slate-500">+1 (555) 123-4567</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-500">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p className="font-medium dark:text-slate-200 text-slate-800">Office</p>
                            <p className="text-sm dark:text-slate-400 text-slate-500">
                                123 Innovation Drive<br/>
                                Tech Valley, CA 94043
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
            <div className="dark:bg-slate-800 bg-white p-8 rounded-2xl border dark:border-slate-700 border-slate-200 shadow-sm">
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300 text-slate-700">First Name</label>
                            <input type="text" className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-lg px-4 py-3 dark:text-white text-slate-900 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium dark:text-slate-300 text-slate-700">Last Name</label>
                            <input type="text" className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-lg px-4 py-3 dark:text-white text-slate-900 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="Doe" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-slate-300 text-slate-700">Email Address</label>
                        <input type="email" className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-lg px-4 py-3 dark:text-white text-slate-900 focus:ring-2 focus:ring-cyan-500 outline-none transition-all" placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium dark:text-slate-300 text-slate-700">Message</label>
                        <textarea rows={4} className="w-full dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 rounded-lg px-4 py-3 dark:text-white text-slate-900 focus:ring-2 focus:ring-cyan-500 outline-none transition-all resize-none" placeholder="How can we help you?"></textarea>
                    </div>

                    <button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg">
                        Send Message
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full dark:bg-slate-950 bg-slate-50 dark:text-slate-200 text-slate-800 font-sans overflow-hidden selection:bg-cyan-500/30">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 flex-shrink-0 dark:bg-slate-900 bg-white border-r dark:border-slate-800 border-slate-200 flex flex-col transition-all duration-300">
        <div className="p-6 flex items-center gap-3 justify-center md:justify-start border-b dark:border-slate-800 border-slate-200">
          <Sparkles className="text-cyan-400 w-8 h-8" />
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 hidden md:block">MindSpark</span>
        </div>
        
        {/* User Stats / Gamification */}
        <div className="p-4 border-b dark:border-slate-800 border-slate-200 hidden md:block">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-xl p-3">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400">Profile</span>
                    <span className="text-xs font-bold text-yellow-500 flex items-center gap-1"><Trophy size={12}/> Level {userStats.level}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                    <div 
                        className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${(userStats.xp % 100)}%` }}
                    ></div>
                </div>
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{userStats.xp} XP</span>
                    <span>Next: {(Math.floor(userStats.xp/100) + 1) * 100} XP</span>
                </div>
            </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => { setCurrentView(View.Home); setActiveBot(null); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${currentView === View.Home ? 'bg-cyan-600/10 text-cyan-600 dark:bg-cyan-600/20 dark:text-cyan-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            <Home size={22} />
            <span className="hidden md:block font-medium">Home</span>
          </button>

          <button 
            onClick={() => { setCurrentView(View.BotsList); setActiveBot(null); }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${currentView === View.BotsList || currentView === View.BotActive ? 'bg-purple-600/10 text-purple-600 dark:bg-purple-600/20 dark:text-purple-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            <LayoutGrid size={22} />
            <span className="hidden md:block font-medium">AI Tools</span>
          </button>
          
          <button 
            onClick={() => setCurrentView(View.StudyNexus)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${currentView === View.StudyNexus ? 'bg-indigo-600/10 text-indigo-600 dark:bg-indigo-600/20 dark:text-indigo-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            <Users size={22} />
            <span className="hidden md:block font-medium">StudyNexus</span>
          </button>

          <button 
            onClick={() => setCurrentView(View.TaskMaster)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${currentView === View.TaskMaster ? 'bg-emerald-600/10 text-emerald-600 dark:bg-emerald-600/20 dark:text-emerald-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            <CheckSquare size={22} />
            <span className="hidden md:block font-medium">Task Master</span>
          </button>

          <button 
            onClick={() => setCurrentView(View.ContactUs)}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${currentView === View.ContactUs ? 'bg-blue-600/10 text-blue-600 dark:bg-blue-600/20 dark:text-blue-400' : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            <Mail size={22} />
            <span className="hidden md:block font-medium">Contact Us</span>
          </button>
        </nav>

        <div className="p-4 border-t dark:border-slate-800 border-slate-200 space-y-2">
            <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer transition-colors"
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span className="hidden md:block font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
            <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-pointer transition-colors">
                <LogOut size={20} />
                <span className="hidden md:block font-medium">Log Out</span>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {/* XP Notification */}
        {xpNotification && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="bg-yellow-500 text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                    <Zap fill="currentColor" size={18} />
                    {xpNotification}
                </div>
            </div>
        )}

        <div className="absolute inset-0 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full flex flex-col">
            
            {currentView === View.Home && renderHome()}

            {currentView === View.BotsList && renderBotsList()}

            {currentView === View.ContactUs && renderContactUs()}
            
            {currentView === View.BotActive && (
              <div className="h-full flex flex-col">
                <button 
                  onClick={() => { setActiveBot(null); setCurrentView(View.BotsList); }}
                  className="self-start mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors group"
                >
                    <div className="dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 p-2 rounded-lg group-hover:bg-slate-100 dark:group-hover:bg-slate-700 transition-colors">
                        <LayoutGrid size={16} />
                    </div>
                    <span className="font-medium">Back to Tools</span>
                </button>
                <div className="flex-1 min-h-0 animate-in fade-in slide-in-from-bottom-2">
                  {renderBot()}
                </div>
              </div>
            )}

            {currentView === View.StudyNexus && <StudyNexus />}
            
            {currentView === View.TaskMaster && <TaskMaster onReward={handleReward} />}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
