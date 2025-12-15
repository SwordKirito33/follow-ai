/**
 * Analytics event tracking for Follow.ai
 * 
 * Structured to easily integrate with Segment, PostHog, Mixpanel, etc.
 */

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
  // In production, integrate with your analytics provider
  // For now, we'll log to console in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', event, properties);
  }

  // Example integration points:
  // - Segment: analytics.track(event, properties)
  // - PostHog: posthog.capture(event, properties)
  // - Mixpanel: mixpanel.track(event, properties)
  
  // You can also send to your backend API
  // fetch('/api/analytics', { method: 'POST', body: JSON.stringify({ event, properties }) })
}

/**
 * Identify a user
 */
export function identifyUser(userId: string, traits?: Record<string, any>): void {
  if (import.meta.env.DEV) {
    console.log('[Analytics] Identify', userId, traits);
  }
  
  // Example: analytics.identify(userId, traits)
}

/**
 * Track page views
 */
export function trackPageView(path: string, properties?: AnalyticsProperties): void {
  trackEvent('page_viewed' as AnalyticsEvent, { path, ...properties });
}

