import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, DollarSign, CheckCircle, Shield, FileText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const Help: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const faqs: FAQItem[] = [
    {
      category: 'getting-started',
      question: 'How do I start earning money on Follow.ai?',
      answer: 'Simply sign up, browse available testing tasks, submit real outputs from AI tools, and get verified. Once your submission is approved, you\'ll receive rewards based on the quality and task requirements.'
    },
    {
      category: 'getting-started',
      question: 'What makes an output "verified"?',
      answer: 'Verified outputs must include: 1) A real prompt you used, 2) The actual output from the AI tool, 3) Context about your goal. Our AI analyzes quality, and our team verifies authenticity. No marketing copy or fake results.'
    },
    {
      category: 'earning-money',
      question: 'How much can I earn?',
      answer: 'Rewards range from $20 to $200 per verified output, depending on the task complexity, quality score, and bounty amount. Top contributors earn $1,000+ per month.'
    },
    {
      category: 'earning-money',
      question: 'How do payouts work?',
      answer: 'Payouts are processed via Stripe Connect. Once your submission is approved and verified, funds are transferred to your account. Minimum payout is $50. Processing takes 2-5 business days.'
    },
    {
      category: 'verification',
      question: 'What is the quality score?',
      answer: 'The quality score (0-10) evaluates: clarity, usefulness, reproducibility, and originality. Scores above 8.0 typically qualify for higher rewards. Our AI analyzes your output, and human reviewers verify the score.'
    },
    {
      category: 'verification',
      question: 'How long does verification take?',
      answer: 'Most submissions are reviewed within 24-48 hours. Complex outputs or high-value bounties may take up to 72 hours. You\'ll receive email notifications when your submission status changes.'
    },
    {
      category: 'trust',
      question: 'How do you prevent spam and fake submissions?',
      answer: 'We use AI analysis to detect low-quality or duplicate content, verify file metadata, and check for originality. Human reviewers manually verify high-value submissions. Repeat offenders are banned.'
    },
    {
      category: 'trust',
      question: 'What happens if my submission is rejected?',
      answer: 'You\'ll receive a detailed explanation. Common reasons: missing prompt, low quality, irrelevant task, or duplicate content. You can revise and resubmit within 7 days.'
    },
    {
      category: 'legal',
      question: 'Who owns the content I submit?',
      answer: 'You retain ownership of your prompts and outputs. By submitting, you grant Follow.ai a license to display, analyze, and use your content for benchmarking purposes. You can request removal at any time.'
    },
    {
      category: 'legal',
      question: 'What are the payout conditions?',
      answer: 'Payouts require: verified identity, completed tax forms (for amounts over $600/year), and compliance with our terms. Fraud or abuse results in account suspension and forfeiture of rewards.'
    }
  ];
  
  const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'getting-started', label: 'Getting Started', icon: FileText },
    { id: 'earning-money', label: 'Earning Money', icon: DollarSign },
    { id: 'verification', label: 'Verification & Scores', icon: CheckCircle },
    { id: 'trust', label: 'Trust & Safety', icon: Shield },
    { id: 'legal', label: 'Legal & Payouts', icon: FileText },
  ];
  
  const filteredFAQs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory);
  
  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black text-gray-900 mb-4 tracking-tight">
            Help & FAQ
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
            Everything you need to know about Follow.ai
          </p>
        </div>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <Icon size={18} />
                {category.label}
              </button>
            );
          })}
        </div>
        
        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="glass-card rounded-xl overflow-hidden shadow-lg"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="text-lg font-bold text-gray-900 dark:text-white pr-8">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-600 dark:text-gray-400 leading-relaxed animate-fadeIn">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Contact Section */}
        <div className="mt-16 text-center glass-card rounded-2xl p-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Can't find what you're looking for? Get in touch with our support team.
          </p>
          <a
            href="mailto:support@follow.ai"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Help;

