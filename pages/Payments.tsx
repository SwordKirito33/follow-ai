import React from 'react';
import { CreditCard, Send, ExternalLink } from 'lucide-react';

const paymentLink = import.meta.env.VITE_STRIPE_PAYMENT_LINK_URL;
const connectOnboardingLink = import.meta.env.VITE_STRIPE_CONNECT_ONBOARD_URL;

const Payments: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments (Global / AU-friendly)</h1>
          <p className="text-gray-600 mt-2">收款：Stripe Payment Link（支持国际卡，澳洲可用） · 付款：Stripe Connect Payouts 给测试者。</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <CreditCard />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">收款 (Payment Link)</h2>
                <p className="text-sm text-gray-500">用 Stripe Payment Link 收用户/雇主的费用，默认币种建议 AUD。</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              在 Stripe 后台创建 Payment Link，然后把链接填到环境变量 <code className="bg-gray-100 px-1 rounded">VITE_STRIPE_PAYMENT_LINK_URL</code>。
            </p>
            <button
              onClick={() => paymentLink && window.open(paymentLink, '_blank')}
              disabled={!paymentLink}
              className={`w-full justify-center inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                paymentLink ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              打开收款链接 <ExternalLink size={16} />
            </button>
            {!paymentLink && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
                未配置 Payment Link。请在 Stripe 创建链接后，把地址写入 <code className="bg-white px-1 rounded border">.env</code> 中。
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <Send />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">付款给测试者 (Connect)</h2>
                <p className="text-sm text-gray-500">Stripe Connect Payouts，需完成 KYC 并绑定银行账户。</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              在后台生成 Connect onboarding link，再填入 <code className="bg-gray-100 px-1 rounded">VITE_STRIPE_CONNECT_ONBOARD_URL</code>。
              最终放款可在后台或 API 调用完成。
            </p>
            <button
              onClick={() => connectOnboardingLink && window.open(connectOnboardingLink, '_blank')}
              disabled={!connectOnboardingLink}
              className={`w-full justify-center inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-colors ${
                connectOnboardingLink ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              进入收款人开户 / 绑卡 <ExternalLink size={16} />
            </button>
            {!connectOnboardingLink && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
                未配置 Connect Onboarding 链接。请在 Stripe 为创作者生成 onboarding link 后填入 <code className="bg-white px-1 rounded border">.env</code>。
              </p>
            )}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-2">
          <h3 className="text-lg font-bold text-gray-900">上线步骤 (Melbourne/AU)</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Stripe Dashboard：把账户主币种设为 AUD；创建 Payment Link（用于收款）。</li>
            <li>Stripe Connect：开通 Express，生成 onboarding link（测试者绑卡/KYC）；启用 payouts。</li>
            <li>把两个链接写入 <code className="bg-gray-100 px-1 rounded">.env</code>：<code className="bg-gray-100 px-1 rounded">VITE_STRIPE_PAYMENT_LINK_URL</code>、<code className="bg-gray-100 px-1 rounded">VITE_STRIPE_CONNECT_ONBOARD_URL</code>。</li>
            <li>部署到 Vercel/Netlify，确保强制 HTTPS。</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Payments;

