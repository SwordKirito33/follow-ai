/**
 * Analytics event tracking for Follow.ai
 * Integrated with PostHog for user behavior analysis
 */

import posthog from 'posthog-js';

/**
 * Analytics configuration
 */
export interface AnalyticsConfig {
  apiKey: string;
  apiHost?: string;
  autocapture?: boolean;
  capturePageview?: boolean;
}

/**
 * Initialize analytics
 */
export function initAnalytics(config: AnalyticsConfig) {
  if (typeof window === 'undefined') return;
  
  const {
    apiKey,
    apiHost = 'https://app.posthog.com',
    autocapture = true,
    capturePageview = true,
  } = config;
  
  posthog.init(apiKey, {
    api_host: apiHost,
    autocapture,
    capture_pageview: capturePageview,
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        posthog.debug();
      }
    },
  });
}

export type AnalyticsEvent =
  | 'output_submitted'
  | 'output_verified'
  | 'bounty_viewed'
  | 'bounty_applied'
  | 'hire_task_created'
  | 'hire_task_viewed'
  | 'hire_application_submitted'
  | 'onboarding_step_completed'
  | 'onboarding_completed'
  | 'profile_updated'
  | 'portfolio_item_added'
  | 'xp_earned'
  | 'level_up'
  | 'command_palette_used'
  | 'command_palette_navigated'
  | 'task_filtered'
  | 'tool_searched'
  | 'skill_added'
  | 'ai_tool_added';

export interface AnalyticsProperties {
  [key: string]: any;
}

/**
 * Track an analytics event
 */
export function trackEvent(event: AnalyticsEvent, properties?: AnalyticsProperties): void {
  if (typeof window === 'undefined') return;
  
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', event, properties);
  }

  // Send to PostHog
  posthog.capture(event, properties);
}

/**
 * Identify a user
 */
export function identifyUser(userId: string, traits?: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  
  if (import.meta.env.DEV) {
    console.log('[Analytics] Identify', userId, traits);
  }
  
  // Send to PostHog
  posthog.identify(userId, traits);
}

/**
 * Reset user identity
 */
export function resetUser(): void {
  if (typeof window === 'undefined') return;
  posthog.reset();
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>): void {
  if (typeof window === 'undefined') return;
  posthog.people.set(properties);
}

/**
 * Track page views
 */
export function trackPageView(path: string, properties?: AnalyticsProperties): void {
  trackEvent('page_viewed' as AnalyticsEvent, { path, ...properties });
}

