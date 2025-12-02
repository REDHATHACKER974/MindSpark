import React, { useState } from 'react';
import { generateGraphData } from '../../services/geminiService';
import { ChartConfig } from '../../types';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { PieChart as PieChartIcon, Send, Loader2 } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const GraphGenie: React.FC = () => {
  const [input, setInput] = useState('');
  const [chartData, setChartData] = useState<ChartConfig | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const data = await generateGraphData(input);
      setChartData(data);
    } catch (e) {
      console.error(e);
      alert("Failed to generate graph. Please be more specific with data points.");
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (!chartData) return null;

    const commonProps = {
      data: chartData.data,
      margin: { top: 20, right: 30, left: 20, bottom: 5 }
    };

    switch (chartData.type) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" label={{ value: chartData.yAxisLabel, angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        );
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={3} />
          </LineChart>
        );
      case 'area':
        return (
            <AreaChart {...commonProps}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
                <Legend />
                <Area type="monotone" dataKey="value" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
        );
      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData.data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }} />
            <Legend />
          </PieChart>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full dark:bg-slate-900 bg-white rounded-lg border dark:border-slate-700 border-slate-200 shadow-xl">
      <div className="flex-1 p-8 flex flex-col items-center justify-center overflow-hidden">
        {!chartData && !loading && (
          <div className="text-center dark:text-slate-400 text-slate-500">
            <PieChartIcon size={64} className="mx-auto mb-4 text-orange-500" />
            <h2 className="text-2xl font-bold dark:text-white text-slate-900 mb-2">GraphGenie</h2>
            <p className="max-w-md mx-auto">Describe your data, and I'll visualize it. Try: "Show me a pie chart of the top 5 most spoken languages" or "Bar chart of iPhone sales from 2018 to 2023"</p>
          </div>
        )}
        
        {loading && (
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin text-orange-500 mb-2" size={32} />
            <p className="dark:text-slate-400 text-slate-500">Analyzing data...</p>
          </div>
        )}

        {chartData && !loading && (
            <div className="w-full h-full flex flex-col">
                <h3 className="text-xl font-bold dark:text-white text-slate-900 text-center mb-4">{chartData.title}</h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart() || <div>Error rendering chart</div>}
                    </ResponsiveContainer>
                </div>
            </div>
        )}
      </div>

      <div className="p-4 dark:bg-slate-800 bg-white border-t dark:border-slate-700 border-slate-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            placeholder="Describe the data you want to visualize..."
            className="flex-1 dark:bg-slate-900 bg-slate-50 border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button 
            onClick={handleGenerate}
            disabled={loading || !input.trim()}
            className="bg-orange-600 hover:bg-orange-700 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GraphGenie;