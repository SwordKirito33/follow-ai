import { useState, useEffect } from 'react';
import { Link2, Copy, Check, Plus, Calendar, Users } from 'lucide-react';
import { createInvitation, getUserInvitations, Invitation } from '../services/invitationService';
import { useAuth } from '../contexts/AuthContext';

export default function InviteManagement() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadInvitations();
    }
  }, [user]);

  const loadInvitations = async () => {
    if (!user) return;
    
    try {
      const data = await getUserInvitations(user.id);
      setInvitations(data);
    } catch (error) {
      console.error('Failed to load invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateInvitation = async () => {
    if (!user) return;

    setCreating(true);
    try {
      const { invitation, inviteUrl } = await createInvitation(user.id, {
        expiresInDays: 30,
      });

      setInvitations([invitation, ...invitations]);
      
      // 自动复制链接
      await navigator.clipboard.writeText(inviteUrl);
      setCopiedCode(invitation.code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to create invitation:', error);
      alert('Failed to create invitation');
    } finally {
      setCreating(false);
    }
  };

  const copyInviteUrl = async (code: string) => {
    const url = `${window.location.origin}/invite/${code}`;
    await navigator.clipboard.writeText(url);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-accent-gold/20 text-yellow-800';
      case 'accepted':
        return 'bg-accent-green/20 text-green-800';
      case 'expired':
        return 'bg-slate-800/50/10 text-gray-200';
      default:
        return 'bg-slate-800/50/10 text-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-800/50/5 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-slate-800/50 rounded-2xl p-8 mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Invitation Management
              </h1>
              <p className="text-gray-400">
                Create and track invitation links for your products
              </p>
            </div>
            <button
              onClick={handleCreateInvitation}
              disabled={creating}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 mr-2" />
                  Create Invite
                </>
              )}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-purple-50 rounded-xl p-4">
              <div className="text-primary-purple text-sm font-semibold mb-1">
                Total Invites
              </div>
              <div className="text-2xl font-bold text-white">
                {invitations.length}
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-accent-green text-sm font-semibold mb-1">
                Accepted
              </div>
              <div className="text-2xl font-bold text-white">
                {invitations.filter(i => i.status === 'accepted').length}
              </div>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4">
              <div className="text-accent-gold text-sm font-semibold mb-1">
                Pending
              </div>
              <div className="text-2xl font-bold text-white">
                {invitations.filter(i => i.status === 'pending').length}
              </div>
            </div>
          </div>
        </div>

        {/* Invitations List */}
        <div className="bg-slate-800/50 rounded-2xl shadow-sm overflow-hidden">
          {invitations.length === 0 ? (
            <div className="text-center py-12">
              <Link2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                No invitations yet
              </h3>
              <p className="text-gray-400 mb-6">
                Create your first invitation link to start inviting testers
              </p>
              <button
                onClick={handleCreateInvitation}
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create First Invite
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {invitations.map((invitation) => (
                <div key={invitation.id} className="p-6 hover:bg-slate-800/50/5 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="px-3 py-1 bg-slate-800/50/10 rounded-lg font-mono text-sm font-semibold text-white">
                          {invitation.code}
                        </code>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(invitation.status)}`}>
                          {invitation.status}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Created {new Date(invitation.created_at).toLocaleDateString()}
                        </div>
                        {invitation.accepted_at && (
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            Accepted {new Date(invitation.accepted_at).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => copyInviteUrl(invitation.code)}
                      className="flex items-center px-4 py-2 bg-slate-800/50/10 hover:bg-slate-800/50/10 rounded-lg transition-colors"
                    >
                      {copiedCode === invitation.code ? (
                        <>
                          <Check className="w-4 h-4 mr-2 text-accent-green" />
                          <span className="text-accent-green font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          <span>Copy Link</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
