"use client";
import React from 'react';
import Header from '../components/Header/Header.js';
import ScrollHero from '../components/ScrollHero';
import PressProof from '../components/PressProof/PressProof.js';
import HowSpoolWorks from '../components/HowSpoolWorks/HowSpoolWorks.js';
import Features from '../components/Features/Features.js';
import CTA from '../components/CTA/CTA.js';
import FAQ from '../components/FAQ/FAQ.js';
import Footer from '../components/Footer/Footer.js';

const HomePage = () => {
  return (
    <>
      <Header />
      <ScrollHero />
      <PressProof />
      <HowSpoolWorks />
      <Features />
      <CTA />
      <FAQ />
      <p
        style={{
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#8a8378',
          margin: '0 0 24px',
        }}
      >
        {/* lowercase `datetime` (not React's `dateTime`) so the SSR HTML
            carries the spec-cased attribute AI-readiness scanners grep for */}
        <time datetime="2026-10-17">Last updated October 17, 2026</time>
      </p>
      <Footer />
    </>
  );
};

export default HomePage;
