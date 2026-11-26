import { ATTRIBUTION_LINKS } from '@/lib/attributionLinks.mjs';

// App Configuration
// Set IS_APP_LIVE to true when app is available on App Store
// Set IS_APP_LIVE to false to show waitlist instead
export const APP_CONFIG = {
  IS_APP_LIVE: true, // Change this to true when app is live
  
  // App Store link (when app is live)
  APP_STORE_URL: "https://apps.apple.com/us/app/spool-screen-time-control/id6749428484",

  // Public Android download; keep the iOS campaign fallback independent.
  GOOGLE_PLAY_URL: "https://play.google.com/store/apps/details?id=com.spool.android&pcampaignid=web_share",

  // Legacy in-app browser escape behavior for existing iOS links.
  ANDROID_PACKAGE: null,

  // AppsFlyer OneLinks by ?src=. Unknown or missing sources intentionally fall
  // back to the raw App Store URL.
  ATTRIBUTION_LINKS,
  
  // Waitlist link (when app is not live)
  WAITLIST_URL: "https://spool-app.vercel.app/",
  
  // Text content for different modes
  DOWNLOAD_MODE: {
    header_button: "Download App",
    hero_button: "Download Now",
    hero_status: "📱 NOW AVAILABLE ON THE APP STORE!",
    cta_button: "Download Free on iOS",
    popup_title: "🎉 Spool is Now Live!",
    popup_text: "The wait is over! Download Spool now and start your journey to mindful phone use.",
    popup_button: "Download Now"
  },
  
  WAITLIST_MODE: {
    header_button: "Join Waitlist",
    hero_button: "Join Waitlist",
    hero_status: "📱 COMING SOON - JOIN THE WAITLIST!",
    cta_button: "Join the Waitlist",
    popup_title: "🧵 Join the Spool Waitlist",
    popup_text: "Be the first to experience mindful phone use. Get early access when Spool launches!",
    popup_button: "Join Waitlist"
  }
};

// Helper function to get current config
export const getCurrentConfig = () => {
  return APP_CONFIG.IS_APP_LIVE ? APP_CONFIG.DOWNLOAD_MODE : APP_CONFIG.WAITLIST_MODE;
};

// Helper function to get current URL
export const getCurrentURL = () => {
  return APP_CONFIG.IS_APP_LIVE ? APP_CONFIG.APP_STORE_URL : APP_CONFIG.WAITLIST_URL;
};
