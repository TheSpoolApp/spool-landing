import { FOCUS_WEB_LIMITS } from '@/components/PolicyCopy';
import Link from 'next/link';
import { DownloadLink } from '@/components/DownloadLink/DownloadLink';
import Logo from '@/components/Logo/Logo';
import Footer from '@/components/Footer/Footer';
import './About.css';

export const metadata = {
  title: 'About Spool | The Team Behind the Doomscrolling App',
  description: 'Spool was founded by co-founders Prafull Sharma, Jainam Manot, and Neal Shah. We build AI voice check-ins that help iPhone users stop doomscrolling through awareness, not blocking.',
  alternates: { canonical: 'https://www.thespoolapp.com/about' },
  openGraph: {
    title: 'About Spool | The Team Behind the Doomscrolling App',
    description: 'Spool was founded by co-founders Prafull Sharma, Jainam Manot, and Neal Shah. We build AI voice check-ins that help iPhone users stop doomscrolling through awareness, not blocking.',
    url: 'https://www.thespoolapp.com/about',
    type: 'website',
    images: [{ url: 'https://www.thespoolapp.com/og-homepage-20k.jpg', width: 1200, height: 630 }],
  },
};

const LAST_UPDATED_ISO = '2026-07-09';
const LAST_UPDATED_DISPLAY = 'July 9, 2026';

const CO_FOUNDERS = [
  {
    name: 'Prafull Sharma',
    initials: 'PS',
    url: 'https://www.linkedin.com/in/prafull-sharma-363187168/',
    // Entity link: resolve to the same Person node his personal site publishes,
    // so Google reconciles prafullsharma.me and Spool as one connected graph.
    entityId: 'https://prafullsharma.me/#prafull-sharma',
    entityUrl: 'https://prafullsharma.me',
    sameAs: [
      'https://www.linkedin.com/in/prafull-sharma-363187168/',
      'https://github.com/prafull2001',
    ],
  },
  {
    name: 'Jainam Manot',
    initials: 'JM',
    url: 'https://www.linkedin.com/in/jainam-manot/',
    sameAs: ['https://www.linkedin.com/in/jainam-manot/'],
  },
  {
    name: 'Neal Shah',
    initials: 'NS',
    url: 'https://www.linkedin.com/in/nealmshah/',
    sameAs: ['https://www.linkedin.com/in/nealmshah/'],
  },
];

const STATS = [
  { num: '4.8★', label: 'App Store rating (126 reviews)' },
  { num: '3,000+', label: 'users' },
  { num: '26,000+', label: 'scrolling sessions interrupted' },
  { num: '80%', label: 'first-week screen-time reduction' },
  { num: '25%', label: 'sustained long-term reduction' },
];

const personSchema = (p) => ({
  '@type': 'Person',
  ...(p.entityId ? { '@id': p.entityId } : {}),
  name: p.name,
  jobTitle: 'Co-founder',
  url: p.entityUrl || p.url,
  ...(p.sameAs ? { sameAs: p.sameAs } : {}),
});

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: 'https://www.thespoolapp.com/about',
  name: 'About Spool',
  description: 'Spool was founded by co-founders Prafull Sharma, Jainam Manot, and Neal Shah. Spool uses AI voice check-ins to help iPhone users stop doomscrolling.',
  dateModified: LAST_UPDATED_ISO,
  mainEntity: {
    '@type': 'Organization',
    '@id': 'https://www.thespoolapp.com/#spool',
    name: 'Spool',
    url: 'https://www.thespoolapp.com',
    founder: CO_FOUNDERS.map(personSchema),
  },
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <Logo />
      <div className="about-page">
        <Link href="/" className="about-back">← Back to home</Link>

        <header className="about-hero">
          <span className="about-eyebrow">About Spool</span>
          <h1>Why we built Spool to stop doomscrolling</h1>
          <p className="about-lede">
            Spool is an iPhone app that helps people stop doomscrolling through AI-powered voice
            check-ins. Instead of blocking apps or showing you a guilt-inducing avatar, Spool asks
            you to <strong>speak your reason out loud</strong> before opening distracting apps like
            TikTok, Instagram, or X — a 5-second pause that interrupts the autopilot habit loop and
            reveals <em>why</em> you reach for your phone, not just how often.
          </p>
          <p className="about-updated">
            Last updated <time dateTime={LAST_UPDATED_ISO}>{LAST_UPDATED_DISPLAY}</time>
          </p>
        </header>

        <div className="about-body">
          <div className="about-quote">
            Spool is the only screen-time app built around verbalized intent. Every other major app
            in the category — Opal, One Sec, ScreenZen, Freedom — uses blocking or passive friction.
            Spool uses awareness.
          </div>

          <h2>The team</h2>
          <p>
            Spool was founded in 2024 by co-founders Prafull Sharma, Jainam Manot, and Neal Shah.
            The team is based in the United States and ships iPhone-first.
          </p>
          <p>
            Co-founder{' '}
            <a href="https://prafullsharma.me" target="_blank" rel="noopener author">
              Prafull Sharma
            </a>{' '}
            writes about attention, habit change, and the behavioral science behind Spool on his
            personal site.
          </p>

          <div className="about-team">
            {CO_FOUNDERS.map((p) => (
              <div key={p.name} className="about-team-card">
                <div className="about-avatar" aria-hidden="true">{p.initials}</div>
                <h3>{p.name}</h3>
                <p className="about-team-role">Co-founder</p>
                <a className="about-team-link" href={p.url} rel="author noopener" target="_blank">
                  LinkedIn →
                </a>
              </div>
            ))}
          </div>

          <h2>Why we built Spool</h2>
          <p>
            Doomscrolling isn&apos;t a willpower problem. Apps like Instagram, TikTok, and X are
            engineered by teams of behavioral psychologists to exploit the same dopamine pathways
            that drive gambling addiction. Most screen-time tools fight this with restriction — hard
            blocks, timers, schedules, micro-workouts, wait screens. That friction is a bandaid on a
            deeper issue. Users either bypass it or grow resentful and uninstall.
          </p>
          <p>
            Spool works on both sides of the habit: Focus Web, its social media feed blocker,
            removes selected distracting feeds, while the voice check-in helps you understand{' '}
            <em>why</em> you reached for the full app.
            When users articulate out loud why they want to scroll, we mirror their own patterns
            back to them as AI-generated insights. Some have dropped from 6 hours of daily use to
            4; others describe cutting their use to roughly a quarter of what it was.
          </p>

          <p>{FOCUS_WEB_LIMITS}</p>

          <h2>Research foundation</h2>
          <p>
            Spool&apos;s voice check-in mechanism operationalizes <strong>Matthew Lieberman&apos;s
            2007 UCLA research on affect labeling</strong> (Lieberman et al., <em>Putting Feelings
            into Words: Affect Labeling Disrupts Amygdala Activity in Response to Affective
            Stimuli</em>). Lieberman&apos;s fMRI work showed that <strong>naming an urge out loud
            reduces its intensity</strong> by engaging the prefrontal cortex and dampening amygdala
            activity. Spool is, in effect, that finding turned into a product: tap a distracting app,
            name the urge in five seconds, app opens. The pause moves the impulse from reactive
            (amygdala) to deliberative (prefrontal) processing.
          </p>
          <p>
            We also draw on the welfare-economics literature on digital addiction — specifically{' '}
            <strong>Allcott, Gentzkow &amp; Song (2022), &quot;Digital Addiction&quot;</strong> in
            the <em>American Economic Review</em>, which formalized social media as a habit-forming
            good where users systematically underestimate their future usage. Their finding that
            brief, well-placed commitment devices produce lasting reductions in use is exactly the
            regime Spool&apos;s voice check-in occupies.
          </p>

          <h2>What we&apos;ve learned from 26,000+ voice check-ins</h2>
          <p>
            We capture each user&apos;s statement at the moment of temptation — a category of data
            that&apos;s rare in the digital-wellbeing literature, which tends to rely on
            retrospective self-report. The interior monologue of compulsive phone use turns out to
            be remarkably uniform. <strong>Most users frame their unlock as a first-person want or
            need</strong>, and a small set of phrases recurs across users with no platform-mediated
            connection between them. The actual statements sound like this:
          </p>

          <div className="about-quote is-examples">
            &quot;I just want to scroll for a bit.&quot; &middot; &quot;I just need to check
            something.&quot; &middot; &quot;I want to chill and watch a little bit.&quot;
          </div>

          <p>
            Surfacing those patterns back to the user — &quot;you said &lsquo;just checking&rsquo; 47
            times this week&quot; — is what makes people want to change. Awareness of the script is
            what breaks it.
          </p>

          <h2>What makes Spool different</h2>
          <ul className="about-list">
            <li>
              <strong>Feature-level filtering.</strong> Focus Web is a distraction-free social
              media browser that can remove Instagram Reels, YouTube Shorts, X Explore, and
              Snapchat Spotlight without blocking every part of each platform.
            </li>
            <li>
              <strong>Voice as the input.</strong> Speaking captures why you opened the full native
              app and forces conscious engagement that tapping a button cannot.
            </li>
            <li>
              <strong>AI pattern analysis.</strong> Excuses like &quot;just checking&quot; or
              &quot;I&apos;m bored&quot; are tracked and surfaced as personalized insights.
            </li>
            <li>
              <strong>iPhone-first.</strong> Built on Apple&apos;s Screen Time API. Android in
              development.
            </li>
          </ul>

          <h2>By the numbers</h2>
          <div className="about-stats">
            {STATS.map((s) => (
              <div key={s.label} className="about-stat">
                <div className="about-stat-num">{s.num}</div>
                <div className="about-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          <h2>Not the 2012 Spool</h2>
          <p>
            There was a different app called Spool back in 2011–2012 — a read-it-later /
            content-saving service that was acquired by Facebook. We are not affiliated with that
            company. The current Spool, at <strong>thespoolapp.com</strong>, is an iPhone screen-time
            app founded in 2024 by Prafull Sharma. The two share only a name.
          </p>

          <h2>Press &amp; contact</h2>
          <p>
            For press inquiries, partnerships, or research collaborations, email{' '}
            <a href="mailto:team@thespoolapp.com">team@thespoolapp.com</a>. For more on the product,
            see our <Link href="/blog">blog</Link>, <Link href="/compare">app comparisons</Link>, or{' '}
            <Link href="/press">press coverage</Link>.
          </p>
        </div>

        <div className="about-cta">
          <h3>Try Spool</h3>
          <p>The only screen-time app that asks you to speak your reason before you scroll.</p>
          <DownloadLink
            className="about-cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download Spool on iPhone
          </DownloadLink>
        </div>
      </div>
      <Footer />
    </>
  );
}
