import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Shield, Lock, Eye, FileText, Globe } from 'lucide-react';

const Privacy: React.FC = () => {
  const { t } = useLanguage();
  
  const sections = [
    {
      icon: FileText,
      title: 'Information We Collect',
      content: [
        {
          subtitle: 'Account Information',
          text: 'When you create an account, we collect your email address, username, and optionally your full name. We use this information to provide our services and communicate with you.',
        },
        {
          subtitle: 'Content You Submit',
          text: 'We collect the reviews, outputs, prompts, and files you submit to our platform. This content is used to verify AI tool outputs and build our benchmark database. You retain ownership of your content.',
        },
        {
          subtitle: 'Usage Data',
          text: 'We automatically collect information about how you interact with our platform, including pages visited, features used, and time spent. This helps us improve our services.',
        },
        {
          subtitle: 'Payment Information',
          text: 'Payment processing is handled by Stripe. We do not store your credit card information. We only store payment history and transaction records necessary for accounting and payout purposes.',
        },
      ],
    },
    {
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'To provide, maintain, and improve our services',
        'To process payments and payouts',
        'To verify and score AI tool outputs',
        'To communicate with you about your account, reviews, and platform updates',
        'To detect and prevent fraud, abuse, and security issues',
        'To comply with legal obligations',
        'To analyze usage patterns and improve user experience',
      ],
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: [
        'We use industry-standard encryption (SSL/TLS) to protect data in transit',
        'Sensitive data is encrypted at rest using AES-256',
        'We implement access controls and authentication to protect your account',
        'Regular security audits and vulnerability assessments',
        'We do not sell your personal information to third parties',
      ],
    },
    {
      icon: Globe,
      title: 'Data Sharing and Disclosure',
      content: [
        {
          subtitle: 'Public Content',
          text: 'Reviews and outputs you submit may be displayed publicly on our platform. Your username and profile information may be associated with this content.',
        },
        {
          subtitle: 'Service Providers',
          text: 'We share data with trusted service providers (e.g., Supabase for database, Stripe for payments) who help us operate our platform. These providers are contractually obligated to protect your data.',
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose information if required by law, court order, or government regulation, or to protect our rights and the safety of our users.',
        },
      ],
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: [
        {
          subtitle: 'Access and Correction',
          text: 'You can access and update your account information at any time through your profile settings.',
        },
        {
          subtitle: 'Data Deletion',
          text: 'You can request deletion of your account and associated data by contacting us. Some information may be retained for legal or operational purposes.',
        },
        {
          subtitle: 'Data Portability',
          text: 'You can export your data in a machine-readable format upon request.',
        },
        {
          subtitle: 'Opt-Out',
          text: 'You can opt out of marketing emails at any time using the unsubscribe link in our emails or through your account settings.',
        },
      ],
    },
  ];
  
  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-4xl relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-black text-white dark:text-white mb-4 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-400 dark:text-gray-400 font-medium">
            Last updated: December 15, 2024
          </p>
        </header>

        <div className="space-y-8">
          <div className="glass-card rounded-2xl p-6 mb-8">
            <p className="text-gray-300 dark:text-gray-300 leading-relaxed">
              At Follow.ai, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
              disclose, and safeguard your information when you use our platform. By using Follow.ai, you 
              agree to the collection and use of information in accordance with this policy.
            </p>
          </div>

          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <div key={index} className="glass-card rounded-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-primary-blue/20 dark:bg-blue-900/30 rounded-lg">
                    <Icon size={24} className="text-primary-cyan dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-black text-white dark:text-white tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((item, idx) => {
                    if (typeof item === 'string') {
                      return (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="text-primary-cyan dark:text-blue-400 mt-1">•</span>
                          <p className="text-gray-300 dark:text-gray-300 leading-relaxed">{item}</p>
                        </div>
                      );
                    }
                    return (
                      <div key={idx} className="space-y-2">
                        <h3 className="font-semibold text-white dark:text-white">{item.subtitle}</h3>
                        <p className="text-gray-300 dark:text-gray-300 leading-relaxed">{item.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="glass-card rounded-xl p-8">
            <h2 className="text-2xl font-black text-white dark:text-white mb-4 tracking-tight">
              Contact Us
            </h2>
            <p className="text-gray-300 dark:text-gray-300 leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="space-y-2 text-gray-300 dark:text-gray-300">
              <p><strong>Email:</strong> privacy@follow.ai</p>
              <p><strong>Address:</strong> Follow.ai, [Your Address]</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;

