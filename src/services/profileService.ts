import { supabase } from '@/lib/supabase';
import { PROFILE_COMPLETION_WEIGHTS, MIN_BIO_LENGTH, MAX_SKILLS, MAX_AI_TOOLS } from '@/lib/constants';
import type { Database } from '@/types/database';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

export const profileService = {
  async getProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, updates: ProfileUpdate): Promise<Profile> {
    if (updates.skills && !Array.isArray(updates.skills)) {
      console.warn('skills must be an array');
      updates.skills = [];
    }
    if (updates.ai_tools && !Array.isArray(updates.ai_tools)) {
      console.warn('ai_tools must be an array');
      updates.ai_tools = [];
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addSkill(userId: string, skillRaw: string): Promise<Profile> {
    const skill = skillRaw.trim();
    if (!skill) throw new Error('Skill cannot be empty');

    const profile = await this.getProfile(userId);
    const skills = Array.isArray(profile.skills) ? profile.skills : [];

    if (skills.length >= MAX_SKILLS) {
      throw new Error(`Maximum ${MAX_SKILLS} skills allowed`);
    }
    if (skills.includes(skill)) {
      throw new Error('Skill already added');
    }

    const updated = await this.updateProfile(userId, {
      skills: [...skills, skill],
    });

    await this.recalculateProfileCompletion(userId);
    return updated;
  },

  async removeSkill(userId: string, skill: string): Promise<Profile> {
    const profile = await this.getProfile(userId);
    const skills = (Array.isArray(profile.skills) ? profile.skills : [])
      .filter(s => s !== skill);

    const updated = await this.updateProfile(userId, { skills });
    await this.recalculateProfileCompletion(userId);
    return updated;
  },

  async addAiTool(userId: string, toolRaw: string): Promise<Profile> {
    const tool = toolRaw.trim();
    if (!tool) throw new Error('Tool cannot be empty');

    const profile = await this.getProfile(userId);
    const tools = Array.isArray(profile.ai_tools) ? profile.ai_tools : [];

    if (tools.length >= MAX_AI_TOOLS) {
      throw new Error(`Maximum ${MAX_AI_TOOLS} AI tools allowed`);
    }
    if (tools.includes(tool)) {
      throw new Error('Tool already added');
    }

    const updated = await this.updateProfile(userId, {
      ai_tools: [...tools, tool],
    });

    await this.recalculateProfileCompletion(userId);
    return updated;
  },

  async removeAiTool(userId: string, tool: string): Promise<Profile> {
    const profile = await this.getProfile(userId);
    const tools = (Array.isArray(profile.ai_tools) ? profile.ai_tools : [])
      .filter(t => t !== tool);

    const updated = await this.updateProfile(userId, { ai_tools: tools });
    await this.recalculateProfileCompletion(userId);
    return updated;
  },

  async recalculateProfileCompletion(userId: string): Promise<number> {
    const profile = await this.getProfile(userId);
    
    const { count: portfolioCount } = await supabase
      .from('portfolio_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    let score = 0;

    if (profile.avatar_url) {
      score += PROFILE_COMPLETION_WEIGHTS.avatar;
    }

    if (profile.bio && profile.bio.trim().length >= MIN_BIO_LENGTH) {
      score += PROFILE_COMPLETION_WEIGHTS.bio;
    }

    const skillsCount = Array.isArray(profile.skills) ? profile.skills.length : 0;
    if (skillsCount >= 3) {
      score += PROFILE_COMPLETION_WEIGHTS.skills;
    }

    const toolsCount = Array.isArray(profile.ai_tools) ? profile.ai_tools.length : 0;
    if (toolsCount >= 3) {
      score += PROFILE_COMPLETION_WEIGHTS.ai_tools;
    }

    if (portfolioCount && portfolioCount >= 1) {
      score += PROFILE_COMPLETION_WEIGHTS.portfolio;
    }

    score = Math.max(0, Math.min(100, score));

    await this.updateProfile(userId, { profile_completion: score });

    return score;
  },
};

