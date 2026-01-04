import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database';
import WalletBalance from '@/components/WalletBalance';
import XPPackages from '@/components/XPPackages';
import TransactionHistory from '@/components/TransactionHistory';
import { useToast } from '@/components/ui/toast';

type Wallet = Database['public']['Tables']['wallets']['Row'];

const DeveloperWallet: React.FC = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      loadWallet();
    }
  }, [user, authLoading]);

  const loadWallet = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Try to get existing wallet
      let { data, error: fetchError } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // If wallet doesn't exist, create one
      if (fetchError && fetchError.code === 'PGRST116') {
        const { data: newWallet, error: createError } = await supabase
          .from('wallets')
          .insert({
            user_id: user.id,
            balance: 0,
            total_purchased: 0,
            total_spent: 0,
            currency: 'USD',
          })
          .select()
          .single();

        if (createError) throw createError;
        data = newWallet;
      } else if (fetchError) {
        throw fetchError;
      }

      setWallet(data);
    } catch (err: any) {
      console.error('Failed to load wallet:', err);
      setError(err.message || 'Failed to load wallet');
      toast.error('Failed to load wallet', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseComplete = () => {
    // Reload wallet after purchase
    setTimeout(() => {
      loadWallet();
    }, 2000);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading wallet...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">Please Log In</h2>
          <p className="text-gray-400 mb-6">
            You need to be logged in to view your wallet.
          </p>
        </div>
      </div>
    );
  }

  if (error && !wallet) {
    return (
      <div className="min-h-screen py-12 px-4 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-400 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 relative">
      <div className="absolute inset-0 bg-transparent"></div>
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="mb-8 animate-slideDown">
          <h1 className="text-4xl sm:text-5xl font-black gradient-text mb-2 tracking-tight">
            Developer Wallet
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            Manage your XP balance and purchase packages
          </p>
        </div>

        {/* Wallet Balance */}
        {wallet && (
          <WalletBalance
            balance={wallet.balance}
            totalPurchased={wallet.total_purchased}
            totalSpent={wallet.total_spent}
            currency={wallet.currency}
          />
        )}

        {/* XP Packages */}
        <XPPackages
          userId={user.id}
          onPurchaseComplete={handlePurchaseComplete}
        />

        {/* Transaction History */}
        <TransactionHistory userId={user.id} limit={50} />
      </div>
    </div>
  );
};

export default DeveloperWallet;

