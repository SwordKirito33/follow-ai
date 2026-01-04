import { useState } from 'react';
import { Check, Zap, CreditCard } from 'lucide-react';
import { XP_PACKAGES, purchaseXP } from '../services/stripeService';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PurchaseXP() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(XP_PACKAGES[1].id);

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      await purchaseXP(selectedPackage, user.id);
      // Stripe will redirect to payment-success page
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Purchase failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600 rounded-full mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Purchase XP
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Boost your testing power! Use XP to reward testers and get faster, higher-quality feedback on your AI products.
          </p>
        </div>

        {/* Packages */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {XP_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              onClick={() => setSelectedPackage(pkg.id)}
              className={`relative bg-white rounded-2xl p-6 cursor-pointer transition-all ${
                selectedPackage === pkg.id
                  ? 'ring-4 ring-purple-600 shadow-2xl scale-105'
                  : 'hover:shadow-xl hover:scale-102'
              } ${pkg.popular ? 'border-2 border-purple-600' : 'border border-white/10'}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center">
                <div className="text-5xl font-bold text-primary-purple mb-2">
                  {pkg.amount}
                </div>
                <div className="text-gray-400 text-sm mb-4">XP Points</div>

                <div className="text-3xl font-bold text-white mb-1">
                  ${pkg.price}
                </div>
                <div className="text-gray-400 text-sm mb-6">{pkg.currency}</div>

                <div className="flex items-center justify-center text-sm text-gray-400 mb-4">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  ${(pkg.price / pkg.amount * 100).toFixed(2)} per 100 XP
                </div>

                {selectedPackage === pkg.id && (
                  <div className="flex items-center justify-center text-primary-purple font-semibold">
                    <Check className="w-5 h-5 mr-1" />
                    Selected
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">
            What you get with XP
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-purple/20 rounded-lg flex items-center justify-center mr-4">
                <Zap className="w-5 h-5 text-primary-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Reward Testers
                </h3>
                <p className="text-gray-400 text-sm">
                  Incentivize high-quality feedback by rewarding testers with XP
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-purple/20 rounded-lg flex items-center justify-center mr-4">
                <Check className="w-5 h-5 text-primary-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Faster Results
                </h3>
                <p className="text-gray-400 text-sm">
                  Higher rewards attract more testers and speed up your feedback cycle
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-10 h-10 bg-primary-purple/20 rounded-lg flex items-center justify-center mr-4">
                <CreditCard className="w-5 h-5 text-primary-purple" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">
                  Flexible Spending
                </h3>
                <p className="text-gray-400 text-sm">
                  Use XP across all your products and testing campaigns
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Purchase Button */}
        <div className="text-center">
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                Purchase {XP_PACKAGES.find(p => p.id === selectedPackage)?.label}
              </>
            )}
          </button>

          <p className="text-gray-400 text-sm mt-4">
            Secure payment powered by Stripe • No hidden fees
          </p>
        </div>
      </div>
    </div>
  );
}
