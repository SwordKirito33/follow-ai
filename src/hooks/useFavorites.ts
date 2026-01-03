import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface UseFavoritesOptions {
  type: 'task' | 'tool' | 'review';
}

export const useFavorites = (options: UseFavoritesOptions) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch favorites from database
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // For now, use localStorage as fallback
      // In production, this would be a Supabase query
      const stored = localStorage.getItem(`follow-ai-favorites-${options.type}-${user.id}`);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user, options.type]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // Check if an item is favorited
  const isFavorite = useCallback(
    (itemId: string) => favorites.includes(itemId),
    [favorites]
  );

  // Toggle favorite status
  const toggleFavorite = useCallback(
    async (itemId: string) => {
      if (!user) return;

      const newFavorites = isFavorite(itemId)
        ? favorites.filter((id) => id !== itemId)
        : [...favorites, itemId];

      setFavorites(newFavorites);

      // Save to localStorage (in production, save to Supabase)
      localStorage.setItem(
        `follow-ai-favorites-${options.type}-${user.id}`,
        JSON.stringify(newFavorites)
      );

      // In production, sync with database
      // try {
      //   if (isFavorite(itemId)) {
      //     await supabase
      //       .from('favorites')
      //       .delete()
      //       .eq('user_id', user.id)
      //       .eq('item_id', itemId)
      //       .eq('type', options.type);
      //   } else {
      //     await supabase
      //       .from('favorites')
      //       .insert({ user_id: user.id, item_id: itemId, type: options.type });
      //   }
      // } catch (error) {
      //   console.error('Failed to sync favorite:', error);
      //   // Rollback on error
      //   setFavorites(favorites);
      // }
    },
    [user, favorites, isFavorite, options.type]
  );

  // Add to favorites
  const addFavorite = useCallback(
    async (itemId: string) => {
      if (!isFavorite(itemId)) {
        await toggleFavorite(itemId);
      }
    },
    [isFavorite, toggleFavorite]
  );

  // Remove from favorites
  const removeFavorite = useCallback(
    async (itemId: string) => {
      if (isFavorite(itemId)) {
        await toggleFavorite(itemId);
      }
    },
    [isFavorite, toggleFavorite]
  );

  // Clear all favorites
  const clearFavorites = useCallback(async () => {
    if (!user) return;

    setFavorites([]);
    localStorage.removeItem(`follow-ai-favorites-${options.type}-${user.id}`);
  }, [user, options.type]);

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    addFavorite,
    removeFavorite,
    clearFavorites,
    refetch: fetchFavorites,
  };
};

export default useFavorites;
