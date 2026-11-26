"use client";

import React from 'react';
import StoreBadges from '../StoreBadges/StoreBadges';
import './CTA.css';
import { getCurrentURL, APP_CONFIG } from '../../config/appConfig';


const CTA = () => {
  const url = getCurrentURL();

  return (
    <section className="cta">
      <div className="cta-container">
        <p className="cta-badge">{APP_CONFIG.IS_APP_LIVE ? "FREE TO DOWNLOAD" : "🧵 COMING SOON!"}</p>
        <h2 className="cta-title">Start Unwinding Wisely 🪡</h2>
        <StoreBadges appStoreUrl={url} />
      </div>
    </section>
  );
};

export default CTA;
