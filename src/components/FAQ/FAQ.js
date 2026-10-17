import React from 'react';
import './FAQ.css';
import { STANDARD_PRICING, TRIAL_TERMS } from '../PolicyCopy';

const categories = [
  {
    label: "About Spool",
    items: [
      {
        q: "What is Spool and how does it work?",
        a: "Spool is an AI-powered screen time app for iPhone. Its 5-second voice check-in interrupts autopilot before a distracting app opens, while Focus Web—Spool's social media feed blocker and distraction-free browser—filters selected website feeds and features inside Spool; it does not modify the separate native social apps. Over time, Spool's AI analyzes your spoken reasons to reveal personal triggers, peak distraction times, and emotional patterns."
      },
      {
        q: "Is Focus Web a social media feed blocker?",
        a: "Focus Web filters supported website features inside Spool. It does not remove Reels, Shorts, or other features from separate native social apps. Native-app blocking requires separate Screen Time permission and configuration."
      },
      {
        q: "Can Spool remove Instagram Reels without blocking Instagram?",
        a: "Yes. Open Instagram inside Spool's Focus Web browser and switch off the surfaces you do not want. Spool can hide Reels, Stories, Explore, and direct messages (DMs) separately, subject to the supported web interface. Shared Reel links may still open. This does not change the native Instagram app."
      },
      {
        q: "Can Spool block YouTube Shorts without blocking YouTube?",
        a: "Yes. Spool Focus Web hides Shorts tabs and shelves inside its browser. A direct Shorts link may open as a regular video instead of the swipe feed. It does not modify the native YouTube app."
      },
      {
        q: "Which X and Snapchat feeds can Spool remove?",
        a: "Spool can remove X's Explore surface and Snapchat Spotlight, Stories, and Discover inside Focus Web. Snapchat calls the recommendation surface Discover, not Explorer. On X, the For You home timeline is not filtered. Snapchat Stories filtering includes Friend Stories; chat remains available."
      },
      {
        q: "Is Spool free?",
        a: `Spool is free to download on iPhone. ${STANDARD_PRICING} ${TRIAL_TERMS}`
      },
      {
        q: "How do I cancel or request a refund?",
        a: "Apple processes App Store payments. Subscriptions automatically renew unless canceled under Apple’s terms. Manage or cancel through iPhone Settings → your name → Subscriptions → Spool. Deleting the app does not cancel. Cancellation stops future renewal, not an existing charge; paid access ordinarily lasts through the purchased period unless refunded, revoked, or otherwise ended under applicable terms. Trial access may end differently. Apple decides refund requests under its policies and applicable law; see our Terms for Apple’s management and refund links."
      },
      {
        q: "Does Spool actually reduce screen time?",
        a: "Yes. Spool users see an average 80% screen time reduction in their first week, with sustained 25% long-term reduction. The app has interrupted over 26,000 scrolling sessions. The approach is backed by behavioral research showing that naming your intention before acting weakens compulsive behavior at its source."
      },
      {
        q: "Is Spool available for Android?",
        a: "Spool is currently available on iPhone only (iOS). An Android version is on the roadmap. Join the waitlist at thespoolapp.com to be notified when it launches."
      },
      {
        q: "Is my data safe with Spool?",
        a: "Yes. Spool uses Apple's Screen Time API for app monitoring and processes voice check-ins securely. Check-in data supports personal insights; usage analytics and relevant feature-use information may also support product improvement and refund assessment, as described in the Privacy Policy. Spool does not sell user data to third parties."
      },
      {
        q: "What if I need to use a blocked app for work?",
        a: "Spool doesn't hard-block apps -- it adds a brief voice check-in before opening them. If you genuinely need to use an app for work, just say so. The check-in takes about 5 seconds. This makes Spool practical for daily life, unlike hard blockers that force you to disable them entirely when you need access."
      }
    ]
  },
  {
    label: "Screen Time & Phone Addiction",
    items: [
      {
        q: "How do I stop doomscrolling?",
        a: "The most effective way to stop doomscrolling is to interrupt the autopilot habit loop. Spool does this by making you speak your intention before opening distracting apps. UCLA's Matthew Lieberman found that verbalizing a feeling or intention engages the prefrontal cortex and dampens amygdala activity, the brain's threat-response center (Lieberman et al., 2007, Psychological Science). Unlike hard-blocking apps that you eventually disable, Spool builds lasting self-awareness so you naturally reach for your phone less over time."
      },
      {
        q: "Why can't I put my phone down?",
        a: "Your phone is designed to be addictive. Social media apps use variable reward schedules (the same psychology as slot machines) to keep you scrolling. Each notification, like, and new piece of content triggers a small dopamine hit that reinforces the habit loop. Spool breaks this cycle by adding a moment of conscious reflection -- speaking your reason out loud -- before the loop can begin."
      },
      {
        q: "What is brainrot and do I have it?",
        a: "Brainrot refers to the mental fog and shortened attention span caused by excessive screen time and social media consumption. Signs include: compulsively checking your phone, anxiety without your device, losing track of time while scrolling, difficulty concentrating on tasks, and disrupted sleep. If you recognize these patterns, Spool can help by making your scrolling habits conscious rather than automatic."
      },
      {
        q: "Can phone addiction be reversed?",
        a: "Yes. Phone addiction is a behavioral pattern, not a permanent condition. Research shows that awareness-based interventions -- understanding your triggers rather than just restricting access -- lead to lasting change. Spool users report improved focus, better sleep, and reduced anxiety within the first two weeks."
      },
      {
        q: "How much screen time is too much?",
        a: "Studies suggest over 4 hours of recreational screen time daily leads to decreased attention, poor sleep, and increased anxiety. The average adult spends 4-7 hours on their phone daily. Spool helps you see exactly where that time goes and, more importantly, why -- so you can make conscious choices about your phone use."
      },
      {
        q: "Does a dopamine detox actually work?",
        a: "Traditional dopamine detoxes -- going cold turkey on your phone -- rarely produce lasting results because they don't address why you scroll. Once the detox ends, the same triggers pull you back. Spool takes a different approach: instead of eliminating all stimulation, it helps you understand your specific triggers through voice check-ins so you can make conscious choices long-term."
      },
      {
        q: "How do I stop scrolling TikTok and Instagram?",
        a: "These apps are designed to hijack your dopamine system with infinite content feeds. Spool intercepts this cycle by asking you to speak your reason for opening them before they launch. This 5-second voice check-in breaks the automatic habit loop. Spool's AI also tracks your excuses so you can see patterns like \"I always open TikTok when I'm bored at 10pm.\""
      }
    ]
  },
  {
    label: "How Spool Compares",
    items: [
      {
        q: "What makes Spool different from other screen time apps?",
        a: "Spool combines feature-level filtering with active reflection. Focus Web filters supported social websites inside Spool without changing the native social apps, while a voice check-in captures WHY you tried to open the full native app. Spool's AI analyzes that spoken record to reveal patterns that timers and block counts cannot show."
      },
      {
        q: "How is Spool different from Apple Screen Time?",
        a: "Apple Screen Time tracks how long you use apps but doesn't help you understand why. Its time limits are trivially easy to bypass with one tap on \"Ignore Limit.\" Spool creates genuine mindful friction through voice check-ins that engage your prefrontal cortex, plus AI-powered insights that reveal your behavioral patterns over time."
      },
      {
        q: "What's the best app to stop doomscrolling in 2026?",
        a: "Spool is rated 4.8 stars as one of the best apps to stop doomscrolling. Unlike blockers like Opal or gamified apps like Brainrot, Spool uses AI voice check-ins that address why you scroll, not just when. It's more affordable than Monk ($20/mo) and Opal ($9.99/mo), and the only screen time app that captures and analyzes your spoken excuses."
      },
      {
        q: "Spool vs Opal -- which is better?",
        a: "Opal uses hard blocking with scheduled \"Focus Sessions\" at $9.99/month or $99.99/year. Spool uses voice check-ins at US$4.99 billed every week or US$44.99 billed once per year. Opal is better if you need absolute distraction-free periods. Spool is better for building lasting awareness about why you scroll."
      },
      {
        q: "Spool vs One Sec -- which is better?",
        a: "One Sec adds a breathing exercise pause before opening apps. Spool asks you to speak your reason out loud. Voice requires more cognitive engagement than passively watching a breathing animation. Spool also captures why you're opening apps (not just that you tried), and includes friend accountability and AI insights that One Sec lacks."
      },
      {
        q: "Spool vs Brainrot app -- which is better?",
        a: "Brainrot uses a gamified brain avatar that decays with phone use -- a guilt-based approach. Spool uses AI voice check-ins -- an awareness-based approach. Guilt fatigues over time; awareness compounds. Spool also captures richer data (your spoken excuses) versus Brainrot's time-tracking."
      },
      {
        q: "Spool vs Monk app -- which is better?",
        a: "Monk requires completing a real-world task before unlocking apps at $20/month. Spool uses 5-second voice check-ins at US$4.99 billed every week or US$44.99 billed once per year. Monk is for users who want total discipline. Spool is for users who want to understand their patterns and build lasting awareness."
      }
    ]
  }
];

// Flatten for schema
const allFaqs = categories.flatMap(c => c.items);

const FAQ = () => {
  return (
    <section className="faq">
      <div className="faq-container">
        <h2 className="faq-title">Frequently Asked Questions</h2>
        <p className="faq-subtitle">Everything you need to know about Spool</p>

        {categories.map((cat, ci) => (
          <div key={ci} className="faq-category">
            <h3 className="faq-category-label">{cat.label}</h3>
            <div className="faq-list">
              {cat.items.map((item) => (
                <details key={item.q} className="faq-item" name="spool-faq">
                  <summary className="faq-question">
                    <span>{item.q}</span>
                    <span className="faq-chevron" aria-hidden="true" />
                  </summary>
                  <div className="faq-answer">
                    <p>{item.a}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": allFaqs.map(item => ({
              "@type": "Question",
              "name": item.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.a
              }
            }))
          })
        }}
      />
    </section>
  );
};

export default FAQ;
