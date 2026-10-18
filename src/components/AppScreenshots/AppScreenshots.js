import React from 'react';
import './AppScreenshots.css';

const SHOTS = [
  { src: '/screenshots/instagram-without-reels.webp', alt: 'Spool Focus Web showing Instagram without the Reels tab' },
  { src: '/screenshots/choose-what-goes.webp', alt: 'Spool settings with toggles to block Instagram Reels, Stories, and DMs' },
  { src: '/screenshots/youtube-without-shorts.webp', alt: 'Spool Focus Web showing YouTube without Shorts' },
  { src: '/screenshots/blocking-schedule.webp', alt: 'Spool rules screen with a weekday 9 to 5 blocking schedule' },
  { src: '/screenshots/earn-rewards.webp', alt: 'Spool home screen with streak, rewards, and unlockable backgrounds' },
];

const AppScreenshots = () => {
  return (
    <section className="app-screenshots" aria-labelledby="app-screenshots-title">
      <h2 className="app-screenshots-title" id="app-screenshots-title">See Spool in action</h2>
      <ul className="app-screenshots-row">
        {SHOTS.map((shot) => (
          <li key={shot.src}>
            <img src={shot.src} alt={shot.alt} width="600" height="1303" loading="lazy" decoding="async" />
          </li>
        ))}
      </ul>
    </section>
  );
};

export default AppScreenshots;
