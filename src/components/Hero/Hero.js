"use client";

import React from 'react';
import Link from 'next/link';
import { DownloadLink } from '../DownloadLink/DownloadLink';
import './Hero.css';
import { getCurrentURL } from '../../config/appConfig';

import appBoquet from '../../assets/app_boquet.webp';
import recordedExcuses from '../../assets/recorded excuses.png';
import spooliLogo from '../../assets/spooli_logo.png';


const Hero = () => {
  const url = getCurrentURL();

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-header">
          <Link href="/" className="hero-logo-center">
            <img src={spooliLogo.src} alt="Spool Logo" />
            <span className="hero-brand-name">Spool</span>
          </Link>
        </div>
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="hero-title-main">Doomscrolling is stealing your life.</span><br/>
            <span className="hero-title-accent">Unwind Wisely. 🧵</span>
          </h1>
          <DownloadLink href={url} className="app-store-button" target="_blank" rel="noopener noreferrer">
            <img src="/app-store-badge.svg" alt="Download on the App Store" />
          </DownloadLink>
          <p className="hero-excuses-count">26k+ excuses recorded</p>
          <div className="hero-image">
            <img src={appBoquet.src} alt="Spool App Screenshots" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
