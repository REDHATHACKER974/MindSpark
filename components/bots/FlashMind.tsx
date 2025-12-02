
import React, { useState } from 'react';
import { generateFlashcards } from '../../services/geminiService';
import { FlashcardSet } from '../../types';
import { Layers, ChevronLeft, ChevronRight, RotateCw, Loader2, Sparkles } from 'lucide-react';

const FlashMind: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setFlashcards(null);
    setCurrentIndex(0);
    setIsFlipped(false);
    try {
      const data = await generateFlashcards(topic);
      setFlashcards(data);
    } catch (e) {
      alert("Failed to create flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (!flashcards) return;
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % flashcards.cards.length);
    }, 150);
  };

  const prevCard = () => {
    if (!flashcards) return;
    setIsFlipped(false);
    setTimeout(() => {
        setCurrentIndex((prev) => (prev - 1 + flashcards.cards.length) % flashcards.cards.length);
    }, 150);
  };

  return (
    <div className="flex flex-col h-full dark:bg-slate-900 bg-white rounded-lg border dark:border-slate-700 border-slate-200 shadow-xl overflow-hidden">
      {!flashcards && !loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <Layers className="text-teal-500 mb-6" size={64} />
            <h2 className="text-3xl font-bold dark:text-white text-slate-900 mb-4">FlashMind</h2>
            <p className="dark:text-slate-400 text-slate-500 max-w-lg mb-8">
                Master any subject with AI-generated flashcards. Just enter a topic, and I'll create a study set for active recall.
            </p>
            <div className="w-full max-w-md flex gap-2">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                    placeholder="Enter topic (e.g., Organic Chemistry, French Verbs)"
                    className="flex-1 dark:bg-slate-800 bg-slate-50 border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-teal-500 outline-none"
                />
                <button
                    onClick={handleGenerate}
                    disabled={!topic.trim()}
                    className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                    Create
                </button>
            </div>
        </div>
      ) : loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
            <Loader2 className="animate-spin text-teal-500 mb-4" size={48} />
            <p className="dark:text-white text-slate-900 text-lg">Forging your knowledge cards...</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col p-6 dark:bg-slate-900 bg-slate-50 relative">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="font-bold text-xl dark:text-white text-slate-900">{flashcards?.topic}</h3>
                    <p className="text-sm text-slate-500">Card {currentIndex + 1} of {flashcards?.cards.length}</p>
                </div>
                <button onClick={() => setFlashcards(null)} className="text-sm text-slate-400 hover:text-teal-500">
                    New Set
                </button>
            </div>

            {/* Card Area */}
            <div className="flex-1 flex items-center justify-center perspective-1000">
                <div 
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`relative w-full max-w-2xl aspect-[3/2] cursor-pointer transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                    style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
                >
                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden dark:bg-slate-800 bg-white border-2 dark:border-slate-700 border-slate-200 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center hover:border-teal-500 transition-colors">
                        <span className="text-teal-500 font-bold tracking-widest uppercase text-xs mb-4">Question</span>
                        <h2 className="text-2xl md:text-3xl font-medium dark:text-white text-slate-800 leading-relaxed">
                            {flashcards?.cards[currentIndex].question}
                        </h2>
                        <div className="mt-8 text-slate-400 text-sm flex items-center gap-2">
                            <RotateCw size={14} /> Click to flip
                        </div>
                    </div>

                    {/* Back */}
                    <div 
                        className="absolute inset-0 backface-hidden dark:bg-teal-900/20 bg-teal-50 border-2 border-teal-500 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center"
                        style={{ transform: 'rotateY(180deg)' }}
                    >
                        <span className="text-teal-500 font-bold tracking-widest uppercase text-xs mb-4">Answer</span>
                        <p className="text-xl md:text-2xl dark:text-white text-slate-800 leading-relaxed">
                            {flashcards?.cards[currentIndex].answer}
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-8 flex justify-center items-center gap-8">
                <button 
                    onClick={prevCard}
                    className="p-4 rounded-full dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-lg"
                >
                    <ChevronLeft size={24} className="dark:text-white text-slate-800" />
                </button>
                
                <div className="flex gap-1">
                    {flashcards?.cards.map((_, idx) => (
                        <div 
                            key={idx} 
                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-teal-500' : 'w-2 bg-slate-300 dark:bg-slate-700'}`}
                        />
                    ))}
                </div>

                <button 
                    onClick={nextCard}
                    className="p-4 rounded-full dark:bg-slate-800 bg-white border dark:border-slate-700 border-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-lg"
                >
                    <ChevronRight size={24} className="dark:text-white text-slate-800" />
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default FlashMind;
