import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Tooltip from './Tooltip';

const Hero: React.FC = () => {
  return (
    <section className="bg-white pt-16 pb-20 px-4">
      <div className="container mx-auto max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
        {/* Content */}
        <div className="space-y-8 text-center lg:text-left">
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
            Where AI Tools Show Their <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Real Work
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto lg:mx-0">
            No fake reviews. No upvote farms. Just real outputs from real users. 
            Join 500+ testers earning $50-200/week.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link to="/submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
              Start Earning
            </Link>
            <Link to="/tasks" className="bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-bold text-lg transition-colors text-center">
              Get Validated
            </Link>
          </div>

          <div className="flex justify-center lg:justify-start gap-8 pt-4">
            <div className="text-center lg:text-left">
              <strong className="block text-2xl font-bold text-gray-900">3,458</strong>
              <span className="text-sm text-gray-500">Real Reviews</span>
            </div>
            <div className="text-center lg:text-left">
              <strong className="block text-2xl font-bold text-gray-900">127</strong>
              <span className="text-sm text-gray-500">Validated Tools</span>
            </div>
            <div className="text-center lg:text-left">
              <strong className="block text-2xl font-bold text-gray-900">$45,820</strong>
              <span className="text-sm text-gray-500">Earned by Testers</span>
            </div>
          </div>
        </div>
        
        {/* Hero Image / Demo Card */}
        <div className="relative mx-auto w-full max-w-md lg:max-w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 animate-pulse"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verified Output</span>
                <Tooltip content="Work output verified by our community consensus algorithm">
                  <span className="flex items-center text-green-600 text-xs font-bold gap-1 cursor-help">
                    <CheckCircle size={14} /> Verified by Follow.ai
                  </span>
                </Tooltip>
              </div>
              <div className="p-6">
                 <div className="flex items-start gap-4 mb-4">
                   <img src="https://picsum.photos/seed/user1/40/40" className="w-10 h-10 rounded-full" alt="User" />
                   <div>
                     <h3 className="font-bold text-sm">Alex's Review of Cursor</h3>
                     <p className="text-xs text-gray-500">Coding • 2 hours ago</p>
                   </div>
                   <div className="ml-auto bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">
                     Earned $50
                   </div>
                 </div>
                 <p className="text-sm text-gray-700 mb-4">
                   "Here is the React component I built in 5 mins..."
                 </p>
                 <div className="rounded-lg overflow-hidden border border-gray-200 bg-gray-900">
                   <img src="https://picsum.photos/seed/hero-code/500/300" alt="Code snippet" className="w-full h-48 object-cover opacity-80" />
                 </div>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;