import React from 'react';
import { TOOLS } from '../data';
import { Star, TrendingUp, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';

const RankingsPage: React.FC = () => {
  const extendedTools = [
    ...TOOLS,
    {
      id: 'runway',
      name: 'Runway Gen-3',
      category: 'Video Gen',
      logo: 'https://picsum.photos/seed/runway/60/60',
      rating: 4.6,
      reviewCount: 29,
      growth: '+68%',
      description: 'AI video generation with control.',
      useCases: ['Video Editing', 'Motion Graphics', 'Commercials', 'Social Media']
    },
    {
      id: 'chatgpt',
      name: 'ChatGPT 4o',
      category: 'AI Assistant',
      logo: 'https://picsum.photos/seed/chatgpt/60/60',
      rating: 4.9,
      reviewCount: 55,
      growth: '+32%',
      description: 'Multimodal general assistant.',
      useCases: ['Writing', 'Coding', 'Analysis', 'Translation', 'Tutoring']
    }
  ];

  const badgeClasses = ['bg-yellow-100 text-yellow-800', 'bg-gray-100 text-gray-700', 'bg-orange-100 text-orange-800'];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-10">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
              <span className="text-3xl">🏆</span> AI Tools Rankings
            </h1>
            <p className="text-gray-600 mt-2">Real rankings based on verified reviews, quality scores, and momentum.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Today', 'This Week', 'This Month', 'All Time'].map((label, idx) => (
              <button key={label} className={`px-4 py-2 rounded-full text-sm font-semibold border ${idx === 0 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'}`}>
                {label}
              </button>
            ))}
          </div>
        </header>

        <section className="grid lg:grid-cols-3 gap-6">
          {extendedTools.slice(0, 3).map((tool, index) => (
            <div key={tool.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative hover:shadow-lg transition-shadow">
              <div className={`absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 border-white shadow-md ${badgeClasses[index] || badgeClasses[0]}`}>
                {index === 0 ? '🏆' : index + 1}
              </div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <img src={tool.logo} alt={tool.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{tool.name}</h3>
                    <p className="text-sm text-gray-500">{tool.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-500 font-bold justify-end">
                    <Star size={16} fill="currentColor" /> {tool.rating}
                  </div>
                  <div className="text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded mt-1 inline-block">
                    {tool.growth}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
              {tool.useCases && tool.useCases.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1.5 font-medium">Use Cases:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.useCases.map((useCase, idx) => (
                      <span key={idx} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full font-medium border border-blue-100">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Trophy size={16} className="text-blue-500" /> {tool.reviewCount} reviews today
                </span>
                <Link to={`/tool/${tool.id}`} className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-black transition-colors">
                  Review & Earn ${50 - index * 5}
                </Link>
              </div>
            </div>
          ))}
        </section>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Daily Top 10</h2>
              <p className="text-sm text-gray-500">Updated hourly based on verified output quality.</p>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Live</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-500">
                <tr className="border-b">
                  <th className="py-2 pr-4">Rank</th>
                  <th className="py-2 pr-4">Tool</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Reviews (24h)</th>
                  <th className="py-2 pr-4">Avg Rating</th>
                  <th className="py-2 pr-4">Growth</th>
                  <th className="py-2 pr-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {extendedTools.map((tool, idx) => (
                  <tr key={tool.id} className="border-b last:border-0">
                    <td className="py-3 pr-4">
                      <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${idx === 0 ? 'bg-yellow-100 text-yellow-800' : idx === 1 ? 'bg-gray-100 text-gray-700' : idx === 2 ? 'bg-orange-100 text-orange-800' : 'bg-gray-50 text-gray-600'}`}>
                        {idx + 1}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <img src={tool.logo} alt={tool.name} className="w-8 h-8 rounded" />
                        <div>
                          <div className="font-semibold text-gray-900">{tool.name}</div>
                          <div className="text-xs text-gray-500">Validated</div>
                          {tool.useCases && tool.useCases.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {tool.useCases.slice(0, 3).map((useCase, idx) => (
                                <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-medium">
                                  {useCase}
                                </span>
                              ))}
                              {tool.useCases.length > 3 && (
                                <span className="text-[10px] text-gray-400">+{tool.useCases.length - 3}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{tool.category}</td>
                    <td className="py-3 pr-4 text-gray-900 font-semibold">{tool.reviewCount}</td>
                    <td className="py-3 pr-4 text-gray-900 font-semibold">⭐ {tool.rating}</td>
                    <td className="py-3 pr-4">
                      <span className="text-green-600 font-semibold flex items-center gap-1">
                        <TrendingUp size={14} /> {tool.growth}
                      </span>
                    </td>
                    <td className="py-3 pr-0 text-right">
                      <Link to={`/tool/${tool.id}`} className="inline-block px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RankingsPage;

