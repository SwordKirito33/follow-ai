/**
 * Task Filter Utilities
 */

export type TaskFilterType = 'all' | 'xp' | 'paid';
export type TaskFilterLevel = 'all' | 'available';
export type TaskFilterStatus = 'all' | 'open' | 'in_progress';
export type TaskSortOption = 'newest' | 'reward_high' | 'level_low';

export interface TaskFilters {
  type: TaskFilterType;
  level: TaskFilterLevel;
  status: TaskFilterStatus;
  sort: TaskSortOption;
}

export interface Task {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  task_type: 'xp_challenge' | 'bounty' | 'hire';
  reward_xp: number;
  reward_amount_cents: number;
  currency: string;
  min_level: number;
  status: 'draft' | 'active' | 'closed' | 'archived';
  created_at: string;
}

/**
 * Filter tasks based on criteria
 */
export function filterTasks(
  tasks: Task[],
  filters: TaskFilters,
  userLevel: number
): Task[] {
  let filtered = [...tasks];

  // Filter by type
  if (filters.type === 'xp') {
    filtered = filtered.filter(t => t.task_type === 'xp_challenge');
  } else if (filters.type === 'paid') {
    filtered = filtered.filter(t => t.task_type === 'bounty' || t.task_type === 'hire');
  }

  // Filter by level
  if (filters.level === 'available') {
    filtered = filtered.filter(t => t.min_level <= userLevel);
  }

  // Filter by status
  if (filters.status === 'open') {
    filtered = filtered.filter(t => t.status === 'active');
  } else if (filters.status === 'in_progress') {
    filtered = filtered.filter(t => t.status === 'active');
  }

  // Sort
  switch (filters.sort) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      break;
    case 'reward_high':
      filtered.sort((a, b) => {
        const aReward = a.reward_xp || (a.reward_amount_cents / 100);
        const bReward = b.reward_xp || (b.reward_amount_cents / 100);
        return bReward - aReward;
      });
      break;
    case 'level_low':
      filtered.sort((a, b) => a.min_level - b.min_level);
      break;
  }

  return filtered;
}

/**
 * Check if user can apply to task
 */
export function canApplyToTask(task: Task, userLevel: number): { can: boolean; reason?: string } {
  if (task.status !== 'active') {
    return { can: false, reason: 'Task is not open' };
  }

  if (userLevel < task.min_level) {
    return { can: false, reason: `You need Level ${task.min_level} to apply` };
  }

  return { can: true };
}

