export interface AnalyticsEventProps {
  [key: string]: string | number | boolean;
}

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props: AnalyticsEventProps }) => void;
  }
}

export function trackEvent(eventName: string, props?: AnalyticsEventProps): void {
  if (typeof window === 'undefined') return;
  if (typeof window.plausible !== 'function') return;
  try {
    window.plausible(eventName, { props: props ?? {} });
  } catch {
    return;
  }
}
