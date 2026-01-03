import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, Twitter, Facebook, Linkedin, Mail, Link2, QrCode, Download } from 'lucide-react';

interface ShareContent {
  title: string;
  description: string;
  url: string;
  image?: string;
  hashtags?: string[];
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ShareContent;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, content }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareOptions = [
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-[#1DA1F2] hover:bg-[#1a8cd8]',
      onClick: () => {
        const text = encodeURIComponent(`${content.title}\n\n${content.description}`);
        const url = encodeURIComponent(content.url);
        const hashtags = content.hashtags?.join(',') || '';
        window.open(
          `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=${hashtags}`,
          '_blank'
        );
      },
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-[#4267B2] hover:bg-[#365899]',
      onClick: () => {
        const url = encodeURIComponent(content.url);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
      },
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-[#0077B5] hover:bg-[#006399]',
      onClick: () => {
        const url = encodeURIComponent(content.url);
        const title = encodeURIComponent(content.title);
        const summary = encodeURIComponent(content.description);
        window.open(
          `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${title}&summary=${summary}`,
          '_blank'
        );
      },
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-gray-600 hover:bg-gray-700',
      onClick: () => {
        const subject = encodeURIComponent(content.title);
        const body = encodeURIComponent(`${content.description}\n\n${content.url}`);
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
      },
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateQRCode = () => {
    // Using QR code API
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(content.url)}`;
  };

  const downloadQRCode = async () => {
    const qrUrl = generateQRCode();
    const response = await fetch(qrUrl);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qr-code.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.description,
          url: content.url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Share
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content preview */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex gap-4">
                {content.image && (
                  <img
                    src={content.image}
                    alt={content.title}
                    className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {content.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                    {content.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Share options */}
            <div className="p-6">
              {/* Social buttons */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={option.onClick}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl text-white transition-colors ${option.color}`}
                  >
                    {option.icon}
                    <span className="text-xs">{option.name}</span>
                  </button>
                ))}
              </div>

              {/* Native share (mobile) */}
              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  onClick={nativeShare}
                  className="w-full mb-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all"
                >
                  <Share2 className="w-5 h-5" />
                  Share via...
                </button>
              )}

              {/* Copy link */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl">
                  <Link2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={content.url}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-300 outline-none truncate"
                  />
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`px-4 py-3 rounded-xl font-medium flex items-center gap-2 transition-colors ${
                    copied
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/50'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>

              {/* QR Code toggle */}
              <button
                onClick={() => setShowQR(!showQR)}
                className="w-full mt-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl font-medium text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <QrCode className="w-5 h-5" />
                {showQR ? 'Hide QR Code' : 'Show QR Code'}
              </button>

              {/* QR Code */}
              <AnimatePresence>
                {showQR && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 overflow-hidden"
                  >
                    <div className="p-6 bg-white rounded-xl border-2 border-gray-200 dark:border-gray-700 flex flex-col items-center">
                      <img
                        src={generateQRCode()}
                        alt="QR Code"
                        className="w-48 h-48"
                      />
                      <p className="text-sm text-gray-500 mt-3">
                        Scan to open link
                      </p>
                      <button
                        onClick={downloadQRCode}
                        className="mt-3 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download QR
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Share button component
export const ShareButton: React.FC<{
  content: ShareContent;
  className?: string;
  variant?: 'default' | 'icon' | 'text';
}> = ({ content, className = '', variant = 'default' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const buttonContent = () => {
    switch (variant) {
      case 'icon':
        return <Share2 className="w-5 h-5" />;
      case 'text':
        return 'Share';
      default:
        return (
          <>
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </>
        );
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${className}`}
      >
        {buttonContent()}
      </button>
      <ShareModal isOpen={isOpen} onClose={() => setIsOpen(false)} content={content} />
    </>
  );
};

export default ShareModal;
