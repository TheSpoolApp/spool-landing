export const FOCUS_WEB_PLATFORMS = [
  {
    slug: 'instagram-without-reels',
    platform: 'Instagram',
    shortLabel: 'Instagram without Reels',
    title: 'Instagram Without Reels on iPhone (Keep DMs)',
    description:
      'Use Instagram without Reels on iPhone. Hide Reels in Spool’s Focus Web browser while keeping DMs available. See setup, optional filters, and limits.',
    answer:
      'To use Instagram without Reels on iPhone, open Instagram in Spool’s Focus Web browser and turn on the Reels filter. Leave the DMs filter off to keep messaging available. Stories and Explore have separate controls. This filters Instagram’s website inside Spool; it does not change the native Instagram app, and shared Reel links may still open.',
    removes: ['Reels', 'Stories', 'Explore', 'Direct messages (DMs)'],
    available:
      'Instagram’s web experience remains available inside Spool; only supported surfaces you switch off are filtered. Shared Reel links may still open.',
    problem:
      'Blocking all of Instagram also blocks the parts you may use intentionally. Spool works at the feature level instead: remove the surface that starts the scroll while leaving the rest of the web experience available.',
    details: [
      'Open Focus Web in Spool and choose Instagram.',
      'Sign in to Instagram inside the Focus Web browser.',
      'Turn on the Reels filter. Leave DMs unfiltered if you want to keep messaging.',
      'Choose whether to filter Stories and Explore separately, then browse Instagram through Focus Web.',
      'Return to Instagram through Spool for the filtered experience; opening the native Instagram app will still show its normal interface.',
    ],
    faq: [
      {
        q: 'Can I use Instagram without Reels and still keep DMs?',
        a: 'Yes. Enable Reels filtering and leave DMs filtering off in Spool Focus Web. You can use Instagram messaging in the filtered browser. These controls do not change the native Instagram app.',
      },
      {
        q: 'Will this block every Instagram Reel link?',
        a: 'No. Focus Web hides supported Reels surfaces, but shared Reel links may still open. It is a filtered way to browse Instagram, not a guarantee that every individual video is blocked.',
      },
      {
        q: 'Can I remove Instagram Reels without blocking Instagram?',
        a: 'Yes. Open Instagram inside Spool Focus Web and switch off Reels. Spool filters the website inside Spool; shared Reel links may still open and the native app is unchanged.',
      },
      {
        q: 'Can Spool hide Instagram Stories and DMs too?',
        a: 'Yes. Reels, Stories, Explore, and direct messages are separate controls, so you can remove the combination that matches your habits.',
      },
      {
        q: 'Does Spool change the native Instagram app?',
        a: 'No. Focus Web is an in-app browser. It filters Instagram’s web interface inside Spool and does not modify Meta’s native Instagram app.',
      },
    ],
  },
  {
    slug: 'youtube-without-shorts',
    platform: 'YouTube',
    shortLabel: 'YouTube without Shorts',
    title: 'YouTube Without Shorts on iPhone',
    description:
      'Hide YouTube Shorts tabs and shelves inside Spool; the native app is unchanged. Spool Focus Web hides the Shorts surface while keeping intentional web viewing available.',
    answer:
      'Spool can hide YouTube Shorts tabs and shelves inside its browser. Open YouTube inside Focus Web and enable the Shorts filter; long-form videos, channels, and search remain part of the YouTube web experience.',
    removes: ['YouTube Shorts'],
    available: 'Long-form videos, channels, subscriptions, and search remain available on YouTube’s web experience. A direct Shorts link can open as a regular video instead of the Shorts swipe feed.',
    problem:
      'YouTube mixes useful long-form video with a never-ending Shorts feed. An app-level block removes both. Feature-level filtering removes the short-form loop while preserving the videos you deliberately came to watch.',
    details: [
      'Open YouTube from Spool’s Focus Web tab instead of entering the native app on autopilot.',
      'Enable the Shorts filter to remove the short-form surface from the Focus Web experience.',
      'Use search or subscriptions to go directly to a video you chose.',
      'Pair filtering with Spool’s voice check-in when you also want to understand why you opened YouTube.',
    ],
    faq: [
      {
        q: 'Can I block YouTube Shorts without blocking YouTube?',
        a: 'Yes. Spool Focus Web filters Shorts inside YouTube’s web experience while leaving intentional long-form viewing available.',
      },
      {
        q: 'Does Spool remove Shorts from the native YouTube app?',
        a: 'No. Spool does not alter the native YouTube app. Filtering applies only inside Spool’s Focus Web browser; direct Shorts links can still open as regular videos.',
      },
      {
        q: 'What is the official name of YouTube’s short-form feed?',
        a: 'YouTube calls the format “Shorts” and the infinite viewing surface the “Shorts Feed.”',
      },
    ],
  },
  {
    slug: 'x-without-explore',
    platform: 'X (Twitter)',
    shortLabel: 'X without Explore',
    title: 'X (Twitter) Without Explore',
    description:
      'Filter X’s Explore website surface inside Spool; the native app is unchanged. Spool Focus Web removes Explore so you can enter X with less algorithmic discovery.',
    answer:
      'Spool can remove Explore from X inside its Focus Web browser. X uses “Explore” for the discovery area containing personalized trends, events, topics, and videos; this is separate from the “For You” home timeline.',
    removes: ['Explore'],
    available: 'The For You timeline is not filtered. Other parts of X’s web experience remain available inside Focus Web; Grok has a separate optional control.',
    problem:
      'Explore is built for open-ended discovery: personalized trends, events, topics, and videos lead into more content without a clear stopping point. Removing that entry point makes X easier to use for a specific purpose.',
    details: [
      'Open X inside Spool Focus Web.',
      'Enable the Explore filter to remove that discovery surface.',
      'Use X for the specific account, post, notification, or conversation you intended to check.',
      'Use Spool’s voice check-in as a second layer when “staying informed” becomes an automatic reason to open X.',
    ],
    faq: [
      {
        q: 'Is X Explore the same as the For You timeline?',
        a: 'No. X describes Explore as its discovery area for trends, events, topics, and videos. “For You” is the recommended home timeline. Spool’s current Focus Web claim here is specifically removal of Explore.',
      },
      {
        q: 'Does Spool still work if I call the platform Twitter?',
        a: 'Yes. X is the current platform name, but this page also uses “Twitter” because many people still search for “Twitter without Explore.”',
      },
      {
        q: 'Does Spool modify the native X app?',
        a: 'No. The filtered experience runs inside Spool’s Focus Web browser.',
      },
    ],
  },
  {
    slug: 'snapchat-without-spotlight',
    platform: 'Snapchat',
    shortLabel: 'Snapchat without Spotlight',
    title: 'Snapchat Without Spotlight, Stories or Discover',
    description:
      'Remove Snapchat Spotlight, Stories, and Discover inside Spool Focus Web. Keep a more intentional Snapchat web experience without public-content feeds.',
    answer:
      'Spool can hide Spotlight, Stories, and Discover from Snapchat inside Focus Web. “Discover” is Snapchat’s official name for the recommendation surface—there is no Snapchat feature officially named “Explorer.”',
    removes: ['Spotlight', 'Stories', 'Discover'],
    available: 'Chat remains available. Stories filtering also includes Friend Stories; only the web experience inside Spool is affected.',
    problem:
      'Snapchat combines direct social use with public-content surfaces. Spotlight is an endless short-video feed, while Stories and Discover add more recommendation-led paths. Spool lets you remove those paths inside its browser.',
    details: [
      'Hide Spotlight, Snapchat’s public short-form video feed.',
      'Hide Stories when tapping through the Stories page is the behavior you want to stop.',
      'Hide Discover, Snapchat’s official name for its public-content discovery surface.',
      'Open Snapchat through Focus Web when you want the filtered version rather than the full native app.',
    ],
    faq: [
      {
        q: 'Can I remove Snapchat Spotlight?',
        a: 'Yes. Spool Focus Web can hide Spotlight inside its filtered Snapchat web experience.',
      },
      {
        q: 'Is the Snapchat feature called Explore or Discover?',
        a: 'Snapchat calls it “Discover.” Official Snapchat support refers to Spotlight and Discover as separate personalized public-content surfaces.',
      },
      {
        q: 'Can Spool hide Snapchat Stories too?',
        a: 'Yes. Spotlight, Stories, and Discover can be removed from the Focus Web experience.',
      },
    ],
  },
];

export function getFocusWebPlatform(slug) {
  return FOCUS_WEB_PLATFORMS.find((platform) => platform.slug === slug);
}
