/**
 * Task Validation Utilities
 */

export interface TaskValidationResult {
  valid: boolean;
  errors: string[];
}

export interface TaskFormData {
  title: string;
  description: string;
  requirements: string;
  taskType: 'xp' | 'paid';
  xpReward?: number;
  paymentAmount?: number;
}

/**
 * Validate task form data
 */
export function validateTaskForm(data: TaskFormData, userLevel: number, walletBalance: number): TaskValidationResult {
  const errors: string[] = [];

  // Title validation
  if (!data.title || data.title.trim().length === 0) {
    errors.push('Task title is required');
  } else if (data.title.length > 100) {
    errors.push('Task title must be 100 characters or less');
  }

  // Description validation
  if (!data.description || data.description.trim().length === 0) {
    errors.push('Task description is required');
  }

  // Requirements validation
  if (!data.requirements || data.requirements.trim().length === 0) {
    errors.push('Task requirements are required');
  }

  // Task type specific validation
  if (data.taskType === 'xp') {
    if (!data.xpReward || data.xpReward < 10 || data.xpReward > 1000) {
      errors.push('XP reward must be between 10 and 1000 XP');
    }
    if (walletBalance < (data.xpReward || 0)) {
      errors.push(`Insufficient wallet balance. You need ${data.xpReward} XP but only have ${walletBalance} XP`);
    }
  } else if (data.taskType === 'paid') {
    if (!data.paymentAmount || data.paymentAmount < 10 || data.paymentAmount > 10000) {
      errors.push('Payment amount must be between $10 and $10,000 USD');
    }

    // Level requirements for paid tasks
    if (data.paymentAmount && data.paymentAmount < 50) {
      if (userLevel < 5) {
        errors.push('You need Level 5 to post tasks under $50');
      }
    } else if (data.paymentAmount && data.paymentAmount < 200) {
      if (userLevel < 10) {
        errors.push('You need Level 10 to post tasks between $50 and $200');
      }
    } else if (data.paymentAmount && data.paymentAmount >= 200) {
      if (userLevel < 15) {
        errors.push('You need Level 15 to post tasks over $200');
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get minimum level required for a payment amount
 */
export function getMinLevelForPayment(amount: number): number {
  if (amount < 50) return 5;
  if (amount < 200) return 10;
  return 15;
}

