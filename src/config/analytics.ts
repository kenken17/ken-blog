import { SITE_URL } from './seo';

export interface AnalyticsConfig {
  enabled: boolean;
  measurementId: string;
  domain: string;
  trackingMode: 'cookieless';
  scriptSrc: string;
}

export const analyticsConfig: AnalyticsConfig = {
  enabled: import.meta.env.PROD === true,
  measurementId: import.meta.env.PUBLIC_ANALYTICS_ID ?? '',
  domain: SITE_URL.replace(/^https?:\/\//, ''),
  trackingMode: 'cookieless',
  scriptSrc: 'https://plausible.io/js/script.js',
};
