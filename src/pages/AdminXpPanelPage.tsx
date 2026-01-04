import React, { useState } from 'react';
import AdminXpPanel from '@/components/AdminXpPanel';
import { useLanguage } from '@/contexts/LanguageContext';

const AdminXpPanelPage: React.FC = () => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen">
      <AdminXpPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default AdminXpPanelPage;

