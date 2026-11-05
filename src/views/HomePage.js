"use client";
import React from 'react';
import Header from '../components/Header/Header.js';
import ScrollHero from '../components/ScrollHero';
import PressProof from '../components/PressProof/PressProof.js';
import HowSpoolWorks from '../components/HowSpoolWorks/HowSpoolWorks.js';
import AppScreenshots from '../components/AppScreenshots/AppScreenshots.js';
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
      <AppScreenshots />
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
        <time dateTime="2026-11-04">Last updated November 4, 2026</time>
      </p>
      <Footer />
    </>
  );
};

export default HomePage;
