import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { adminGrantXp, listXpEvents } from '@/lib/xp-service';
import { useToast } from './ui/toast';
import { Shield, Plus, Minus, Search, User } from 'lucide-react';
import FollowButton from './ui/follow-button';

interface AdminXpPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminXpPanel: React.FC<AdminXpPanelProps> = ({ isOpen, onClose }) => {
  const { user, refreshProfile } = useAuth();
  const toast = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [userId, setUserId] = useState('');
  const [deltaXp, setDeltaXp] = useState('');
  const [note, setNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminEvents, setAdminEvents] = useState<any[]>([]);

  // Load admin events for a user
  const loadAdminEvents = async (targetUserId: string) => {
    try {
      const events = await listXpEvents(targetUserId, 20);
      const adminOnly = events.filter((e: any) => e.source === 'admin');
      setAdminEvents(adminOnly);
    } catch (err: any) {
      console.error('Failed to load admin events:', err);
    }
  };

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

  // Search users
  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url, total_xp, level')
        .or(`username.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (err: any) {
      console.error('Failed to search users:', err);
      toast.error('Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  // Grant/Revoke XP
  const grantXp = async (targetUserId: string, xpAmount: number) => {
    if (!isAdmin) {
      toast.error('You are not authorized to grant XP');
      return;
    }

    if (!targetUserId || xpAmount === 0) {
      toast.error('Invalid user ID or XP amount');
      return;
    }

    try {
      setLoading(true);

      await adminGrantXp({
        userId: targetUserId,
        deltaXp: xpAmount,
        refType: 'admin_panel',
        note: note || `Admin adjustment: ${xpAmount > 0 ? '+' : ''}${xpAmount} XP`,
        metadata: { admin_id: user?.id, timestamp: new Date().toISOString() },
      });

      toast.success(`Successfully ${xpAmount > 0 ? 'granted' : 'revoked'} ${Math.abs(xpAmount)} XP`);
      
      // Refresh profile if target is self
      if (targetUserId === user?.id) {
        await refreshProfile();
      }

      // Load admin events for this user
      await loadAdminEvents(targetUserId);
      
      // Reset form
      setUserId('');
      setDeltaXp('');
      setNote('');
      setSearchQuery('');
      setSearchResults([]);
    } catch (err: any) {
      console.error('Failed to grant XP:', err);
      toast.error(err.message || 'Failed to grant XP');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  if (checkingAdmin) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
          <Shield size={48} className="mx-auto mb-4 text-red-600" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You do not have admin permissions to access this panel.
          </p>
          <FollowButton onClick={onClose} variant="primary">
            Close
          </FollowButton>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield size={24} className="text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Admin XP Panel</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Search */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search User
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchUsers()}
                  placeholder="Search by username or name..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <FollowButton onClick={searchUsers} variant="secondary" disabled={loading}>
                Search
              </FollowButton>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-4 space-y-2">
                {searchResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={async () => {
                      setUserId(result.id);
                      setSearchQuery(result.username || result.full_name || '');
                      setSearchResults([]);
                      await loadAdminEvents(result.id);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={result.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.id}`}
                        alt={result.full_name || result.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">
                          {result.full_name || result.username || 'User'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Level {result.level || 1} • {result.total_xp || 0} XP
                        </div>
                      </div>
                    </div>
                    <User size={20} className="text-gray-400" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected User */}
          {userId && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Selected User:</div>
              <div className="font-semibold text-gray-900">{searchQuery}</div>
            </div>
          )}

          {/* XP Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              XP Amount (positive to grant, negative to revoke)
            </label>
            <input
              type="number"
              value={deltaXp}
              onChange={(e) => setDeltaXp(e.target.value)}
              placeholder="e.g., 100 or -50"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason for this XP adjustment..."
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <FollowButton
              onClick={() => {
                const amount = parseInt(deltaXp);
                if (userId && amount) {
                  grantXp(userId, amount);
                }
              }}
              variant="primary"
              disabled={!userId || !deltaXp || loading}
              icon={parseInt(deltaXp) > 0 ? Plus : Minus}
            >
              {parseInt(deltaXp) > 0 ? 'Grant XP' : 'Revoke XP'}
            </FollowButton>
            <FollowButton onClick={onClose} variant="secondary">
              Cancel
            </FollowButton>
          </div>

          {/* Admin Events History */}
          {userId && adminEvents.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Admin Actions</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {adminEvents.map((event: any) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm"
                  >
                    <div>
                      <div className="font-semibold text-gray-900">
                        {event.amount > 0 ? '+' : ''}{event.amount} XP
                      </div>
                      {event.reason && (
                        <div className="text-gray-600 text-xs mt-1">{event.reason}</div>
                      )}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(event.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminXpPanel;

