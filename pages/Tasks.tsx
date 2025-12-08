import React from 'react';
import { Clock, Users, DollarSign, ArrowRight } from 'lucide-react';
import { TASKS } from '../data';

const Tasks: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Earn Money Testing AI</h1>
          <p className="text-xl text-gray-600">Complete verified tasks to earn guaranteed rewards.</p>
        </div>

        <div className="grid gap-6">
          {TASKS.map((task) => (
            <div key={task.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-blue-300 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                    {task.tool}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={14} /> {task.timeLeft} left
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{task.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users size={16} /> {task.spots} spots remaining
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Reward</p>
                  <p className="text-2xl font-bold text-green-600 flex items-center">
                    <DollarSign size={20} strokeWidth={3} />{task.reward}
                  </p>
                </div>
                <button className="bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors">
                  Start Task <ArrowRight size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tasks;