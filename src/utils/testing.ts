// Testing Utilities for Follow.ai
// Tools for testing, mocking, and generating test data

// ============================================
// Types
// ============================================

interface MockUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  level: number;
  totalXp: number;
  createdAt: Date;
}

interface MockTask {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  status: 'available' | 'in_progress' | 'completed' | 'locked';
  deadline?: Date;
}

interface MockTransaction {
  id: string;
  userId: string;
  type: 'purchase' | 'reward' | 'refund' | 'transfer';
  amount: number;
  xpAmount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

interface MockTool {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  pricing: 'free' | 'freemium' | 'paid';
  url: string;
  logo?: string;
}

// ============================================
// Random Data Generators
// ============================================

/**
 * Generate a random string
 */
export function randomString(length: number = 10): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random number in range
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random UUID
 */
export function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Generate a random date within range
 */
export function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Pick a random item from array
 */
export function randomPick<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick multiple random items from array
 */
export function randomPickMultiple<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// ============================================
// Mock Data Generators
// ============================================

const firstNames = ['张', '李', '王', '刘', '陈', '杨', '黄', '赵', '周', '吴'];
const lastNames = ['伟', '芳', '娜', '敏', '静', '丽', '强', '磊', '洋', '艳'];
const categories = ['AI写作', 'AI绘画', 'AI编程', 'AI视频', 'AI音频', 'AI翻译'];
const difficulties: Array<'beginner' | 'intermediate' | 'advanced'> = ['beginner', 'intermediate', 'advanced'];
const taskStatuses: Array<'available' | 'in_progress' | 'completed' | 'locked'> = ['available', 'in_progress', 'completed', 'locked'];
const transactionTypes: Array<'purchase' | 'reward' | 'refund' | 'transfer'> = ['purchase', 'reward', 'refund', 'transfer'];
const transactionStatuses: Array<'pending' | 'completed' | 'failed'> = ['pending', 'completed', 'failed'];
const pricingTypes: Array<'free' | 'freemium' | 'paid'> = ['free', 'freemium', 'paid'];

/**
 * Generate a mock user
 */
export function generateMockUser(overrides: Partial<MockUser> = {}): MockUser {
  const firstName = randomPick(firstNames);
  const lastName = randomPick(lastNames);
  const username = `user_${randomString(6)}`;
  
  return {
    id: randomUUID(),
    email: `${username}@example.com`,
    username,
    displayName: `${firstName}${lastName}`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    level: randomNumber(1, 50),
    totalXp: randomNumber(0, 50000),
    createdAt: randomDate(new Date('2024-01-01'), new Date()),
    ...overrides,
  };
}

/**
 * Generate multiple mock users
 */
export function generateMockUsers(count: number): MockUser[] {
  return Array.from({ length: count }, () => generateMockUser());
}

/**
 * Generate a mock task
 */
export function generateMockTask(overrides: Partial<MockTask> = {}): MockTask {
  const difficulty = randomPick(difficulties);
  const xpRewards = { beginner: 50, intermediate: 100, advanced: 200 };
  
  return {
    id: randomUUID(),
    title: `完成${randomPick(categories)}任务`,
    description: `这是一个${difficulty === 'beginner' ? '入门' : difficulty === 'intermediate' ? '中级' : '高级'}难度的任务，完成后可获得XP奖励。`,
    category: randomPick(categories),
    difficulty,
    xpReward: xpRewards[difficulty],
    status: randomPick(taskStatuses),
    deadline: Math.random() > 0.5 ? randomDate(new Date(), new Date('2025-12-31')) : undefined,
    ...overrides,
  };
}

/**
 * Generate multiple mock tasks
 */
export function generateMockTasks(count: number): MockTask[] {
  return Array.from({ length: count }, () => generateMockTask());
}

/**
 * Generate a mock transaction
 */
export function generateMockTransaction(overrides: Partial<MockTransaction> = {}): MockTransaction {
  const type = randomPick(transactionTypes);
  const amount = type === 'purchase' ? randomNumber(10, 200) : randomNumber(0, 50);
  
  return {
    id: randomUUID(),
    userId: randomUUID(),
    type,
    amount,
    xpAmount: amount * 10,
    status: randomPick(transactionStatuses),
    createdAt: randomDate(new Date('2024-01-01'), new Date()),
    ...overrides,
  };
}

/**
 * Generate multiple mock transactions
 */
export function generateMockTransactions(count: number): MockTransaction[] {
  return Array.from({ length: count }, () => generateMockTransaction());
}

/**
 * Generate a mock tool
 */
export function generateMockTool(overrides: Partial<MockTool> = {}): MockTool {
  const toolNames = [
    'ChatGPT', 'Claude', 'Midjourney', 'DALL-E', 'Stable Diffusion',
    'GitHub Copilot', 'Cursor', 'Notion AI', 'Jasper', 'Copy.ai'
  ];
  const name = randomPick(toolNames);
  
  return {
    id: randomUUID(),
    name,
    description: `${name}是一款强大的AI工具，可以帮助用户提高工作效率。`,
    category: randomPick(categories),
    rating: Math.round((3 + Math.random() * 2) * 10) / 10,
    reviewCount: randomNumber(10, 10000),
    pricing: randomPick(pricingTypes),
    url: `https://example.com/${name.toLowerCase().replace(/\s/g, '-')}`,
    logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
    ...overrides,
  };
}

/**
 * Generate multiple mock tools
 */
export function generateMockTools(count: number): MockTool[] {
  return Array.from({ length: count }, () => generateMockTool());
}

// ============================================
// Test Helpers
// ============================================

/**
 * Wait for a specified time
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wait for condition to be true
 */
export async function waitFor(
  condition: () => boolean | Promise<boolean>,
  options: { timeout?: number; interval?: number } = {}
): Promise<void> {
  const { timeout = 5000, interval = 100 } = options;
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    if (await condition()) {
      return;
    }
    await wait(interval);
  }

  throw new Error('Timeout waiting for condition');
}

/**
 * Retry a function until it succeeds
 */
export async function retry<T>(
  fn: () => T | Promise<T>,
  options: { retries?: number; delay?: number } = {}
): Promise<T> {
  const { retries = 3, delay = 1000 } = options;
  let lastError: Error | null = null;

  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < retries - 1) {
        await wait(delay);
      }
    }
  }

  throw lastError;
}

// ============================================
// Mock Functions
// ============================================

/**
 * Create a mock function
 */
export function createMockFn<T extends (...args: Parameters<T>) => ReturnType<T>>(): T & {
  calls: Parameters<T>[];
  mockReturnValue: (value: ReturnType<T>) => void;
  mockImplementation: (impl: T) => void;
  mockClear: () => void;
} {
  let returnValue: ReturnType<T> | undefined;
  let implementation: T | undefined;
  const calls: Parameters<T>[] = [];

  const mockFn = function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    calls.push(args);
    if (implementation) {
      return implementation.apply(this, args);
    }
    return returnValue as ReturnType<T>;
  } as T & {
    calls: Parameters<T>[];
    mockReturnValue: (value: ReturnType<T>) => void;
    mockImplementation: (impl: T) => void;
    mockClear: () => void;
  };

  mockFn.calls = calls;
  mockFn.mockReturnValue = (value: ReturnType<T>) => {
    returnValue = value;
  };
  mockFn.mockImplementation = (impl: T) => {
    implementation = impl;
  };
  mockFn.mockClear = () => {
    calls.length = 0;
  };

  return mockFn;
}

/**
 * Create a spy on an object method
 */
export function spyOn<T extends object, K extends keyof T>(
  obj: T,
  method: K
): T[K] & { restore: () => void; calls: unknown[][] } {
  const original = obj[method];
  const calls: unknown[][] = [];

  const spy = function (this: unknown, ...args: unknown[]) {
    calls.push(args);
    if (typeof original === 'function') {
      return original.apply(this, args);
    }
  } as T[K] & { restore: () => void; calls: unknown[][] };

  spy.restore = () => {
    obj[method] = original;
  };
  spy.calls = calls;

  obj[method] = spy;
  return spy;
}

// ============================================
// Snapshot Testing Helper
// ============================================

/**
 * Create a snapshot of data for comparison
 */
export function createSnapshot<T>(data: T): string {
  return JSON.stringify(data, null, 2);
}

/**
 * Compare two snapshots
 */
export function compareSnapshots(a: string, b: string): boolean {
  return a === b;
}

// ============================================
// Export All
// ============================================

export default {
  // Random generators
  randomString,
  randomNumber,
  randomUUID,
  randomDate,
  randomPick,
  randomPickMultiple,
  // Mock data generators
  generateMockUser,
  generateMockUsers,
  generateMockTask,
  generateMockTasks,
  generateMockTransaction,
  generateMockTransactions,
  generateMockTool,
  generateMockTools,
  // Test helpers
  wait,
  waitFor,
  retry,
  // Mock functions
  createMockFn,
  spyOn,
  // Snapshot
  createSnapshot,
  compareSnapshots,
};
