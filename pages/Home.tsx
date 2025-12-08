import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Rankings from '../components/Rankings';
import ActivityFeed from '../components/ActivityFeed';
import ReviewCard from '../components/ReviewCard';
import ReviewCardSkeleton from '../components/ReviewCardSkeleton';
import NewsWidget from '../components/NewsWidget';
import { REVIEWS } from '../data';

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial data fetch
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <ActivityFeed />
      <Hero />
      <Rankings />
      
      {/* Why Different Section */}
      <section className="bg-white py-16 px-4 border-y border-gray-100">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why We're Different</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-4 border-b-2 border-gray-100 text-gray-500 font-medium">Feature</th>
                  <th className="p-4 border-b-2 border-gray-100 text-gray-400 font-medium">Product Hunt</th>
                  <th className="p-4 border-b-2 border-blue-100 bg-blue-50 text-blue-800 font-bold rounded-t-lg">Follow.ai</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b border-gray-100 font-medium">Proof Required</td>
                  <td className="p-4 border-b border-gray-100 text-red-500">❌ No</td>
                  <td className="p-4 border-b border-blue-100 bg-blue-50/50 text-green-600 font-bold">✅ Yes (Mandatory)</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-100 font-medium">Real Outputs</td>
                  <td className="p-4 border-b border-gray-100 text-red-500">❌ No</td>
                  <td className="p-4 border-b border-blue-100 bg-blue-50/50 text-green-600 font-bold">✅ Every Review</td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-100 font-medium">Earn Money</td>
                  <td className="p-4 border-b border-gray-100 text-red-500">❌ No</td>
                  <td className="p-4 border-b border-blue-100 bg-blue-50/50 text-green-600 font-bold">✅ $20-200/review</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl grid lg:grid-cols-[2fr_1fr] gap-8">
          {/* Feed */}
          <div>
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-2xl font-bold text-gray-900">Recent Validated Reviews</h2>
               <div className="hidden sm:flex gap-2">
                 <button className="px-3 py-1 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors">All</button>
                 <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">Coding</button>
                 <button className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded-full text-sm font-medium transition-colors">Design</button>
               </div>
             </div>
             
             <div className="grid gap-6">
               {loading 
                 ? Array.from({ length: 3 }).map((_, i) => <ReviewCardSkeleton key={i} />)
                 : REVIEWS.map(review => (
                     <ReviewCard key={review.id} review={review} />
                   ))
               }
             </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <NewsWidget />
            
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-xl mb-2">Want to earn money?</h3>
              <p className="text-blue-100 text-sm mb-4">Complete specific testing tasks for guaranteed rewards.</p>
              <button className="w-full bg-white text-blue-600 font-bold py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
                View Tasks
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;