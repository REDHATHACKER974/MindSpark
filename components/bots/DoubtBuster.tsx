import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Mic, MicOff } from 'lucide-react';
import { generateTextResponse } from '../../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const DoubtBuster: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hi! I'm DoubtBuster. Stuck on a problem? Send me your query, and I'll break it down step-by-step!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleListening = () => {
    if (isListening) {
        setIsListening(false);
        return;
    }

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Speech recognition is not supported in this browser.");
        return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        setIsListening(true);
    };

    recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(prev => prev + (prev ? ' ' : '') + transcript);
        setIsListening(false);
    };

    recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
    };

    recognition.onend = () => {
        setIsListening(false);
    };

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      // Construct conversation history for context
      const history = messages.map(m => `${m.role === 'user' ? 'Student' : 'Tutor'}: ${m.text}`).join('\n');
      const fullPrompt = `${history}\nStudent: ${userMsg}\nTutor:`;
      
      const response = await generateTextResponse(
        'gemini-2.5-flash',
        fullPrompt,
        "You are DoubtBuster, a friendly and patient AI tutor. Your goal is to explain complex concepts simply, break down problems step-by-step, and encourage the student. Use Markdown for formatting."
      );
      
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm having trouble thinking right now. Try again?" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full dark:bg-slate-900 bg-white rounded-lg overflow-hidden border dark:border-slate-700 border-slate-200 shadow-xl">
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mx-2 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
              </div>
              <div className={`p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600/20 dark:text-blue-100 text-blue-900 border border-blue-600/30' : 'dark:bg-slate-800 bg-slate-100 dark:text-slate-200 text-slate-800 border dark:border-slate-700 border-slate-200'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex items-center space-x-2 dark:bg-slate-800 bg-slate-100 p-3 rounded-lg border dark:border-slate-700 border-slate-200 mx-12">
              <Loader2 className="animate-spin text-green-500" size={16} />
              <span className="text-xs text-slate-400">Thinking...</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 dark:bg-slate-800 bg-white border-t dark:border-slate-700 border-slate-200">
        <div className="flex items-center space-x-2">
            <button
                onClick={toggleListening}
                className={`p-2 rounded-full transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                title="Voice Input"
            >
                {isListening ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : "Ask a question..."}
            className="flex-1 dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoubtBuster;