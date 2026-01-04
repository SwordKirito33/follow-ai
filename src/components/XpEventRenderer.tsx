import React, { useState, useEffect } from 'react';
import { useXpQueue } from '@/hooks/useXpQueue';
import { getGamificationConfig, getLevelFromXpWithConfig } from '@/lib/gamification';
import LevelUpModal from '@/components/LevelUpModal';
import XpEarnedToastCard from '@/components/XpEarnedToastCard';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

const XpEventRenderer: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { current } = useXpQueue();
  const [config, setConfig] = useState<any>(null);

  const [levelUp, setLevelUp] = useState({
    isOpen: false,
    newLevel: 1,
    levelName: 'Novice',
    badge: undefined as string | undefined,
    xpGained: 0,
  });

  const [prevXp, setPrevXp] = useState<number | null>(null);
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    getGamificationConfig().then(setConfig);
  }, []);

  useEffect(() => {
    if (!user) {
      setPrevXp(null);
      return;
    }
    const xp = (user.profile as any)?.total_xp ?? 0;
    if (prevXp === null) setPrevXp(xp);
  }, [user]);

  useEffect(() => {
    if (!user || !current || !config || prevXp === null) return;

    const currentXp = (user.profile as any)?.total_xp ?? 0;
    const prevXpCalculated = Math.max(0, currentXp - current.gained);

    const prevLevel = getLevelFromXpWithConfig(prevXpCalculated, config.levels);
    const nextLevel = getLevelFromXpWithConfig(currentXp, config.levels);

    if (nextLevel.current.level > prevLevel.current.level) {
      setLevelUp({
        isOpen: true,
        newLevel: nextLevel.current.level,
        levelName: nextLevel.current.name,
        badge: nextLevel.current.badge,
        xpGained: current.gained,
      });
    }

    setShowCard(true);
    setPrevXp(currentXp);

    const timer = setTimeout(() => setShowCard(false), 3000);
    return () => clearTimeout(timer);
  }, [current, user, config, prevXp]);

  if (!config || !current) return null;

  return (
    <>
      <LevelUpModal
        isOpen={levelUp.isOpen}
        onClose={() => setLevelUp({ ...levelUp, isOpen: false })}
        newLevel={levelUp.newLevel}
        levelName={levelUp.levelName}
        badge={levelUp.badge}
        xpGained={levelUp.xpGained}
      />

      {showCard && (
        <div className="fixed bottom-4 right-4 z-50">
          <XpEarnedToastCard
            gained={current.gained}
            sources={current.sources}
            config={config}
            onClose={() => setShowCard(false)}
          />
        </div>
      )}
    </>
  );
};

export default XpEventRenderer;
