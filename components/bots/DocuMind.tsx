import React, { useState, useRef } from 'react';
import { Send, UploadCloud, FileText, X, Bot, User, Loader2 } from 'lucide-react';
import { generateDocumentChat } from '../../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const DocuMind: React.FC = () => {
  const [file, setFile] = useState<{name: string, data: string, type: string} | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Hello! I'm DocuMind. Upload a PDF or image, and I can analyze it or answer questions about its content." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
            const base64String = (event.target.result as string).split(',')[1];
            setFile({
                name: selectedFile.name,
                type: selectedFile.type,
                data: base64String
            });
            setMessages(prev => [...prev, { role: 'model', text: `I've received "${selectedFile.name}". What would you like to know about it?` }]);
        }
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      if (file) {
        // Send file context with query
        const response = await generateDocumentChat(userMsg, file.data, file.type);
        setMessages(prev => [...prev, { role: 'model', text: response || "I couldn't analyze that. Please try again." }]);
      } else {
        setMessages(prev => [...prev, { role: 'model', text: "Please upload a document first so I can help you analyze it." }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I encountered an error analyzing the document." }]);
    } finally {
      setLoading(false);
      // Scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  return (
    <div className="flex flex-col h-full dark:bg-slate-900 bg-white rounded-lg overflow-hidden border dark:border-slate-700 border-slate-200 shadow-xl">
      {/* Header / File Status */}
      <div className="p-4 border-b dark:border-slate-700 border-slate-200 dark:bg-slate-800 bg-slate-50 flex justify-between items-center">
        <h2 className="font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <FileText className="text-blue-500" />
            DocuMind
        </h2>
        {file ? (
            <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm">
                <span className="truncate max-w-[150px]">{file.name}</span>
                <button onClick={() => setFile(null)} className="hover:text-blue-900 dark:hover:text-blue-100"><X size={14} /></button>
            </div>
        ) : (
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="text-sm flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
                <UploadCloud size={16} /> Upload PDF
            </button>
        )}
        <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".pdf,image/png,image/jpeg,image/webp"
            className="hidden" 
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mx-2 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-600'}`}>
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
              <Loader2 className="animate-spin text-blue-500" size={16} />
              <span className="text-xs text-slate-400">Analyzing document...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 dark:bg-slate-800 bg-white border-t dark:border-slate-700 border-slate-200">
        <div className="flex items-center space-x-2">
          {!file && (
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-400 hover:text-blue-500 transition-colors"
                title="Upload Document"
             >
                <UploadCloud size={24} />
             </button>
          )}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={file ? "Ask about the document..." : "Upload a file to get started..."}
            disabled={!file}
            className="flex-1 dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim() || !file}
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocuMind;