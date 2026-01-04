import React from 'react';
import { Cookie, Settings, BarChart, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CookiePolicy: React.FC = () => {
  const { t } = useLanguage();
  const cookieTypes = [
    {
      icon: Settings,
      name: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off.',
      examples: [
        'Authentication cookies to keep you logged in',
        'Session cookies to maintain your preferences',
        'Security cookies to protect against fraud',
      ],
      required: true,
    },
    {
      icon: BarChart,
      name: 'Analytics Cookies',
      description: 'These cookies help us understand how visitors interact with our website.',
      examples: [
        'Page views and navigation patterns',
        'Feature usage statistics',
        'Error tracking and performance monitoring',
      ],
      required: false,
    },
    {
      icon: Shield,
      name: 'Functional Cookies',
      description: 'These cookies enable enhanced functionality and personalization.',
      examples: [
        'Language preferences',
        'Theme settings (dark/light mode)',
        'Notification preferences',
      ],
      required: false,
    },
  ];

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cookie size={48} className="text-primary-cyan dark:text-blue-400" />
            <h1 className="text-5xl sm:text-6xl font-black text-white dark:text-white tracking-tight">
              Cookie Policy
            </h1>
          </div>
          <p className="text-xl text-gray-400 dark:text-gray-400 font-medium">
            Last updated: December 15, 2024
          </p>
        </header>

        <div className="space-y-8">
          <div className="glass-card rounded-2xl p-6 mb-8">
            <p className="text-gray-300 dark:text-gray-300 leading-relaxed">
              This Cookie Policy explains what cookies are, how we use them on Follow-ai, and how you can 
              control your cookie preferences. By continuing to use our website, you consent to our use of 
              cookies as described in this policy.
            </p>
          </div>

          <div className="glass-card rounded-xl p-8">
            <h2 className="text-2xl font-black text-white dark:text-white mb-4 tracking-tight">
              What Are Cookies?
            </h2>
            <p className="text-gray-300 dark:text-gray-300 leading-relaxed mb-4">
              Cookies are small text files that are placed on your device when you visit a website. They 
              are widely used to make websites work more efficiently and provide information to website owners.
            </p>
            <p className="text-gray-300 dark:text-gray-300 leading-relaxed">
              We use both session cookies (which expire when you close your browser) and persistent cookies 
              (which remain on your device until they expire or are deleted).
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-black text-white dark:text-white tracking-tight">
              Types of Cookies We Use
            </h2>
            {cookieTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <div key={index} className="glass-card rounded-xl p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-primary-blue/20 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
                      <Icon size={24} className="text-primary-cyan dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-black text-white dark:text-white tracking-tight">
                          {type.name}
                        </h3>
                        {type.required && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold rounded">
                            Required
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 dark:text-gray-300 mb-4 leading-relaxed">
                        {type.description}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-white dark:text-white">Examples:</p>
                        <ul className="space-y-1">
                          {type.examples.map((example, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-400 dark:text-gray-400">
                              <span className="text-primary-cyan dark:text-blue-400 mt-1">•</span>
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="glass-card rounded-xl p-8">
            <h2 className="text-2xl font-black text-white dark:text-white mb-4 tracking-tight">
              Managing Your Cookie Preferences
            </h2>
            <p className="text-gray-300 dark:text-gray-300 leading-relaxed mb-4">
              You can control and manage cookies in several ways:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary-cyan dark:text-blue-400 mt-1">1.</span>
                <div>
                  <p className="font-semibold text-white dark:text-white mb-1">Browser Settings</p>
                  <p className="text-gray-300 dark:text-gray-300">
                    Most browsers allow you to refuse or accept cookies, delete cookies, or receive a warning 
                    before a cookie is stored. Please note that disabling cookies may affect website functionality.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-cyan dark:text-blue-400 mt-1">2.</span>
                <div>
                  <p className="font-semibold text-white dark:text-white mb-1">Our Cookie Settings</p>
                  <p className="text-gray-300 dark:text-gray-300">
                    You can manage your cookie preferences through your account settings on Follow-ai.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-cyan dark:text-blue-400 mt-1">3.</span>
                <div>
                  <p className="font-semibold text-white dark:text-white mb-1">Third-Party Cookies</p>
                  <p className="text-gray-300 dark:text-gray-300">
                    Some third-party services (like analytics) may set their own cookies. You can opt out of 
                    these through their respective privacy policies.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="glass-card rounded-xl p-8">
            <h2 className="text-2xl font-black text-white dark:text-white mb-4 tracking-tight">
              Updates to This Policy
            </h2>
            <p className="text-gray-300 dark:text-gray-300 leading-relaxed">
              We may update this Cookie Policy from time to time. We will notify you of any changes by posting 
              the new policy on this page and updating the "Last updated" date. You are advised to review this 
              policy periodically.
            </p>
          </div>

          <div className="glass-card rounded-xl p-8">
            <h2 className="text-2xl font-black text-white dark:text-white mb-4 tracking-tight">
              Contact Us
            </h2>
            <p className="text-gray-300 dark:text-gray-300 leading-relaxed mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="space-y-2 text-gray-300 dark:text-gray-300">
              <p><strong>Email:</strong> privacy@follow.ai</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;

