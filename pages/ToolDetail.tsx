import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, TrendingUp, CheckCircle, ArrowLeft, DollarSign, Clock, Users } from 'lucide-react';
import { TOOLS, REVIEWS } from '../data';

const ToolDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const tool = TOOLS.find(t => t.id === id);
  const toolReviews = REVIEWS.filter(r => r.toolId === id);

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tool Not Found</h1>
          <p className="text-gray-600 mb-6">The tool you're looking for doesn't exist.</p>
          <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>

        {/* Tool Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            <img src={tool.logo} alt={tool.name} className="w-24 h-24 rounded-xl object-cover" />
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
                  <p className="text-gray-600 mb-3">{tool.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="bg-gray-100 px-3 py-1 rounded-full font-medium">{tool.category}</span>
                    <span className="flex items-center gap-1">
                      <Star size={16} className="text-amber-500 fill-amber-500" /> {tool.rating}
                    </span>
                    <span className="flex items-center gap-1 text-green-600 font-semibold">
                      <TrendingUp size={16} /> {tool.growth}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{tool.reviewCount}</div>
                  <div className="text-sm text-gray-500">Verified Reviews</div>
                </div>
              </div>

              {/* Use Cases */}
              {tool.useCases && tool.useCases.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Use Cases:</p>
                  <div className="flex flex-wrap gap-2">
                    {tool.useCases.map((useCase, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Link
                  to="/submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold text-center transition-colors flex items-center justify-center gap-2"
                >
                  <DollarSign size={20} />
                  Submit Review & Earn
                </Link>
                <Link
                  to="/tasks"
                  className="flex-1 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-lg font-bold text-center transition-colors flex items-center justify-center gap-2"
                >
                  <Clock size={20} />
                  View Paid Tasks
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 rounded-lg">
                <CheckCircle size={20} className="text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{tool.reviewCount}</div>
                <div className="text-sm text-gray-500">Total Reviews</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-50 rounded-lg">
                <Star size={20} className="text-green-600 fill-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{tool.rating}</div>
                <div className="text-sm text-gray-500">Average Rating</div>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp size={20} className="text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{tool.growth}</div>
                <div className="text-sm text-gray-500">Growth (24h)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Verified Reviews</h2>
            <Link
              to="/submit"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1"
            >
              Write Review <ArrowLeft size={16} className="rotate-180" />
            </Link>
          </div>

          {toolReviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No reviews yet. Be the first to review!</p>
              <Link
                to="/submit"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
              >
                Submit First Review
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {toolReviews.map(review => (
                <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="flex items-start gap-4 mb-3">
                    <img src={review.user.avatar} alt={review.user.name} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{review.user.name}</span>
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {review.user.levelName}
                        </span>
                        <span className="text-xs text-gray-400">{review.timeAgo}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              className={i < Math.floor(review.rating) ? 'text-amber-500 fill-amber-500' : 'text-gray-300'}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{review.rating}</span>
                        <span className="text-xs text-gray-500">Quality: {review.qualityScore}/10</span>
                      </div>
                      <p className="text-gray-700 mb-3">{review.text}</p>
                      {review.outputImage && (
                        <img
                          src={review.outputImage}
                          alt="Review output"
                          className="rounded-lg border border-gray-200 max-w-full h-auto mb-3"
                        />
                      )}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <button className="hover:text-blue-600 transition-colors">👍 {review.likes}</button>
                        <button className="hover:text-blue-600 transition-colors">💬 Helpful ({review.helpful})</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ToolDetail;

