import React from 'react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <header>
          <h1 className="text-4xl font-bold text-gray-900">About Follow.ai</h1>
          <p className="text-gray-600 mt-3 leading-relaxed">
            Follow.ai is the first AI tool review platform that enforces one radical rule: <strong>No output, no review.</strong>
            Every review must include real work created with the tool—code, designs, videos, documents—so fake reviews become impossible.
          </p>
        </header>

        <section className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Why we exist</h2>
          <p className="text-gray-700">
            AI tools are launching daily, but the internet is flooded with unverifiable hype. We fix trust by requiring proof of work,
            analyzing quality, and rewarding real testers.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>No fake reviews or upvote farms—evidence is mandatory.</li>
            <li>Testers earn for high-quality, verified outputs.</li>
            <li>Builders get credible validation in 48 hours.</li>
            <li>Investors see real traction, not vanity metrics.</li>
          </ul>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-2">For Testers</h3>
            <p className="text-gray-700">Earn $20-200 per verified review and build a portfolio that proves your AI skills.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-2">For Builders</h3>
            <p className="text-gray-700">Get real users, real outputs, and investor-ready validation badges.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-2">For Investors</h3>
            <p className="text-gray-700">See which tools have genuine traction backed by verified outputs and growth signals.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
            <h3 className="text-xl font-bold text-gray-900 mb-2">For the Community</h3>
            <p className="text-gray-700">Transparent, evidence-based reviews that raise the bar for AI tool discovery.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

