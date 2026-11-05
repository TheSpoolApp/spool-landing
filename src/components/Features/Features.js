"use client";

import React from 'react';
import Link from 'next/link';
import { FOCUS_WEB_LIMITS } from '../PolicyCopy';
import './Features.css';

const features = [
  { 
    icon: '/images/spooli_block.png',
    title: 'Block Instagram Reels and more',
    description: 'Use Instagram without Reels, YouTube without Shorts, and Facebook without dedicated Reels hubs in Spool’s Focus Web browser.',
    href: '/focus-web'
  },
  {
    icon: '/images/spooli_breath_preview.png',
    title: 'Say why before you scroll',
    description: 'A 5-second voice check-in interrupts autopilot before a distracting app opens.'
  },
  { 
    icon: '/images/spooli_brain.png',
    title: 'Understand your triggers',
    description: 'Spool turns your spoken reasons into patterns you can actually change.'
  },
  { 
    icon: '/images/spooli_point.png',
    title: 'See your progress',
    description: 'Track screen time, check-ins, and the moments that pull you back to your phone.'
  }
];

const Features = () => {
  return (
    <section className="features">
      <div className="features-container">
        <h2 className="features-title" data-aos="fade-up">Block the scroll, not your whole life</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              className="feature-card" 
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="feature-icon">
                <img src={feature.icon} alt={feature.title} />
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-description">{feature.description}</p>
              {feature.href && (
                <Link className="feature-card-link" href={feature.href}>
                  Explore the Focus Web feed blocker
                </Link>
              )}
            </div>
          ))}
        </div>
        <nav className="features-guides" aria-label="Social feed filtering guides">
          <Link href="/focus-web/instagram-without-reels">Block Instagram Reels</Link>
          <Link href="/focus-web/facebook-without-reels">Facebook without Reels</Link>
          <Link href="/focus-web/snapchat-without-spotlight">Hide Snapchat Stories and Discover</Link>
          <Link href="/focus-web/youtube-without-shorts">YouTube without Shorts</Link>
        </nav>
        <p className="features-fine-print">{FOCUS_WEB_LIMITS}</p>
      </div>
    </section>
  );
};

export default Features;
