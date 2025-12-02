import React from 'react';
import { LucideIcon } from 'lucide-react';
import { BotType } from '../types';

interface BotCardProps {
  id: BotType;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  onClick: (id: BotType) => void;
}

export const BotCard: React.FC<BotCardProps> = ({ id, title, description, icon: Icon, color, onClick }) => {
  return (
    <div 
      onClick={() => onClick(id)}
      className={`relative group dark:bg-slate-800 bg-white p-6 rounded-xl border dark:border-slate-700 border-slate-200 hover:border-${color}-500 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-${color}-500/10 overflow-hidden`}
    >
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
        <Icon size={100} className={`text-${color}-500`} />
      </div>
      <div className="relative z-10">
        <div className={`w-12 h-12 rounded-lg dark:bg-slate-900 bg-slate-100 flex items-center justify-center mb-4 border dark:border-slate-700 border-slate-200 group-hover:border-${color}-500/50`}>
          <Icon className={`text-${color}-500`} size={24} />
        </div>
        <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">{title}</h3>
        <p className="dark:text-slate-400 text-slate-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};