import React from 'react';
import './HowSpoolWorks.css';

const steps = [
  {
    title: 'Pick the apps that pull you in',
    description: 'Choose the social and entertainment apps you open on autopilot. Spool uses Apple’s Screen Time permission to watch for them.',
  },
  {
    title: 'Say why before you scroll',
    description: 'When you open one, Spool asks for a 5-second voice check-in. Saying your reason out loud interrupts the autopilot reach.',
  },
  {
    title: 'See what triggers you',
    description: 'Spool turns your spoken reasons into patterns: the times, moods, and excuses that send you back to your phone.',
  },
];

// Figures confirmed by the Spool team on 2026-10-18.
const stats = [
  { value: '4.8★', label: 'App Store rating from 120+ reviews' },
  { value: '80%', label: 'average screen time drop in week one' },
  { value: '25%', label: 'average long-term reduction' },
];

const HowSpoolWorks = () => {
  return (
    <section className="how-spool-works" aria-labelledby="how-spool-works-title">
      <div className="how-spool-works-container">
        <h2 className="how-spool-works-title" id="how-spool-works-title">How Spool works</h2>
        <ol className="steps-list">
          {steps.map((step, index) => (
            <li className="step-item" key={step.title}>
              <span className="step-number" aria-hidden="true">{index + 1}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </li>
          ))}
        </ol>
        <ul className="how-stats" aria-label="Spool results">
          {stats.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default HowSpoolWorks;
