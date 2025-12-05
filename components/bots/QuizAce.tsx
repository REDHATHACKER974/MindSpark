
import React, { useState } from 'react';
import { generateQuiz } from '../../services/geminiService';
import { Quiz, GamificationProps } from '../../types';
import { CheckCircle, XCircle, BrainCircuit, RefreshCw, ChevronRight } from 'lucide-react';

const QuizAce: React.FC<GamificationProps> = ({ onReward }) => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleCreateQuiz = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setQuiz(null);
    setScore(0);
    setCurrentQuestion(0);
    setQuizFinished(false);
    
    try {
      const newQuiz = await generateQuiz(topic, difficulty);
      setQuiz(newQuiz);
    } catch (e) {
      alert("Failed to generate quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return; // Prevent changing answer
    setSelectedOption(index);
    setShowExplanation(true);
    if (index === quiz?.questions[currentQuestion].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (!quiz) return;
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
      // Gamification: Reward XP
      const finalScore = score + (selectedOption === quiz.questions[currentQuestion].correctAnswerIndex ? 0 : 0); // score already updated
      const percentage = (score / quiz.questions.length) * 100;
      let xp = 20; // Base XP for finishing
      if (percentage >= 80) xp += 30; // Bonus for good score
      else if (percentage >= 50) xp += 10;
      
      onReward(xp, `Quiz Completed! +${xp} XP`);
    }
  };

  if (!quiz && !loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center dark:bg-slate-900 bg-white rounded-lg border dark:border-slate-700 border-slate-200 shadow-xl">
        <BrainCircuit size={64} className="text-purple-500 mb-6" />
        <h2 className="text-3xl font-bold dark:text-white text-slate-900 mb-4">QuizAce</h2>
        <p className="dark:text-slate-400 text-slate-500 mb-8 max-w-md">Enter a topic and I'll generate a custom quiz to test your knowledge.</p>
        
        <div className="w-full max-w-md space-y-4">
          <input
            type="text"
            placeholder="E.g., Photosynthesis, World War II, Calculus"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full dark:bg-slate-800 bg-slate-50 border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none"
          />
          <select 
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full dark:bg-slate-800 bg-slate-50 border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 outline-none"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <button 
            onClick={handleCreateQuiz}
            disabled={!topic.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            Generate Quiz
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full dark:bg-slate-900 bg-white rounded-lg border dark:border-slate-700 border-slate-200">
        <RefreshCw className="animate-spin text-purple-500 mb-4" size={48} />
        <p className="text-xl dark:text-white text-slate-900">Crafting your quiz...</p>
      </div>
    );
  }

  if (quizFinished) {
    return (
      <div className="flex flex-col items-center justify-center h-full dark:bg-slate-900 bg-white rounded-lg border dark:border-slate-700 border-slate-200 p-8">
        <h2 className="text-3xl font-bold dark:text-white text-slate-900 mb-2">Quiz Completed!</h2>
        <p className="dark:text-slate-400 text-slate-500 mb-8">You scored {score} out of {quiz?.questions?.length || 0}</p>
        <div className="text-6xl font-bold text-purple-500 mb-8">
          {Math.round((score / (quiz?.questions?.length || 1)) * 100)}%
        </div>
        <button 
          onClick={() => { setQuiz(null); setQuizFinished(false); }}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Create New Quiz
        </button>
      </div>
    );
  }

  const question = quiz?.questions[currentQuestion];

  return (
    <div className="h-full flex flex-col dark:bg-slate-900 bg-white rounded-lg border dark:border-slate-700 border-slate-200 overflow-hidden shadow-xl">
      <div className="dark:bg-slate-800 bg-slate-100 p-4 border-b dark:border-slate-700 border-slate-200 flex justify-between items-center">
        <h3 className="font-bold dark:text-white text-slate-900">{quiz?.title}</h3>
        <span className="text-sm text-slate-500">Question {currentQuestion + 1} / {quiz?.questions.length}</span>
      </div>
      
      <div className="flex-1 p-8 overflow-y-auto">
        <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-8">{question?.question}</h2>
        
        <div className="space-y-4">
          {question?.options.map((option, idx) => {
            let className = "w-full text-left p-4 rounded-lg border transition-all duration-200 flex items-center justify-between ";
            if (selectedOption === null) {
              className += "dark:bg-slate-800 bg-slate-50 dark:border-slate-700 border-slate-200 hover:border-purple-500 hover:bg-slate-100 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200";
            } else if (idx === question.correctAnswerIndex) {
              className += "bg-green-900/30 border-green-500 text-green-600 dark:text-green-400";
            } else if (idx === selectedOption) {
              className += "bg-red-900/30 border-red-500 text-red-600 dark:text-red-400";
            } else {
              className += "dark:bg-slate-800 bg-slate-50 dark:border-slate-700 border-slate-200 opacity-50 dark:text-slate-400 text-slate-400";
            }

            return (
              <button 
                key={idx}
                onClick={() => handleOptionClick(idx)}
                disabled={selectedOption !== null}
                className={className}
              >
                <span>{option}</span>
                {selectedOption !== null && idx === question.correctAnswerIndex && <CheckCircle size={20} />}
                {selectedOption !== null && idx === selectedOption && idx !== question.correctAnswerIndex && <XCircle size={20} />}
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className="mt-8 p-4 bg-purple-100 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-500/30 rounded-lg animate-in fade-in slide-in-from-bottom-4">
            <h4 className="font-bold text-purple-600 dark:text-purple-400 mb-2">Explanation:</h4>
            <p className="text-slate-800 dark:text-slate-200">{question?.explanation}</p>
            <div className="mt-4 flex justify-end">
                <button 
                    onClick={nextQuestion}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                    <span>{currentQuestion < (quiz?.questions.length || 0) - 1 ? "Next Question" : "Finish Quiz"}</span>
                    <ChevronRight size={16} />
                </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizAce;
