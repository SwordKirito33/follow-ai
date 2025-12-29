import React, { useState } from 'react';
import AdminXpPanel from '@/components/AdminXpPanel';

const AdminXpPanelPage: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen">
      <AdminXpPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default AdminXpPanelPage;

