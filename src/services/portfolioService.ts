import { supabase } from '@/lib/supabase';
import { profileService } from './profileService';
import type { Database } from '@/types/database';

type PortfolioItem = Database['public']['Tables']['portfolio_items']['Row'];
type PortfolioItemInsert = Database['public']['Tables']['portfolio_items']['Insert'];

export const portfolioService = {
  async getPortfolio(userId: string): Promise<PortfolioItem[]> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createItem(params: {
    userId: string;
    title: string;
    description?: string;
    imageUrl?: string;
    link?: string;
  }): Promise<PortfolioItem> {
    const itemData: PortfolioItemInsert = {
      user_id: params.userId,
      title: params.title,
      description: params.description || null,
      image_url: params.imageUrl || null,
      link: params.link || null,
    };

    const { data, error } = await supabase
      .from('portfolio_items')
      .insert(itemData)
      .select()
      .single();

    if (error) throw error;

    await profileService.recalculateProfileCompletion(params.userId);

    return data;
  },

  async deleteItem(itemId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from('portfolio_items')
      .delete()
      .eq('id', itemId)
      .eq('user_id', userId);

    if (error) throw error;

    await profileService.recalculateProfileCompletion(userId);
  },

  async updateItem(
    itemId: string,
    userId: string,
    updates: Partial<PortfolioItemInsert>
  ): Promise<PortfolioItem> {
    const { data, error } = await supabase
      .from('portfolio_items')
      .update(updates)
      .eq('id', itemId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

