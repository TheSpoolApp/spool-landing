"use client";
import React from 'react';
import Logo from '../components/Logo/Logo';
import Footer from '../components/Footer/Footer';
import Link from 'next/link';
import { getCardList } from '../data/content';
import './BlogPage.css';

const AUTHOR_NAME = 'Prafull Sharma';
const AUTHOR_URL = 'https://www.linkedin.com/in/prafull-sharma-363187168/';

const blogPosts = getCardList();

const TOPICS = [
  'Doomscrolling research & behavioral science',
  'Head-to-head app comparisons (Dull, UNDOOMED, Opal, One Sec, Freedom, ScreenZen, Brainrot, Unrot, Clearspace)',
  'Practical guides for breaking phone-checking habits',
  'What Spool\'s 26,000+ voice check-ins reveal about why people scroll',
];

const BlogPage = ({ faqs = [] }) => {
  return (
    <>
      <Logo />
      <div className="blog-container">
        <div className="blog-header">
          <h1>The Spool Blog: digital-wellness research and honest app comparisons</h1>
          <p>
            Original research, head-to-head app comparisons, and practical guides for people trying to stop doomscrolling. Drawn from 26,000+ voice check-ins users have spoken into Spool — real data about why people open Instagram at 10pm, why &quot;just checking&quot; is the most common excuse, and which screen-time apps actually produce lasting change versus which ones get uninstalled in week two.
          </p>
        </div>

        <div className="blog-intro">
          <blockquote className="blog-stat-callout">
            <strong>Most Spool users frame their unlock as a first-person want or need.</strong>{' '}
            The interior monologue of compulsive phone use is remarkably uniform — and that&apos;s the data this blog mines.
          </blockquote>

          <h2>What you&apos;ll find here</h2>
          <ul className="blog-topics">
            {TOPICS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <h2 className="blog-section-title">Latest posts</h2>
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-card-content">
                <span className={`blog-category ${post.isComparison ? 'comparison' : ''}`}>
                  {post.category}
                </span>
                <h2>
                  <Link href={post.isComparison ? `/compare/${post.id}` : `/blog/${post.id}`}>{post.title}</Link>
                </h2>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="blog-meta">
                  <span className="blog-byline">
                    By{' '}
                    <Link href="/authors/prafull" rel="author">
                      {AUTHOR_NAME}
                    </Link>
                  </span>
                  <time dateTime={post.dateISO} className="blog-date">{post.date}</time>
                </div>
                <Link href={post.isComparison ? `/compare/${post.id}` : `/blog/${post.id}`} className="blog-read-more">
                  Read More →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {faqs.length > 0 && (
          <section className="blog-faq" aria-labelledby="blog-faq-heading">
            <h2 id="blog-faq-heading">Frequently asked questions about Spool</h2>
            <p className="blog-faq-intro">
              The most common questions we get about how Spool works, who it&apos;s for, and how it compares to other screen-time apps.
            </p>
            <dl>
              {faqs.map((f) => (
                <div key={f.q} className="blog-faq-item">
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section className="blog-research" aria-labelledby="blog-research-heading">
          <h2 id="blog-research-heading">Research foundation</h2>
          <p>
            Spool&apos;s voice check-in mechanism isn&apos;t a UX gimmick. It operationalizes two
            specific bodies of academic research:
          </p>
          <ul className="blog-research-list">
            <li>
              <strong>Lieberman et al. (2007)</strong> — <em>Putting Feelings into Words: Affect
              Labeling Disrupts Amygdala Activity in Response to Affective Stimuli</em>{' '}
              (<cite>Psychological Science</cite>). Lieberman&apos;s UCLA fMRI work showed that{' '}
              <strong>naming an urge out loud reduces its intensity</strong> by engaging the
              prefrontal cortex and dampening amygdala activity. Spool is, in product form, that
              finding turned into a daily intervention.
            </li>
            <li>
              <strong>Allcott, Gentzkow &amp; Song (2022)</strong> — <em>Digital Addiction</em>{' '}
              (<cite>American Economic Review</cite>). Formalized social media as a habit-forming
              good where users systematically underestimate their future usage. Their result that
              brief, well-placed commitment devices produce lasting reductions in use matches the
              regime Spool&apos;s voice check-in occupies.
            </li>
          </ul>
          <p>
            For more on how these papers shape Spool&apos;s design, see <Link href="/about">our
            About page</Link>.
          </p>
        </section>

        <section
          className="blog-author"
          aria-labelledby="blog-author-heading"
          itemScope
          itemType="https://schema.org/Person"
        >
          <h2 id="blog-author-heading">About the author</h2>
          <div className="blog-author-card">
            <div className="blog-author-body">
              <p className="blog-author-name">
                <a
                  href={AUTHOR_URL}
                  rel="author"
                  target="_blank"
                  itemProp="url"
                >
                  <span itemProp="name">Prafull Sharma</span>
                </a>
              </p>
              <p className="blog-author-credentials" itemProp="jobTitle">
                Founder &amp; CEO, Spool
              </p>
              <p className="blog-author-bio" itemProp="description">
                Prafull Sharma is the founder of Spool, the iPhone screen-time app built around
                AI voice check-ins. He leads product and engineering, and writes here about
                digital-wellbeing research, app comparisons, and what 26,000+ user-spoken
                statements reveal about why people doomscroll. Spool&apos;s mechanism draws on
                Matthew Lieberman&apos;s 2007 UCLA work on affect labeling and Allcott, Gentzkow
                &amp; Song&apos;s 2022 <em>Digital Addiction</em> paper in the{' '}
                <em>American Economic Review</em>.
              </p>
              <p className="blog-author-links">
                <a href={AUTHOR_URL} rel="author" target="_blank">LinkedIn</a>
                {' · '}
                <a href="https://github.com/prafull2001" target="_blank" rel="noopener">GitHub</a>
                {' · '}
                <a href="mailto:prafull2001@gmail.com">Email</a>
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default BlogPage;
