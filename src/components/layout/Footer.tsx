// Footer Component for Follow.ai
// Comprehensive footer with navigation, social links, and newsletter

import React, { useState } from 'react';
import { cn } from '../../lib/utils';

// ============================================
// Types
// ============================================

interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

interface FooterProps {
  logo?: React.ReactNode;
  description?: string;
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterDescription?: string;
  copyrightText?: string;
  className?: string;
}

// ============================================
// Default Data
// ============================================

const defaultSections: FooterSection[] = [
  {
    title: '产品',
    links: [
      { label: '浏览工具', href: '/tools' },
      { label: '排行榜', href: '/leaderboard' },
      { label: '任务中心', href: '/tasks' },
      { label: 'XP商城', href: '/wallet' },
    ],
  },
  {
    title: '公司',
    links: [
      { label: '关于我们', href: '/about' },
      { label: '博客', href: '/blog' },
      { label: '招聘', href: '/careers' },
      { label: '联系我们', href: '/contact' },
    ],
  },
  {
    title: '资源',
    links: [
      { label: '帮助中心', href: '/help' },
      { label: 'API文档', href: '/docs', external: true },
      { label: '开发者', href: '/developers' },
      { label: '合作伙伴', href: '/partners' },
    ],
  },
  {
    title: '法律',
    links: [
      { label: '隐私政策', href: '/privacy' },
      { label: '服务条款', href: '/terms' },
      { label: 'Cookie政策', href: '/cookies' },
    ],
  },
];

const defaultSocialLinks: SocialLink[] = [
  {
    name: 'Twitter',
    href: 'https://twitter.com/followai',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/followai',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    name: 'Discord',
    href: 'https://discord.gg/followai',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
      </svg>
    ),
  },
  {
    name: 'WeChat',
    href: '#',
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.045c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.036 2.87c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z" />
      </svg>
    ),
  },
];

// ============================================
// Newsletter Form Component
// ============================================

function NewsletterForm({
  title = '订阅我们的通讯',
  description = '获取最新的AI工具推荐和平台更新',
}: {
  title?: string;
  description?: string;
}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1000);
  };

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold text-white dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-400 mb-4">
        {description}
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          className={cn(
            'flex-1 px-4 py-2 rounded-lg',
            'bg-white dark:bg-gray-800',
            'border border-white/20 dark:border-gray-600',
            'focus:ring-2 focus:ring-purple-500 focus:border-transparent',
            'text-white dark:text-white',
            'placeholder-gray-500'
          )}
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className={cn(
            'px-6 py-2 rounded-lg font-medium',
            'bg-purple-600 text-white',
            'hover:bg-purple-700',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors'
          )}
        >
          {status === 'loading' ? '...' : '订阅'}
        </button>
      </form>
      {status === 'success' && (
        <p className="mt-2 text-sm text-accent-green dark:text-green-400">
          订阅成功！感谢您的关注。
        </p>
      )}
    </div>
  );
}

// ============================================
// Footer Component
// ============================================

export function Footer({
  logo,
  description = 'Follow.ai 是一个AI工具发现与测试平台，帮助用户找到最适合的AI工具，提升工作效率。',
  sections = defaultSections,
  socialLinks = defaultSocialLinks,
  showNewsletter = true,
  newsletterTitle,
  newsletterDescription,
  copyrightText = `© ${new Date().getFullYear()} Follow.ai. All rights reserved.`,
  className,
}: FooterProps) {
  return (
    <footer className={cn('bg-white/10 dark:bg-gray-900', className)}>
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            {logo || (
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">F</span>
                </div>
                <span className="text-xl font-bold text-white dark:text-white">
                  Follow.ai
                </span>
              </div>
            )}
            <p className="text-gray-400 dark:text-gray-400 mb-6 max-w-sm">
              {description}
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 dark:bg-gray-800 flex items-center justify-center text-gray-400 dark:text-gray-400 hover:bg-primary-purple/20 dark:hover:bg-purple-900/50 hover:text-primary-purple dark:hover:text-purple-400 transition-colors"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                      className="text-gray-400 dark:text-gray-400 hover:text-primary-purple dark:hover:text-purple-400 transition-colors"
                    >
                      {link.label}
                      {link.external && (
                        <svg
                          className="inline-block w-3 h-3 ml-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        {showNewsletter && (
          <div className="border-t border-white/10 dark:border-gray-800 pt-8 mb-8">
            <NewsletterForm title={newsletterTitle} description={newsletterDescription} />
          </div>
        )}

        {/* Bottom Bar */}
        <div className="border-t border-white/10 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-400 dark:text-gray-400">
            {copyrightText}
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href="/privacy"
              className="text-gray-400 dark:text-gray-400 hover:text-primary-purple dark:hover:text-purple-400 transition-colors"
            >
              隐私政策
            </a>
            <a
              href="/terms"
              className="text-gray-400 dark:text-gray-400 hover:text-primary-purple dark:hover:text-purple-400 transition-colors"
            >
              服务条款
            </a>
            <a
              href="/sitemap"
              className="text-gray-400 dark:text-gray-400 hover:text-primary-purple dark:hover:text-purple-400 transition-colors"
            >
              网站地图
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ============================================
// Export
// ============================================

export default Footer;
