import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  CreditCard, 
  Key,
  Mail,
  Smartphone,
  Eye,
  EyeOff,
  Save,
  Trash2,
  LogOut,
  ChevronRight,
  Check
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import LanguageSelector from '@/components/LanguageSelector';
import ThemeToggle from '@/components/ThemeToggle';
import FontSelector from '@/components/FontSelector';
import AvatarUpload from '@/components/AvatarUpload';

type SettingsTab = 'profile' | 'notifications' | 'security' | 'appearance' | 'billing';

const Settings: React.FC = () => {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [profileForm, setProfileForm] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    bio: '',
    website: '',
    twitter: '',
    github: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    levelUpAlerts: true,
    paymentAlerts: true,
    marketingEmails: false,
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: '30',
    loginAlerts: true,
  });

  const tabs = [
    { id: 'profile' as const, label: 'Profile', icon: User },
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'appearance' as const, label: 'Appearance', icon: Palette },
    { id: 'billing' as const, label: 'Billing', icon: CreditCard },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="container max-w-6xl">
        <h1 className="text-3xl font-bold text-white dark:text-white mb-8">Settings</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-slate-800/50 dark:bg-gray-900 rounded-2xl shadow-lg border border-white/10 dark:border-gray-700 p-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-primary-cyan dark:text-blue-400'
                        : 'text-gray-300 dark:text-gray-300 hover:bg-gray-800/5 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-800/50 dark:bg-gray-900 rounded-2xl shadow-lg border border-white/10 dark:border-gray-700 p-6"
            >
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white dark:text-white">Profile Settings</h2>

                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    {user && (
                      <AvatarUpload
                        currentAvatar={user.avatarUrl}
                        userId={user.id}
                        onUploadComplete={(url) => console.log('Avatar updated:', url)}
                        size="lg"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-white dark:text-white">Profile Photo</h3>
                      <p className="text-sm text-gray-400 dark:text-gray-300">
                        Click on the avatar to upload a new photo
                      </p>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={profileForm.displayName}
                        onChange={(e) => setProfileForm({ ...profileForm, displayName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800/5 dark:bg-gray-800 border border-white/10 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800/5 dark:bg-gray-800 border border-white/10 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        value={profileForm.bio}
                        onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-800/5 dark:bg-gray-800 border border-white/10 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={profileForm.website}
                        onChange={(e) => setProfileForm({ ...profileForm, website: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800/5 dark:bg-gray-800 border border-white/10 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                        Twitter
                      </label>
                      <input
                        type="text"
                        value={profileForm.twitter}
                        onChange={(e) => setProfileForm({ ...profileForm, twitter: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-800/5 dark:bg-gray-800 border border-white/10 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="@username"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-cyan to-primary-blue text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <Save size={18} />
                      )}
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white dark:text-white">Notification Preferences</h2>

                  <div className="space-y-4">
                    {Object.entries(notificationSettings).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex items-center justify-between py-3 border-b border-white/10 dark:border-gray-800 last:border-0"
                      >
                        <div>
                          <p className="font-medium text-white dark:text-white">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-400 dark:text-gray-300">
                            Receive notifications for {key.toLowerCase().replace(/([A-Z])/g, ' $1')}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            setNotificationSettings({ ...notificationSettings, [key]: !value })
                          }
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            value ? 'bg-gradient-to-r from-primary-cyan to-primary-blue' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <span
                            className={`absolute top-1 w-4 h-4 bg-slate-800/50 rounded-full transition-transform ${
                              value ? 'left-7' : 'left-1'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white dark:text-white">Security Settings</h2>

                  {/* Change Password */}
                  <div className="p-4 bg-gray-800/5 dark:bg-gray-800 rounded-xl">
                    <h3 className="font-semibold text-white dark:text-white mb-4">Change Password</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-4 py-3 bg-slate-800/50 dark:bg-gray-900 border border-white/10 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-400"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 dark:text-gray-300 mb-2">
                          New Password
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-3 bg-slate-800/50 dark:bg-gray-900 border border-white/10 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <button className="px-4 py-2 bg-gradient-to-r from-primary-cyan to-primary-blue text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                        Update Password
                      </button>
                    </div>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="p-4 bg-gray-800/5 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white dark:text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-400 dark:text-gray-300">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button className="px-4 py-2 border border-white/20 dark:border-gray-600 text-gray-300 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-800/10 dark:hover:bg-gray-700 transition-colors">
                        Enable
                      </button>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                    <h3 className="font-semibold text-red-700 dark:text-red-400 mb-2">Danger Zone</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                      Once you delete your account, there is no going back. Please be certain.
                    </p>
                    <button
                      onClick={handleDeleteAccount}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Trash2 size={18} />
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white dark:text-white">Appearance</h2>

                  <div className="space-y-6">
                    {/* Theme */}
                    <div className="flex items-center justify-between py-3 border-b border-white/10 dark:border-gray-800">
                      <div>
                        <p className="font-medium text-white dark:text-white">Theme</p>
                        <p className="text-sm text-gray-400 dark:text-gray-300">
                          Choose your preferred color scheme
                        </p>
                      </div>
                      <ThemeToggle />
                    </div>

                    {/* Language */}
                    <div className="flex items-center justify-between py-3 border-b border-white/10 dark:border-gray-800">
                      <div>
                        <p className="font-medium text-white dark:text-white">Language</p>
                        <p className="text-sm text-gray-400 dark:text-gray-300">
                          Select your preferred language
                        </p>
                      </div>
                      <LanguageSelector />
                    </div>

                    {/* Font */}
                    <div className="flex items-center justify-between py-3 border-b border-white/10 dark:border-gray-800">
                      <div>
                        <p className="font-medium text-white dark:text-white">Font</p>
                        <p className="text-sm text-gray-400 dark:text-gray-300">
                          Choose your preferred font family
                        </p>
                      </div>
                      <FontSelector />
                    </div>
                  </div>
                </div>
              )}

              {/* Billing Tab */}
              {activeTab === 'billing' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-white dark:text-white">Billing & Payments</h2>

                  <div className="p-4 bg-gray-800/5 dark:bg-gray-800 rounded-xl">
                    <h3 className="font-semibold text-white dark:text-white mb-4">Payment Methods</h3>
                    <p className="text-gray-400 dark:text-gray-300 mb-4">
                      No payment methods added yet.
                    </p>
                    <button className="flex items-center gap-2 px-4 py-2 border border-white/20 dark:border-gray-600 text-gray-300 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-800/10 dark:hover:bg-gray-700 transition-colors">
                      <CreditCard size={18} />
                      Add Payment Method
                    </button>
                  </div>

                  <div className="p-4 bg-gray-800/5 dark:bg-gray-800 rounded-xl">
                    <h3 className="font-semibold text-white dark:text-white mb-4">Billing History</h3>
                    <p className="text-gray-400 dark:text-gray-300">
                      No billing history available.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
