"use client";
import React from 'react';
import Link from 'next/link';
import { STANDARD_PRICING, TRIAL_TERMS, RefundDataSharing } from '../components/PolicyCopy';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer.js';
import './TermsOfServicePage.css';

const TermsOfServicePage = () => {
  return (
    <>
      <Header />
      <div className="terms-container">
        <h1>Terms of Service</h1>
        
        <p className="terms-intro">Last updated: October 2, 2026</p>

        <section>
          <h2>1. Introduction</h2>
          <p>Welcome to Spool ("the App"). By downloading or using the App, you agree to be bound by these Terms of Service.</p>
        </section>

        <section>
          <h2>2. App Services</h2>
          
          <h3>2.1 Features</h3>
          <ul>
            <li>Block apps using iOS Family Controls APIs</li>
            <li>Track and monitor screen time statistics</li>
            <li>Access to historical screen time data</li>
            <li>Block entire app categories</li>
            <li>Filter selected social-media features inside Spool's Focus Web browser</li>
          </ul>

          <h3>2.2 Pricing and Payments</h3>
          <p>The standard subscription options are:</p>
          <ul>
            <li><strong>Weekly: US$4.99, billed every week.</strong></li>
            <li><strong>Annual: US$44.99, billed once per year.</strong> The full annual charge is paid at once, not in monthly installments.</li>
          </ul>
          <p>{STANDARD_PRICING}</p>
          <p>{TRIAL_TERMS}</p>
          <p>Apple processes App Store subscription payments through your Apple Account.</p>

          <h3>Renewal and cancellation</h3>
          <p>Subscriptions automatically renew unless canceled under Apple’s applicable subscription terms. To manage or cancel, open <strong>iPhone Settings → your name → Subscriptions → Spool</strong> and follow the options shown. Deleting Spool does not cancel your subscription. See <a href="https://support.apple.com/en-us/118428">Apple’s subscription-management instructions</a>.</p>
          <p>Canceling stops future renewal; it does not automatically refund an existing charge. Paid access ordinarily continues through the purchased period unless the purchase is refunded, revoked, or otherwise ends under applicable terms. Trial cancellation can affect access differently: you may lose trial access when you cancel. If an eligible trial is offered and you do not want it to renew, Apple advises canceling at least 24 hours before it ends. Follow the terms displayed with your offer and Apple’s guidance for your country or region.</p>

          <h3>Refund requests</h3>
          <p>Request an App Store refund through <a href="https://reportaproblem.apple.com/">reportaproblem.apple.com</a>; see <a href="https://support.apple.com/en-us/118223">Apple’s refund instructions</a>. Apple decides requests under its policies and applicable law. Eligibility varies by purchase and country or region. Nothing in these Terms limits mandatory consumer rights.</p>
          <p>An expectation that Focus Web changes a separate native social app does not, by itself, establish a product defect. This distinction does not dismiss misleading advertising, actual failures, or applicable refund rights. Please report a problem to <a href="mailto:team@thespoolapp.com">team@thespoolapp.com</a> so the specific circumstances can be reviewed.</p>

          <h3>Refund-data sharing and consent</h3>
          <RefundDataSharing />

          <h3>2.3 Focus Web and App Blocking</h3>
          <p>Focus Web filters selected feeds and features only when you open a supported social-media website inside Spool. Depending on the settings you enable and the supported web interface, its controls include:</p>
          <ul>
            <li><strong>Instagram:</strong> a Following-only feed and controls for Reels, Explore, Stories, Messages, and suggested or sponsored posts. Shared Reel links may still open.</li>
            <li><strong>YouTube:</strong> hiding Shorts tabs and shelves; a Shorts link can open as a regular video instead of the Shorts swipe feed.</li>
            <li><strong>X:</strong> hiding Explore and Trends, with a separate optional Grok control. The For You timeline is not currently filtered.</li>
            <li><strong>Snapchat:</strong> hiding Spotlight and Stories/Discover, including Friend Stories. Chat remains available.</li>
            <li><strong>Facebook:</strong> hiding dedicated Reels and video hubs. Individual or shared video links may still open.</li>
          </ul>
          <p>These filters do not change the separate native Instagram, YouTube, X, Snapchat, or Facebook apps. To restrict a native app, you must separately select it in Spool's app-blocking setup, grant the required iOS Screen Time access, and enable the applicable blocking settings or schedule. Native-app blocking and Focus Web filtering are different features. See <Link href="/focus-web">how Focus Web works</Link>.</p>

          <h3>2.4 Advertising, Analytics, and Data Processing</h3>
          <p>The App uses third-party service providers to authenticate accounts, process subscriptions, analyze product usage, and measure and optimize our advertising. These include AppsFlyer, Meta (Facebook), Firebase (Google), RevenueCat, and PostHog. With your permission through Apple's App Tracking Transparency prompt, we access your device advertising identifier (IDFA) and share product-interaction and purchase events with our advertising and measurement partners, which may involve tracking across apps and websites owned by other companies. You can decline or withdraw this permission at any time through the App Tracking Transparency prompt or in iOS Settings. How we collect, use, and share this data — and how to opt out — is described in our <Link href="/privacy">Privacy Policy</Link>, which is incorporated into these Terms by reference. Acknowledging these Terms or the Privacy Policy is not a substitute for any separately required permission or affirmative consent.</p>
        </section>

        <section>
          <h2>3. User Rights and Obligations</h2>
          
          <h3>3.1 Age and Consent</h3>
          <p>Spool is not intended for children under 13. If you are 13 or older but have not reached the age required to enter into these Terms where you live, a parent or guardian must agree to these Terms for you. You are responsible for maintaining the confidentiality of your account.</p>

          <h3>3.2 Acceptable Use</h3>
          <p>You agree not to:</p>
          <ul>
            <li>Circumvent or attempt to circumvent the App's blocking mechanisms.</li>
            <li>Use the App for any unlawful purpose.</li>
            <li>Reverse engineer or attempt to extract the source code.</li>
            <li>Use the App in any way that could damage or overburden our infrastructure.</li>
          </ul>
          <p>You are responsible for all activity that occurs under your account.</p>
        </section>

        <section>
          <h2>4. Changes to Service</h2>
          <p>We reserve the right to:</p>
          <ul>
            <li>Modify or discontinue any part of the service.</li>
            <li>Change subscription prices or availability.</li>
            <li>Update these Terms with reasonable notice where required. This revision does not establish that earlier customers accepted new wording or gave new data-sharing consent.</li>
          </ul>
        </section>

        <section>
          <h2>5. Limitation of Liability</h2>
          <p>Nothing in these Terms excludes or limits any statutory warranty, remedy, liability, or consumer right that cannot lawfully be excluded or limited.</p>
          <p>To the extent permitted by applicable law, the App is provided "as is" without additional warranties, and our responsibility is limited for:</p>
          <ul>
            <li>Inability to access blocked apps.</li>
            <li>Any consequences of app blocking or unblocking.</li>
            <li>Screen time tracking accuracy.</li>
            <li>Interruptions in service availability.</li>
            <li>Any losses or damages resulting from your use of the App.</li>
          </ul>
        </section>

        <section>
          <h2>6. Termination</h2>
          <p>We reserve the right to terminate or suspend access to the App for violations of these Terms or other lawful reasons, subject to applicable notice, refund, and consumer-rights requirements.</p>
        </section>

        <section>
          <h2>7. Contact</h2>
          <p>If you have any questions about these Terms, please contact us at <a href="mailto:team@thespoolapp.com">team@thespoolapp.com</a>.</p>
        </section>

        <div className="terms-footer">
          <p>© {new Date().getFullYear()} Spool. All rights reserved.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfServicePage;
