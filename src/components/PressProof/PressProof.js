"use client";

import React from 'react';
import Link from 'next/link';
import { PRESS_ITEMS } from '@/data/press';
import './PressProof.css';

// Show the most recent few outlets in the homepage strip; /press lists them all.
const FEATURED = PRESS_ITEMS.slice(0, 3);

const PressProof = () => {
  return (
    <section className="press-proof" aria-labelledby="press-proof-title">
      <div className="press-proof-inner">
        <div className="press-proof-meta">
          <span className="press-proof-label" id="press-proof-title">Featured in</span>
        </div>

        <ul className="press-proof-list">
          {FEATURED.map((item) => (
            <li key={item.slug} className="press-proof-item">
              <span className="press-proof-outlet">{item.outlet}</span>
              <a
                className="press-proof-headline"
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {item.title}
              </a>
            </li>
          ))}
        </ul>

        <div className="press-proof-actions" aria-label="Press coverage summary">
          <aside className="press-proof-stat">
            <strong>26k+</strong>
            <span>excuses recorded</span>
          </aside>
          <Link href="/press" className="press-proof-link">
            Read all coverage
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PressProof;
