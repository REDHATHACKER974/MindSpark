import React, { useState } from 'react';
import { generateSpeech } from '../../services/geminiService';
import { Mic, Play, Pause, Square, Volume2 } from 'lucide-react';

const EchoVoice: React.FC = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    stopAudio(); // Stop any current playback

    try {
      const buffer = await generateSpeech(text);
      playAudio(buffer);
    } catch (e) {
      console.error(e);
      alert("Failed to generate speech.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (buffer: AudioBuffer) => {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    source.onended = () => setIsPlaying(false);
    
    source.start(0);
    setAudioContext(ctx);
    setSourceNode(source);
    setIsPlaying(true);
  };

  const stopAudio = () => {
    if (sourceNode) {
      try {
        sourceNode.stop();
      } catch (e) {
        // Ignore errors if already stopped
      }
      setSourceNode(null);
    }
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
    setIsPlaying(false);
  };

  return (
    <div className="flex flex-col h-full dark:bg-slate-900 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-6 shadow-xl">
      <div className="flex items-center space-x-4 mb-6">
        <div className="p-3 bg-pink-600/20 rounded-lg">
            <Mic className="text-pink-500" size={32} />
        </div>
        <div>
            <h2 className="text-2xl font-bold dark:text-white text-slate-900">EchoVoice</h2>
            <p className="dark:text-slate-400 text-slate-500 text-sm">Transform text into natural-sounding speech</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter the text you want to hear..."
          className="flex-1 w-full dark:bg-slate-800 bg-slate-50 border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 rounded-xl p-4 resize-none focus:outline-none focus:ring-2 focus:ring-pink-500 text-lg leading-relaxed"
        />
        
        <div className="h-24 dark:bg-slate-800 bg-slate-50 rounded-xl border dark:border-slate-700 border-slate-300 flex items-center justify-center relative overflow-hidden">
            {/* Visualizer bars simulation */}
            {isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center space-x-1 opacity-50">
                    {[...Array(20)].map((_, i) => (
                        <div 
                            key={i} 
                            className="w-2 bg-pink-500 rounded-full animate-pulse"
                            style={{ 
                                height: `${Math.random() * 80 + 20}%`,
                                animationDuration: `${Math.random() * 0.5 + 0.2}s`
                            }} 
                        />
                    ))}
                </div>
            )}
            
            <div className="z-10 flex space-x-6">
                 {!isPlaying ? (
                    <button 
                        onClick={handleGenerate}
                        disabled={loading || !text.trim()}
                        className="bg-pink-600 hover:bg-pink-700 text-white w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg shadow-pink-600/20 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Play fill="currentColor" className="ml-1" size={24} />
                        )}
                    </button>
                 ) : (
                    <button 
                        onClick={stopAudio}
                        className="dark:bg-slate-700 bg-slate-300 hover:bg-slate-600 dark:hover:bg-slate-600 text-white dark:text-white text-slate-800 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg"
                    >
                        <Square fill="currentColor" size={20} />
                    </button>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default EchoVoice;