"use client";

import React from 'react';
import Link from 'next/link';
import { DownloadLink } from '../DownloadLink/DownloadLink';
import { getCurrentURL } from '../../config/appConfig';
import './Footer.css';

const Footer = () => {
  const url = getCurrentURL();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            <img src="/images/spooli_logo.jpg" alt="" width="40" height="40" />
            <span>Spool</span>
          </Link>
          <p>Voice check-ins and a social feed blocker that help you stop doomscrolling on iPhone.</p>
          <DownloadLink href={url} className="footer-app-store" target="_blank" rel="noopener noreferrer">
            <img src="/app-store-badge.svg" alt="Download on the App Store" width="140" height="47" />
          </DownloadLink>
        </div>
        <div className="footer-content">
          <div className="footer-section">
            <h3>Resources</h3>
            <div className="footer-links">
              <Link href="/blog">Blog</Link>
              <Link href="/compare">Compare</Link>
              <Link href="/focus-web">Focus Web</Link>
              <Link href="/science">The Science</Link>
              <Link href="/press">Press</Link>
              <Link href="/about">About</Link>
              <Link href="/privacy">Privacy Policy</Link>
              <Link href="/terms">Terms of Service</Link>
              <Link href="/support">Contact Us</Link>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <div className="footer-social">
              <a href="https://twitter.com/the_spool_app" target="_blank" rel="noopener noreferrer">
                𝕏 @the_spool_app
              </a>
              <a href="https://www.instagram.com/spool.screentime.app/" target="_blank" rel="noopener noreferrer">
                Instagram @spool.screentime.app
              </a>
              <a href="https://www.tiktok.com/@spool.screentime.app" target="_blank" rel="noopener noreferrer">
                TikTok @spool.screentime.app
              </a>
              <a href="https://www.linkedin.com/company/spooli/" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
          
          <div className="footer-section">
            <h3>Meet the Founders</h3>
            <div className="footer-founders">
              <a href="https://twitter.com/prafull_truffle" target="_blank" rel="noopener noreferrer">
                Prafull (@prafull_truffle)
              </a>
              <a href="https://twitter.com/whoelsebutns" target="_blank" rel="noopener noreferrer">
                NS (@whoelsebutns)
              </a>
              <a href="https://x.com/jainam_manot" target="_blank" rel="noopener noreferrer">
                Jainam (@jainam_manot)
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Spool. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
