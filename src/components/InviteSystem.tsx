import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Copy, 
  Check, 
  Gift, 
  Share2, 
  Mail, 
  MessageCircle,
  Twitter,
  Linkedin,
  QrCode
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

interface InviteStats {
  totalInvites: number;
  successfulInvites: number;
  pendingInvites: number;
  totalRewards: number;
}

const InviteSystem: React.FC = () => {
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState<InviteStats>({
    totalInvites: 0,
    successfulInvites: 0,
    pendingInvites: 0,
    totalRewards: 0,
  });
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (user) {
      // Generate invite code from user ID
      const code = `FOLLOW-${user.id.slice(0, 8).toUpperCase()}`;
      setInviteCode(code);
      
      // Fetch invite stats
      fetchInviteStats();
    }
  }, [user]);

  const fetchInviteStats = async () => {
    if (!user) return;

    try {
      // This would be a real API call in production
      // For now, using mock data
      setStats({
        totalInvites: 12,
        successfulInvites: 8,
        pendingInvites: 4,
        totalRewards: 800,
      });
    } catch (error) {
      console.error('Failed to fetch invite stats:', error);
    }
  };

  const inviteUrl = `https://follow-ai.com/?ref=${inviteCode}`;

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareVia = (platform: string) => {
    const message = `Join me on Follow-ai and earn rewards by testing AI tools! Use my invite code: ${inviteCode}`;
    const encodedMessage = encodeURIComponent(message);
    const encodedUrl = encodeURIComponent(inviteUrl);

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      email: `mailto:?subject=Join Follow-ai&body=${encodedMessage}%0A%0A${encodedUrl}`,
      whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  return (
    <div className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-blue to-primary-purple p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-slate-800/50/20 rounded-xl flex items-center justify-center">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Invite Friends</h2>
            <p className="text-sm text-white/80">Earn 100 XP for each friend who joins</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.successfulInvites}</p>
            <p className="text-xs text-white/70">Joined</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.pendingInvites}</p>
            <p className="text-xs text-white/70">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{stats.totalRewards}</p>
            <p className="text-xs text-white/70">XP Earned</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Invite Code */}
        <div>
          <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
            Your Invite Code
          </label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 bg-slate-800/50/10 dark:bg-gray-800 rounded-lg font-mono text-lg font-bold text-white dark:text-white">
              {inviteCode}
            </div>
            <button
              onClick={() => copyToClipboard(inviteCode)}
              className="px-4 py-3 bg-gradient-to-r from-primary-cyan to-primary-blue text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Invite Link */}
        <div>
          <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
            Invite Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteUrl}
              readOnly
              className="flex-1 px-4 py-3 bg-slate-800/50/10 dark:bg-gray-800 rounded-lg text-sm text-gray-300 dark:text-gray-300 truncate"
            />
            <button
              onClick={() => copyToClipboard(inviteUrl)}
              className="px-4 py-3 border border-white/20 dark:border-gray-600 rounded-lg hover:bg-slate-800/50/5 dark:hover:bg-gray-800 transition-colors"
            >
              <Copy className="w-5 h-5 text-gray-400 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Share Buttons */}
        <div>
          <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-3">
            Share via
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => shareVia('twitter')}
              className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Twitter className="w-4 h-4" />
              Twitter
            </button>
            <button
              onClick={() => shareVia('linkedin')}
              className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </button>
            <button
              onClick={() => shareVia('whatsapp')}
              className="flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
            <button
              onClick={() => shareVia('email')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              Email
            </button>
          </div>
        </div>

        {/* Rewards Info */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4">
          <h3 className="font-semibold text-white dark:text-white mb-2 flex items-center gap-2">
            <Gift className="w-5 h-5 text-accent-gold" />
            Rewards
          </h3>
          <ul className="space-y-2 text-sm text-gray-400 dark:text-gray-400">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>You get <strong>100 XP</strong> when your friend signs up</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Your friend gets <strong>50 XP</strong> bonus on signup</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-500" />
              <span>Earn <strong>10% bonus</strong> on their first purchase</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default InviteSystem;
