/**
 * API Mutation Hooks Factory
 * Provides type-safe hooks for creating, updating, and deleting data
 */

import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryClient, queryKeys } from '@/lib/queryClient';
import { handleApiError } from '@/lib/errorHandler';
import { toast } from '@/lib/toast';

/**
 * Generic mutation hook with error handling
 */
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'>
): UseMutationResult<TData, Error, TVariables> {
  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onError: (error, variables, context) => {
      handleApiError(error, { variables });
      options?.onError?.(error, variables, context);
    },
    ...options,
  });
}

/**
 * Update user profile
 */
export function useUpdateUserProfile() {
  return useApiMutation(
    async (updates: any) => {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', updates.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
        toast.success('Profile updated successfully');
      },
    }
  );
}

/**
 * Submit task
 */
export function useSubmitTask() {
  return useApiMutation(
    async (submission: any) => {
      const { data, error } = await supabase
        .from('task_submissions')
        .insert([submission])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.task.all });
        toast.success('Task submitted successfully');
      },
    }
  );
}

/**
 * Create task
 */
export function useCreateTask() {
  return useApiMutation(
    async (task: any) => {
      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.task.all });
        toast.success('Task created successfully');
      },
    }
  );
}

/**
 * Update task
 */
export function useUpdateTask() {
  return useApiMutation(
    async (updates: any) => {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', updates.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.task.all });
        toast.success('Task updated successfully');
      },
    }
  );
}

/**
 * Delete task
 */
export function useDeleteTask() {
  return useApiMutation(
    async (taskId: string) => {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      return { id: taskId };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.task.all });
        toast.success('Task deleted successfully');
      },
    }
  );
}

/**
 * Create tool
 */
export function useCreateTool() {
  return useApiMutation(
    async (tool: any) => {
      const { data, error } = await supabase
        .from('tools')
        .insert([tool])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tool.all });
        toast.success('Tool created successfully');
      },
    }
  );
}

/**
 * Update tool
 */
export function useUpdateTool() {
  return useApiMutation(
    async (updates: any) => {
      const { data, error } = await supabase
        .from('tools')
        .update(updates)
        .eq('id', updates.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tool.all });
        toast.success('Tool updated successfully');
      },
    }
  );
}

/**
 * Delete tool
 */
export function useDeleteTool() {
  return useApiMutation(
    async (toolId: string) => {
      const { error } = await supabase
        .from('tools')
        .delete()
        .eq('id', toolId);

      if (error) throw error;
      return { id: toolId };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tool.all });
        toast.success('Tool deleted successfully');
      },
    }
  );
}

/**
 * Submit tool review
 */
export function useSubmitToolReview() {
  return useApiMutation(
    async (review: any) => {
      const { data, error } = await supabase
        .from('tool_reviews')
        .insert([review])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: queryKeys.tool.all });
        toast.success('Review submitted successfully');
      },
    }
  );
}

/**
 * Mark notification as read
 */
export function useMarkNotificationAsRead() {
  return useApiMutation(
    async (notificationId: string) => {
      const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notification.all });
      },
    }
  );
}

/**
 * Delete notification
 */
export function useDeleteNotification() {
  return useApiMutation(
    async (notificationId: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
      return { id: notificationId };
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.notification.all });
      },
    }
  );
}

/**
 * Transfer wallet balance
 */
export function useTransferWallet() {
  return useApiMutation(
    async (transfer: any) => {
      const { data, error } = await supabase
        .rpc('transfer_wallet', {
          from_user_id: transfer.fromUserId,
          to_user_id: transfer.toUserId,
          amount: transfer.amount,
        });

      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.wallet.all });
        toast.success('Transfer completed successfully');
      },
    }
  );
}

/**
 * Grant XP to user
 */
export function useGrantXp() {
  return useApiMutation(
    async (grant: any) => {
      const { data, error } = await supabase
        .rpc('grant_xp', {
          user_id: grant.userId,
          xp_amount: grant.xpAmount,
          reason: grant.reason,
        });

      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
        toast.success('XP granted successfully');
      },
    }
  );
}

/**
 * Admin grant XP
 */
export function useAdminGrantXp() {
  return useApiMutation(
    async (grant: any) => {
      const { data, error } = await supabase
        .rpc('admin_grant_xp', {
          user_id: grant.userId,
          xp_amount: grant.xpAmount,
          reason: grant.reason,
          admin_id: grant.adminId,
        });

      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
        toast.success('XP granted successfully');
      },
    }
  );
}

export default {
  useUpdateUserProfile,
  useSubmitTask,
  useCreateTask,
  useUpdateTask,
  useDeleteTask,
  useCreateTool,
  useUpdateTool,
  useDeleteTool,
  useSubmitToolReview,
  useMarkNotificationAsRead,
  useDeleteNotification,
  useTransferWallet,
  useGrantXp,
  useAdminGrantXp,
};
