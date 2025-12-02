
import React, { useState, useRef, useEffect } from 'react';
import { Users, MessageSquare, Send, PenTool, Eraser, Trash2 } from 'lucide-react';
import { StudyGroup } from '../types';

const MOCK_GROUPS: StudyGroup[] = [
  { id: '1', grade: 'Class 6', name: 'Science Explorers', topic: 'General Science', members: 24 },
  { id: '2', grade: 'Class 7', name: 'Math Wizards', topic: 'Algebra Basics', members: 18 },
  { id: '3', grade: 'Class 8', name: 'History Buffs', topic: 'World History', members: 32 },
  { id: '4', grade: 'Class 9', name: 'Physics Phenoms', topic: 'Motion & Force', members: 45 },
  { id: '5', grade: 'Class 10', name: 'Bio Builders', topic: 'Life Processes', members: 56 },
  { id: '6', grade: 'Class 11', name: 'Chem Crew', topic: 'Organic Chemistry', members: 28 },
  { id: '7', grade: 'Class 12', name: 'Calculus Club', topic: 'Integration', members: 41 },
];

interface ChatMessage {
  user: string;
  text: string;
  time: string;
}

// Initial Mock Chats per Group ID
const INITIAL_CHATS: Record<string, ChatMessage[]> = {
  '1': [
    { user: 'Alex', text: 'Does anyone have a diagram for the water cycle?', time: '09:30 AM' },
    { user: 'Sam', text: 'I just uploaded one to the shared folder!', time: '09:35 AM' },
  ],
  '2': [
    { user: 'Sarah', text: 'Stuck on question 5 of the Algebra sheet.', time: '10:00 AM' },
    { user: 'Mike', text: 'Remember to isolate x first.', time: '10:02 AM' },
  ],
  '3': [
    { user: 'Teacher', text: 'Don\'t forget the timeline project is due Friday.', time: '08:00 AM' },
  ],
  '7': [
    { user: 'Dave', text: 'Integration by parts is killing me.', time: '11:15 PM' },
    { user: 'Bot', text: 'Hang in there! Try checking the DoubtBuster.', time: '11:16 PM' },
  ]
};

const StudyNexus: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup | null>(null);
  const [activeTab, setActiveTab] = useState<'chat' | 'board'>('chat');
  
  // Data Storage (Per Group)
  const [groupChats, setGroupChats] = useState<Record<string, ChatMessage[]>>(INITIAL_CHATS);
  const [groupDrawings, setGroupDrawings] = useState<Record<string, string>>({}); // Stores dataURL per group ID
  
  // Local UI State
  const [messageInput, setMessageInput] = useState('');
  
  // Canvas State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#4f46e5');

  // --- Chat Logic ---
  const currentMessages = selectedGroup ? (groupChats[selectedGroup.id] || []) : [];

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedGroup) return;
    
    const newMessage: ChatMessage = { 
      user: 'You', 
      text: messageInput, 
      time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    };

    setGroupChats(prev => ({
      ...prev,
      [selectedGroup.id]: [...(prev[selectedGroup.id] || []), newMessage]
    }));
    
    setMessageInput('');
  };

  // --- Canvas Logic ---

  // Load canvas data when switching groups or tabs
  useEffect(() => {
    if (selectedGroup && activeTab === 'board' && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Reset canvas settings
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = tool === 'eraser' ? 20 : 3;
        ctx.strokeStyle = color;

        // Clear existing content
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Load saved drawing if exists
        const savedData = groupDrawings[selectedGroup.id];
        if (savedData) {
            const img = new Image();
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
            img.src = savedData;
        }
    }
  }, [activeTab, selectedGroup, groupDrawings]); // Re-run if group changes

  // Update context properties when tool/color changes
  useEffect(() => {
    if (activeTab === 'board' && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            ctx.strokeStyle = color;
            ctx.lineWidth = tool === 'eraser' ? 20 : 3;
        }
    }
  }, [color, tool, activeTab]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
    } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Save state
    if (selectedGroup && canvasRef.current) {
        const dataURL = canvasRef.current.toDataURL();
        setGroupDrawings(prev => ({
            ...prev,
            [selectedGroup.id]: dataURL
        }));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas && selectedGroup) {
        const ctx = canvas.getContext('2d');
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update state to clear saved image
        setGroupDrawings(prev => {
            const newState = { ...prev };
            delete newState[selectedGroup.id];
            return newState;
        });
    }
  };

  return (
    <div className="flex h-full gap-6">
      {/* Group List */}
      <div className={`${selectedGroup ? 'hidden md:block' : 'block'} w-full md:w-80 dark:bg-slate-800 bg-white rounded-xl border dark:border-slate-700 border-slate-200 overflow-hidden flex flex-col`}>
        <div className="p-4 border-b dark:border-slate-700 border-slate-200">
          <h2 className="text-xl font-bold dark:text-white text-slate-900 flex items-center gap-2">
            <Users className="text-indigo-500" />
            StudyNexus
          </h2>
          <p className="text-xs dark:text-slate-400 text-slate-500 mt-1">Connect with peers from Class 6-12</p>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {MOCK_GROUPS.map(group => (
            <div 
              key={group.id}
              onClick={() => setSelectedGroup(group)}
              className={`p-3 rounded-lg cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700 ${selectedGroup?.id === group.id ? 'bg-indigo-50 dark:bg-indigo-600/20 border border-indigo-200 dark:border-indigo-500/50' : 'dark:bg-slate-900/50 border border-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-bold dark:text-white text-slate-900 text-sm">{group.name}</span>
                <span className="text-[10px] dark:bg-slate-800 bg-slate-200 px-2 py-0.5 rounded-full dark:text-slate-300 text-slate-600">{group.grade}</span>
              </div>
              <p className="text-xs dark:text-slate-400 text-slate-500">{group.topic}</p>
              <div className="flex items-center gap-1 mt-2 text-xs dark:text-slate-500 text-slate-400">
                <Users size={12} /> {group.members} members
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Area */}
      <div className={`flex-1 dark:bg-slate-800 bg-white rounded-xl border dark:border-slate-700 border-slate-200 flex flex-col overflow-hidden ${!selectedGroup ? 'hidden md:flex' : ''}`}>
        {selectedGroup ? (
          <>
            <div className="p-4 border-b dark:border-slate-700 border-slate-200 flex justify-between items-center dark:bg-slate-900/50 bg-slate-50/50">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                    {selectedGroup.name[0]}
                 </div>
                 <div>
                    <h3 className="font-bold dark:text-white text-slate-900">{selectedGroup.name}</h3>
                    <p className="text-xs dark:text-slate-400 text-slate-500">{selectedGroup.grade} • {selectedGroup.topic}</p>
                 </div>
              </div>
              
              {/* Tabs */}
              <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('chat')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'chat' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <MessageSquare size={16} /> Chat
                </button>
                <button 
                    onClick={() => setActiveTab('board')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'board' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-400' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                >
                    <PenTool size={16} /> Board
                </button>
              </div>

              <button onClick={() => setSelectedGroup(null)} className="md:hidden text-slate-400">Back</button>
            </div>

            {activeTab === 'chat' ? (
                // Chat View
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 dark:bg-slate-900/30 bg-slate-50/30">
                        {currentMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400">
                                <MessageSquare className="mb-2 opacity-20" size={48} />
                                <p>No messages yet. Start the conversation!</p>
                            </div>
                        ) : (
                            currentMessages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[80%] rounded-xl p-3 ${msg.user === 'You' ? 'bg-indigo-600 text-white rounded-br-none' : 'dark:bg-slate-700 bg-slate-100 dark:text-slate-200 text-slate-800 rounded-bl-none'}`}>
                                        {msg.user !== 'You' && <p className="text-xs text-indigo-500 dark:text-indigo-300 font-bold mb-1">{msg.user}</p>}
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-500 mt-1">{msg.time}</span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 border-t dark:border-slate-700 border-slate-200 dark:bg-slate-800 bg-white">
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder={`Message #${selectedGroup.name}...`}
                                className="flex-1 dark:bg-slate-900 bg-slate-50 border dark:border-slate-600 border-slate-300 rounded-lg px-4 py-2 dark:text-white text-slate-900 text-sm focus:outline-none focus:border-indigo-500"
                            />
                            <button 
                                onClick={handleSendMessage}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                // Whiteboard View
                <div className="flex-1 flex flex-col relative bg-slate-50 dark:bg-slate-900 overflow-hidden">
                    <div className="absolute top-4 left-4 z-10 flex gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg shadow-lg border dark:border-slate-700">
                        <button 
                            onClick={() => setTool('pen')}
                            className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${tool === 'pen' ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-500'}`}
                            title="Pen"
                        >
                            <PenTool size={20} />
                        </button>
                        <button 
                            onClick={() => setTool('eraser')}
                            className={`p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${tool === 'eraser' ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-500'}`}
                            title="Eraser"
                        >
                            <Eraser size={20} />
                        </button>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <div className="flex items-center gap-1">
                            {['#4f46e5', '#ef4444', '#22c55e', '#eab308', '#000000'].map(c => (
                                <button
                                    key={c}
                                    onClick={() => { setColor(c); setTool('pen'); }}
                                    className={`w-6 h-6 rounded-full border-2 ${color === c && tool === 'pen' ? 'border-slate-400 scale-110' : 'border-transparent'}`}
                                    style={{ backgroundColor: c }}
                                />
                            ))}
                        </div>
                        <div className="w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <button 
                            onClick={clearCanvas}
                            className="p-2 rounded hover:bg-red-100 text-slate-500 hover:text-red-500"
                            title="Clear Board"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>

                    <canvas 
                        ref={canvasRef}
                        width={800}
                        height={600}
                        onMouseDown={startDrawing}
                        onMouseMove={draw}
                        onMouseUp={stopDrawing}
                        onMouseLeave={stopDrawing}
                        className="touch-none cursor-crosshair bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] bg-white w-full h-full"
                    />
                </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center dark:text-slate-500 text-slate-400 p-8">
            <MessageSquare size={64} className="mb-4 opacity-20" />
            <p className="text-lg">Select a study group to start collaborating</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyNexus;
