import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Users, DollarSign, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { TASKS } from '../data';

const Tasks: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const startTask = () => {
    // Placeholder: direct users to submit page to complete the task output
    navigate('/submit');
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center mb-12 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-4 tracking-tight">{t('tasks.title')}</h1>
          <p className="text-xl text-gray-600 font-medium">{t('tasks.subtitle')}</p>
          <div className="mt-4 text-sm text-gray-600 glass-card inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-sm">
            <span className="text-green-600 font-semibold">{t('tasks.preCheck')}</span> + <span className="text-blue-600 font-semibold">{t('tasks.manualVerification')}</span> {t('tasks.requiredForPayout')}
          </div>
        </div>

        <div className="grid gap-6">
          {TASKS.map((task, idx) => (
            <div key={task.id} className="glass-card rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 card-3d hover:shadow-2xl transition-all duration-300 animate-slideUp" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">
                    {task.tool}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={14} /> {task.timeLeft} {t('tasks.timeLeft')}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{task.title}</h3>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users size={16} /> {task.spots} {t('tasks.spotsRemaining')}
                  </span>
                  <span className="flex items-center gap-1 text-emerald-600">
                    AI check + human review
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Deliverables: Upload outputs + short narrative; AI will pre-score, payout after manual verification.
                </p>
              </div>

              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-500">{t('tasks.reward')}</p>
                  <p className="text-2xl font-bold text-green-600 flex items-center">
                    <DollarSign size={20} strokeWidth={3} />{task.reward}
                  </p>
                </div>
                <button
                  onClick={() => startTask()}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {t('tasks.startTask')} <ArrowRight size={18} />
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