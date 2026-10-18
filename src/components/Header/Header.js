"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { DownloadLink } from '../DownloadLink/DownloadLink';
import { getCurrentURL } from '../../config/appConfig';
import './Header.css';

const NAV_LINKS = [
  { href: '/blog', label: 'Blog' },
  { href: '/compare', label: 'Compare' },
  { href: '/focus-web', label: 'Focus Web' },
  { href: '/science', label: 'Science' },
];

const Header = () => {
  const [open, setOpen] = useState(false);
  const url = getCurrentURL();

  return (
    <header className={`site-header${open ? ' is-open' : ''}`}>
      <div className="site-header-inner">
        <Link href="/" className="site-header-logo" onClick={() => setOpen(false)}>
          <img src="/images/spooli_logo.jpg" alt="" width="40" height="40" />
          <span>Spool</span>
        </Link>

        <nav className="site-header-nav" id="site-nav" aria-label="Main">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="site-header-actions">
          <DownloadLink href={url} className="site-header-cta" target="_blank" rel="noopener noreferrer">
            Get the app
          </DownloadLink>
          <button
            type="button"
            className="site-header-toggle"
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen(!open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
