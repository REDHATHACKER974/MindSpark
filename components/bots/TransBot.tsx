import React, { useState } from 'react';
import { generateTextResponse } from '../../services/geminiService';
import { Languages, ArrowRightLeft, Copy, Check } from 'lucide-react';

const TransBot: React.FC = () => {
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('Spanish');
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setCopied(false);
    try {
      const response = await generateTextResponse(
        'gemini-2.5-flash',
        `Translate the following text to ${targetLang}. Only provide the translation, no introductory text.\n\nText: "${text}"`,
        "You are an expert translator. Provide accurate, natural-sounding translations."
      );
      setTranslatedText(response || "Translation failed.");
    } catch (e) {
      setTranslatedText("Error occurred during translation.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full dark:bg-slate-900 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-6 shadow-xl">
      <div className="flex items-center space-x-3 mb-6">
        <Languages className="text-cyan-500" size={28} />
        <h2 className="text-2xl font-bold dark:text-white text-slate-900">TransBot</h2>
      </div>

      <div className="flex-1 grid grid-rows-2 gap-4">
        {/* Input Section */}
        <div className="dark:bg-slate-800 bg-slate-50 rounded-xl p-4 flex flex-col border dark:border-slate-700 border-slate-300 focus-within:ring-2 focus-within:ring-cyan-500/50 transition-all">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium dark:text-slate-400 text-slate-500 uppercase tracking-wide">English (Detected)</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type text to translate..."
            className="flex-1 bg-transparent dark:text-white text-slate-900 resize-none outline-none text-lg"
          />
        </div>

        {/* Output Section */}
        <div className="dark:bg-slate-800 bg-slate-50 rounded-xl p-4 flex flex-col border dark:border-slate-700 border-slate-300 relative">
           <div className="flex justify-between items-center mb-2">
            <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="dark:bg-slate-900 bg-white text-cyan-600 dark:text-cyan-400 border dark:border-slate-700 border-slate-300 rounded-md px-2 py-1 text-sm font-medium uppercase outline-none focus:border-cyan-500"
            >
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Chinese (Simplified)">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Hindi">Hindi</option>
                <option value="Arabic">Arabic</option>
                <option value="Russian">Russian</option>
                <option value="Portuguese">Portuguese</option>
            </select>
            {translatedText && (
                <button onClick={copyToClipboard} className="text-slate-400 hover:text-white dark:hover:text-white transition-colors">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
            )}
          </div>
          
          <div className="flex-1 relative">
             {loading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-pulse flex space-x-2">
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
             ) : (
                <p className="text-lg dark:text-white text-slate-900 whitespace-pre-wrap">{translatedText}</p>
             )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
            onClick={handleTranslate}
            disabled={loading || !text.trim()}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-3 rounded-xl font-bold flex items-center space-x-2 transition-all shadow-lg shadow-cyan-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <span>Translate</span>
            <ArrowRightLeft size={20} />
        </button>
      </div>
    </div>
  );
};

export default TransBot;