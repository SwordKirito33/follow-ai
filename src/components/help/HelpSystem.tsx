import React, { useState } from 'react';

// =====================================================
// 帮助和文档组件
// 任务: 331-350 帮助相关任务
// =====================================================

// =====================================================
// FAQ 组件
// =====================================================

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQProps {
  items: FAQItem[];
}

export const FAQ: React.FC<FAQProps> = ({ items }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(items.map(item => item.category))];

  const filteredItems = items.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">常见问题</h2>
        <p className="text-muted-foreground">找到你需要的答案</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索问题..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                px-4 py-2 rounded-lg whitespace-nowrap transition-colors
                ${selectedCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {cat === 'all' ? '全部' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQ 列表 */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-xl">
            <span className="text-4xl">🔍</span>
            <p className="mt-4 text-lg font-medium text-foreground">没有找到相关问题</p>
            <p className="text-muted-foreground">尝试使用其他关键词搜索</p>
          </div>
        ) : (
          filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-muted/30 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenId(openId === item.id ? null : item.id)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-medium text-foreground">{item.question}</span>
                <svg
                  className={`w-5 h-5 text-muted-foreground transition-transform ${openId === item.id ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openId === item.id && (
                <div className="px-6 pb-4 text-muted-foreground">
                  {item.answer}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// =====================================================
// 帮助中心
// =====================================================

interface HelpCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  articles: Array<{
    id: string;
    title: string;
    excerpt: string;
  }>;
}

interface HelpCenterProps {
  categories: HelpCategory[];
  onArticleClick: (articleId: string) => void;
}

export const HelpCenter: React.FC<HelpCenterProps> = ({
  categories,
  onArticleClick
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8">
      {/* 头部 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground">帮助中心</h1>
        <p className="text-muted-foreground mt-2">我们能帮你什么？</p>
        
        {/* 搜索框 */}
        <div className="max-w-xl mx-auto mt-6 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="搜索帮助文章..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-border bg-background text-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 分类卡片 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map(category => (
          <div key={category.id} className="bg-muted/30 rounded-2xl p-6 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{category.icon}</span>
              <div>
                <h3 className="font-semibold text-foreground">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
              </div>
            </div>
            <ul className="space-y-2">
              {category.articles.slice(0, 3).map(article => (
                <li key={article.id}>
                  <button
                    onClick={() => onArticleClick(article.id)}
                    className="text-sm text-primary hover:underline text-left"
                  >
                    {article.title}
                  </button>
                </li>
              ))}
            </ul>
            {category.articles.length > 3 && (
              <button className="mt-4 text-sm text-muted-foreground hover:text-foreground">
                查看全部 {category.articles.length} 篇文章 →
              </button>
            )}
          </div>
        ))}
      </div>

      {/* 联系支持 */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-2xl p-8 text-center">
        <h2 className="text-xl font-bold text-foreground">还是没找到答案？</h2>
        <p className="text-muted-foreground mt-2">我们的支持团队随时为你服务</p>
        <div className="flex justify-center gap-4 mt-6">
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors">
            联系客服
          </button>
          <button className="px-6 py-3 bg-background border border-border rounded-xl hover:bg-muted transition-colors">
            发送邮件
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// 文章详情
// =====================================================

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  updatedAt: Date;
  helpful: number;
  notHelpful: number;
  relatedArticles: Array<{
    id: string;
    title: string;
  }>;
}

interface ArticleViewProps {
  article: Article;
  onBack: () => void;
  onFeedback: (helpful: boolean) => void;
  onRelatedClick: (articleId: string) => void;
}

export const ArticleView: React.FC<ArticleViewProps> = ({
  article,
  onBack,
  onFeedback,
  onRelatedClick
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);

  const handleFeedback = (helpful: boolean) => {
    if (feedbackGiven === null) {
      setFeedbackGiven(helpful);
      onFeedback(helpful);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* 返回按钮 */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回帮助中心
      </button>

      {/* 文章头部 */}
      <div className="mb-8">
        <span className="text-sm text-primary">{article.category}</span>
        <h1 className="text-3xl font-bold text-foreground mt-2">{article.title}</h1>
        <p className="text-muted-foreground mt-2">
          由 {article.author} 更新于 {article.updatedAt.toLocaleDateString('zh-CN')}
        </p>
      </div>

      {/* 文章内容 */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>

      {/* 反馈 */}
      <div className="mt-12 p-6 bg-muted/30 rounded-xl text-center">
        <p className="font-medium text-foreground">这篇文章有帮助吗？</p>
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => handleFeedback(true)}
            disabled={feedbackGiven !== null}
            className={`
              px-6 py-2 rounded-lg transition-colors
              ${feedbackGiven === true
                ? 'bg-green-500 text-white'
                : feedbackGiven === null
                  ? 'bg-muted hover:bg-green-500/20 hover:text-green-500'
                  : 'bg-muted opacity-50'
              }
            `}
          >
            👍 有帮助 ({article.helpful + (feedbackGiven === true ? 1 : 0)})
          </button>
          <button
            onClick={() => handleFeedback(false)}
            disabled={feedbackGiven !== null}
            className={`
              px-6 py-2 rounded-lg transition-colors
              ${feedbackGiven === false
                ? 'bg-red-500 text-white'
                : feedbackGiven === null
                  ? 'bg-muted hover:bg-red-500/20 hover:text-red-500'
                  : 'bg-muted opacity-50'
              }
            `}
          >
            👎 没帮助 ({article.notHelpful + (feedbackGiven === false ? 1 : 0)})
          </button>
        </div>
        {feedbackGiven !== null && (
          <p className="mt-4 text-muted-foreground">感谢你的反馈！</p>
        )}
      </div>

      {/* 相关文章 */}
      {article.relatedArticles.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold text-foreground mb-4">相关文章</h3>
          <div className="space-y-2">
            {article.relatedArticles.map(related => (
              <button
                key={related.id}
                onClick={() => onRelatedClick(related.id)}
                className="block w-full text-left px-4 py-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <span className="text-primary">{related.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// =====================================================
// 快速入门指南
// =====================================================

interface QuickStartStep {
  id: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  completed: boolean;
}

interface QuickStartGuideProps {
  steps: QuickStartStep[];
  onComplete: (stepId: string) => void;
}

export const QuickStartGuide: React.FC<QuickStartGuideProps> = ({
  steps,
  onComplete
}) => {
  const completedCount = steps.filter(s => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">快速入门</h2>
          <p className="text-muted-foreground">完成以下步骤开始使用</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-primary">{completedCount}/{steps.length}</p>
          <p className="text-sm text-muted-foreground">已完成</p>
        </div>
      </div>

      {/* 进度条 */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-8">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 步骤列表 */}
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              flex items-start gap-4 p-4 rounded-xl transition-colors
              ${step.completed ? 'bg-green-500/10' : 'bg-background'}
            `}
          >
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
              ${step.completed
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground'
              }
            `}>
              {step.completed ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-medium ${step.completed ? 'text-green-500' : 'text-foreground'}`}>
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{step.description}</p>
              {!step.completed && step.action && (
                <button
                  onClick={() => {
                    step.action?.onClick();
                    onComplete(step.id);
                  }}
                  className="mt-3 px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {step.action.label}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {completedCount === steps.length && (
        <div className="mt-8 text-center">
          <span className="text-4xl">🎉</span>
          <p className="mt-2 text-lg font-medium text-foreground">恭喜！你已完成所有步骤</p>
          <p className="text-muted-foreground">现在可以开始探索更多功能了</p>
        </div>
      )}
    </div>
  );
};

// =====================================================
// 联系表单
// =====================================================

interface ContactFormProps {
  onSubmit: (data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }) => Promise<void>;
}

export const ContactForm: React.FC<ContactFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-2xl">
        <span className="text-5xl">✉️</span>
        <h2 className="mt-4 text-2xl font-bold text-foreground">消息已发送！</h2>
        <p className="text-muted-foreground mt-2">我们会尽快回复你</p>
        <button
          onClick={() => {
            setSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
          }}
          className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          发送新消息
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">联系我们</h2>
        <p className="text-muted-foreground">有问题或建议？请告诉我们</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">姓名</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="你的姓名"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">邮箱</label>
          <input
            type="email"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
            className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">主题</label>
        <select
          value={formData.subject}
          onChange={e => setFormData({ ...formData, subject: e.target.value })}
          required
          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">选择主题</option>
          <option value="general">一般咨询</option>
          <option value="bug">报告问题</option>
          <option value="feature">功能建议</option>
          <option value="billing">账单问题</option>
          <option value="other">其他</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-2">消息</label>
        <textarea
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          required
          rows={5}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          placeholder="详细描述你的问题或建议..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {isSubmitting ? '发送中...' : '发送消息'}
      </button>
    </form>
  );
};

export default HelpCenter;
