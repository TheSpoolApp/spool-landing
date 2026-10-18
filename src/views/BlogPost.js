"use client";
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import { DownloadLink } from '../components/DownloadLink/DownloadLink';
import { PRAFULL } from '../data/authors';
import { getBlogContentMap } from '../data/content';
import './BlogPost.css';
import { STANDARD_PRICING, TRIAL_TERMS, FOCUS_WEB_LIMITS } from '../components/PolicyCopy';

const blogContent = getBlogContentMap();

const BlogPost = () => {
  const { id } = useParams();
  const post = blogContent[id];

  if (!post) {
    return (
      <>
        <Header />
        <div className="blog-post-container">
          <div className="blog-post-content">
            <h1>Post Not Found</h1>
            <p>Sorry, we couldn&apos;t find the blog post you&apos;re looking for.</p>
            <Link href="/blog" className="back-to-blog">← Back to Blog</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isComparison = post.category === 'Comparison';
  const showFocusWebNote = isComparison || /Focus Web|feed block/i.test(post.content);
  const showPricingNote = isComparison || /\$4\.99|\$44\.99/.test(post.content);

  return (
    <>
      <Header />
      <article className="blog-post-container">
        <div className="blog-post-header">
          <Link href={isComparison ? '/compare' : '/blog'} className="back-to-blog">
            ← Back to {isComparison ? 'Comparisons' : 'Blog'}
          </Link>
          <span className="blog-post-category">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="blog-post-meta">
            <span className="blog-post-byline">
              By{' '}
              <Link
                href="/authors/prafull"
                rel="author"
                className="blog-post-author"
              >
                {PRAFULL.name}
              </Link>
            </span>
            <span>•</span>
            <time dateTime={new Date(post.date).toISOString().split('T')[0]}>
              {post.date}
            </time>
            <span>•</span>
            <span>{post.readTime}</span>
            {post.showLastUpdated && (
              <>
                <span>•</span>
                <span className="blog-post-last-updated">Last updated: {post.dateModified}</span>
              </>
            )}
          </div>
        </div>

        <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        {post.platformSiblings && (
          <aside className="blog-post-platform-siblings">
            <h3>Stop scrolling on every platform</h3>
            <ul>
              {post.platformSiblings.map((p) => (
                <li key={p.slug}>
                  <Link href={p.href}>{p.label}</Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        {post.related.length > 0 && (
          <aside className="blog-post-related">
            <h3>Related reading</h3>
            <ul>
              {post.related.map((r) => (
                <li key={r.slug}>
                  <Link href={r.href}>{r.title}</Link>
                </li>
              ))}
            </ul>
          </aside>
        )}

        <aside className="blog-post-author-card">
          <h3>About the author</h3>
          <p>
            <Link href="/authors/prafull" rel="author">
              <strong>{PRAFULL.name}</strong>
            </Link>{' '}
            &mdash; {PRAFULL.jobTitle}.
          </p>
          <p>{PRAFULL.shortBio}</p>
          <p>
            Spool&apos;s mechanism is grounded in peer-reviewed research from UCLA,
            Stanford, NYU, Yale, Harvard, and UC Irvine.{' '}
            <Link href="/science">Read the science behind Spool</Link>.
          </p>
        </aside>

        <div className="blog-post-cta">
          <h3>{isComparison ? 'Clean up the feed. Change the habit.' : 'Ready to break free from mindless scrolling?'}</h3>
          <p>
            {isComparison
              ? 'Spool removes the feeds that pull you in and helps you understand why you reached for them.'
              : "Join thousands who've transformed their relationship with their phones."}
          </p>
          <DownloadLink
            className="blog-cta-button"
            target="_blank"
            rel="noopener noreferrer"
          >
            Try Spool on iPhone
          </DownloadLink>
        </div>
        {(showFocusWebNote || showPricingNote) && (
          <aside className="blog-post-fine-print" aria-label="Product and pricing notes">
            {showFocusWebNote && <p>{FOCUS_WEB_LIMITS} <Link href="/focus-web">See platform-specific limitations</Link>.</p>}
            {showPricingNote && (
              <p><strong>Subscription information updated October 2, 2026.</strong> {STANDARD_PRICING} {TRIAL_TERMS} <Link href="/terms">Subscription and refund terms</Link>.</p>
            )}
          </aside>
        )}
      </article>
      <Footer />
    </>
  );
};

export default BlogPost;
