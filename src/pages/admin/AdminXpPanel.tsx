import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { adminGrantXp } from '../../lib/xp-service';
import { Shield, User, Plus, Minus, AlertCircle } from 'lucide-react';

const AdminXpPanel: React.FC = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [userId, setUserId] = useState('');
  const [xpAmount, setXpAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check if user is admin
  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      setCheckingAdmin(false);
      return;
    }

    const checkAdmin = async () => {
      try {
        const { data, error } = await supabase
          .from('app_admins')
          .select('user_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setIsAdmin(!!data);
      } catch (err) {
        console.error('Failed to check admin status:', err);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdmin();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim() || !xpAmount.trim()) {
      setError('User ID and XP amount are required');
      return;
    }

    const xp = parseInt(xpAmount);
    if (isNaN(xp) || xp === 0) {
      setError('XP amount must be a non-zero number');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      await adminGrantXp({
        userId: userId.trim(),
        deltaXp: xp,
        refType: 'admin_panel',
        note: reason.trim() || `Admin adjustment: ${xp > 0 ? '+' : ''}${xp} XP`,
        metadata: {
          admin_id: user?.id,
          timestamp: new Date().toISOString(),
        },
      });

      setSuccess(`Successfully ${xp > 0 ? 'granted' : 'revoked'} ${Math.abs(xp)} XP`);
      
      // Reset form
      setUserId('');
      setXpAmount('');
      setReason('');
    } catch (err: any) {
      console.error('Failed to grant XP:', err);
      setError(err.message || 'Failed to grant XP');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50/20 to-purple-50/20">
        <div className="text-center max-w-md mx-auto p-8">
          <Shield size={48} className="mx-auto mb-4 text-red-600" />
          <h2 className="text-3xl font-black gradient-text mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You do not have admin permissions to access this panel.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield size={32} className="text-blue-600" />
            <h1 className="text-4xl sm:text-5xl font-black gradient-text tracking-tight">
              Admin XP Panel
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            Grant or revoke XP for users (event-sourced)
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User ID */}
            <div>
              <label htmlFor="userId" className="block text-sm font-semibold text-gray-700 mb-2">
                User ID <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="Enter user UUID"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* XP Amount */}
            <div>
              <label htmlFor="xpAmount" className="block text-sm font-semibold text-gray-700 mb-2">
                XP Amount <span className="text-red-500">*</span>
                <span className="text-xs text-gray-500 font-normal ml-2">
                  (positive to grant, negative to revoke)
                </span>
              </label>
              <div className="relative">
                {parseInt(xpAmount) > 0 ? (
                  <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600" size={20} />
                ) : parseInt(xpAmount) < 0 ? (
                  <Minus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-600" size={20} />
                ) : (
                  <Plus className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                )}
                <input
                  id="xpAmount"
                  type="number"
                  value={xpAmount}
                  onChange={(e) => setXpAmount(e.target.value)}
                  placeholder="e.g., 100 or -50"
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Reason */}
            <div>
              <label htmlFor="reason" className="block text-sm font-semibold text-gray-700 mb-2">
                Reason (optional)
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for this XP adjustment..."
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="text-red-600 font-semibold">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 font-semibold">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !userId.trim() || !xpAmount.trim()}
              className="w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Shield size={20} />
                  <span>{parseInt(xpAmount) > 0 ? 'Grant XP' : parseInt(xpAmount) < 0 ? 'Revoke XP' : 'Submit'}</span>
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> XP changes are event-sourced through the <code className="bg-blue-100 px-1 rounded">xp_events</code> table. 
              The <code className="bg-blue-100 px-1 rounded">profiles</code> table is automatically updated by database triggers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminXpPanel;

