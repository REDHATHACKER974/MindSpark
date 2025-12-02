import React, { useState } from 'react';
import { generateTextResponse } from '../../services/geminiService';
import { FileText, Send, BookOpen } from 'lucide-react';

const ReportGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('Grade 10');
  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setReport('');
    
    try {
        const prompt = `Generate a comprehensive study report and knowledge assessment for a student in ${grade} about the topic: "${topic}". 
        
        The report should include:
        1. Key Concepts Review (Bulleted list)
        2. Common Misconceptions
        3. 3-5 Practice Questions (with answers hidden or at the end)
        4. Study Recommendations (Resources, methods)
        
        Format the response in clean Markdown.`;

      const response = await generateTextResponse(
        'gemini-2.5-flash',
        prompt,
        "You are an academic mentor. Provide structured, educational, and encouraging content."
      );
      setReport(response || "Failed to generate report.");
    } catch (e) {
      setReport("Error generating report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full dark:bg-slate-900 bg-white rounded-lg border dark:border-slate-700 border-slate-200 overflow-hidden shadow-xl">
      {!report && !loading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <BookOpen className="text-yellow-500 mb-6" size={64} />
            <h2 className="text-3xl font-bold dark:text-white text-slate-900 mb-4">AI Report Generator</h2>
            <p className="dark:text-slate-400 text-slate-500 max-w-lg mb-8">
                Assess your knowledge and prepare for tests. I'll generate a customized study guide, questions, and feedback based on your topic and grade level.
            </p>
            <div className="w-full max-w-md space-y-4">
                <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter topic (e.g., Thermodynamics, The Great Gatsby)"
                    className="w-full dark:bg-slate-800 bg-slate-50 border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none"
                />
                <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full dark:bg-slate-800 bg-slate-50 border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 outline-none"
                >
                    {[6,7,8,9,10,11,12].map(g => <option key={g} value={`Grade ${g}`}>Grade {g}</option>)}
                    <option value="College">College</option>
                </select>
                <button
                    onClick={handleGenerate}
                    disabled={!topic.trim()}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                    <FileText size={20} />
                    <span>Generate Report</span>
                </button>
            </div>
        </div>
      ) : (
        <>
            <div className="dark:bg-slate-800 bg-white p-4 border-b dark:border-slate-700 border-slate-200 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <FileText className="text-yellow-500" size={20} />
                    <h3 className="font-bold dark:text-white text-slate-900 truncate max-w-xs">Report: {topic}</h3>
                </div>
                <button 
                    onClick={() => setReport('')}
                    className="text-sm text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white underline"
                >
                    New Report
                </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 dark:bg-slate-900 bg-slate-50">
                {loading ? (
                    <div className="space-y-4 animate-pulse max-w-2xl mx-auto mt-10">
                        <div className="h-8 dark:bg-slate-800 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-4 dark:bg-slate-800 bg-slate-200 rounded w-full"></div>
                        <div className="h-4 dark:bg-slate-800 bg-slate-200 rounded w-5/6"></div>
                        <div className="h-4 dark:bg-slate-800 bg-slate-200 rounded w-4/5"></div>
                        <div className="h-32 dark:bg-slate-800 bg-slate-200 rounded w-full mt-8"></div>
                    </div>
                ) : (
                    <div className="prose dark:prose-invert prose-slate max-w-none prose-headings:text-slate-900 dark:prose-headings:text-yellow-400 prose-a:text-yellow-600 dark:prose-a:text-yellow-400">
                        <div className="whitespace-pre-wrap">{report}</div>
                    </div>
                )}
            </div>
        </>
      )}
    </div>
  );
};

export default ReportGenerator;