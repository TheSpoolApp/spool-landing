"use client";
import React from 'react';
import { RefundDataSharing } from '../components/PolicyCopy';
import Logo from '../components/Logo/Logo.js';
import Footer from '../components/Footer/Footer.js';
import './PrivacyPolicyPage.css';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Logo />
      <div className="privacy-policy-container">
        <h1>Privacy Policy</h1>

        <p className="privacy-intro">At Spool, we believe your privacy is fundamental. This Privacy Policy explains how we collect, use, and protect your information when you use our app and services.</p>

        <p className="privacy-effective-date">Last Updated: October 12, 2026</p>
        <p>This policy covers Spool on iOS and Android. Apple-specific tracking and refund information applies to iOS; Android-specific information is described below. <a href="#delete-account">Request deletion of your Spool account and data.</a></p>

        <section>
          <h2>1. Information We Collect</h2>

          <h3>Information You Provide</h3>
          <ul>
            <li><strong>Account Information:</strong> Information you provide when creating or using an account, such as your name and email address, or your phone number if you choose phone sign-in. Downloading the app alone does not supply us with your email address or phone number</li>
            <li><strong>App Usage Data:</strong> Screen time metrics and app usage patterns to help you reduce screen time</li>
            <li><strong>Settings & Preferences:</strong> Your app settings, notifications preferences, and goals</li>
          </ul>

          <h3>Automatically Collected Information</h3>
          <ul>
            <li><strong>Device Information:</strong> Device type, operating system, and app version</li>
            <li><strong>Usage Analytics:</strong> How you interact with Spool to improve our services</li>
            <li><strong>Purchase and Refund Information:</strong> Subscription and transaction identifiers, purchase and access status, consent records, and relevant feature-use or support information used for purchase management and refund assessment (see Section 5)</li>
            <li><strong>Performance Data:</strong> Crash reports and performance metrics to ensure app reliability</li>
          </ul>

          <h3>Advertising & Device Identifiers</h3>
          <p>If you grant permission through Apple's App Tracking Transparency prompt (see Section 3), we also collect:</p>
          <ul>
            <li><strong>Device Identifier (IDFA):</strong> Your device's Identifier for Advertisers, used to measure and attribute app installs and in-app events</li>
            <li><strong>Product Interaction Events:</strong> Actions such as installs, key in-app interactions, and purchases, used to measure and optimize our advertising</li>
          </ul>
          <p>Consistent with our Apple App Privacy disclosures, Device ID and Product Interaction data may be linked to your identity and used to track you across apps and websites owned by other companies. See Section 3 for details and how to opt out.</p>

          <h3 id="android">Spool on Android</h3>
          <ul>
            <li><strong>Account and reflections:</strong> We use Firebase to store your account, questionnaire answers and app activity, such as completed onboarding, walk-away events, focus activities, rewards and streaks. Reasons you submit, recent reflection context and the requested app's display name may be sent to Spool's online analysis service to evaluate a request or generate insights. Confirmed reflections, requested minutes, timestamps and generated insights can be saved to your account.</li>
            <li><strong>Onboarding chat analytics:</strong> We use PostHog to understand and improve onboarding. During the chat, Spool sends events when you start, complete a section, skip or finish, including selected preset responses, time spent in chat sections, app and device technical information, and an anonymous installation identifier. This chat reporting does not include your entered name, account identifier, typed reflections or microphone audio. Android session replay and automatic screen and tap recording are disabled. Skipping the chat sends a skip event; it does not opt you out of analytics. This reporting is separate from account, reflection and subscription processing.</li>
            <li><strong>App blocking and Usage Access:</strong> With your permission, Spool uses Android Accessibility events and Usage Access to identify the foreground app, apply your blocking rules and measure time used. Spool can display a blocking screen and return you to the Home screen when you leave a blocked-app request. The installed-app list, selected package identifiers and raw usage events are processed on your device, rather than uploaded as an inventory or usage log. The requested app's display name can be included in a saved reflection. The Accessibility service does not read screen text, capture screenshots or record what you type.</li>
            <li><strong>Voice input:</strong> If you choose voice, Android's selected speech-recognition provider receives microphone audio and may process it on remote servers under that provider's privacy policy. Spool receives the transcript and does not save an audio recording itself. Text you submit is processed as a reflection. You can use typed input instead.</li>
            <li><strong>Camera and exercise:</strong> Mirror displays a local camera preview; exercise features analyze camera images on your device using Google ML Kit. Spool does not upload those images or pose coordinates. Earned minutes and completion records may be saved to your account. ML Kit also collects installation identifiers and technical information, such as device, app, performance and error data, to operate and improve its services.</li>
            <li><strong>Friends:</strong> If you use friend features, the email address you search for, friend requests and relationships are processed through Firebase. Adding or accepting friends lets those friends access permitted profile and reflection history, including reason text and app names. Spool does not read your device's address book.</li>
            <li><strong>Focus Web:</strong> Websites opened inside Spool receive browsing requests and information you enter or choose to upload. Spool applies supported filters and navigation controls inside this browser. Site sign-in, cookies and user-approved camera, microphone or file sharing are subject to the site's own privacy practices. Local camera processing described above does not apply to media you choose to share with a website.</li>
            <li><strong>Subscriptions and support:</strong> Google Play and RevenueCat process subscription and transaction information, with your Spool account identifier used to connect access to your account. External support services receive the messages and information you submit to them. Their privacy policies also apply.</li>
          </ul>
          <p>You can disable Spool's Accessibility service and Usage Access in Android Settings, and revoke microphone or camera permissions through Android's app permissions. Features that require those permissions will no longer work until you enable them again.</p>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul>
            <li>Provide personalized screen time insights and recommendations</li>
            <li>Help you track and achieve your digital wellness goals</li>
            <li>Send you important updates about Spool (you can opt out anytime)</li>
            <li>Improve our app's features and performance</li>
            <li>Measure, attribute, and optimize our advertising campaigns (with your permission — see Section 3)</li>
            <li>Ensure the security and proper functioning of our services</li>
          </ul>
        </section>

        <section>
          <h2>3. Tracking & Advertising</h2>

          <h3>App Tracking Transparency (ATT)</h3>
          <p>The first time it is relevant, Spool presents Apple's App Tracking Transparency (ATT) prompt asking for your permission to track. We only access your device advertising identifier (IDFA) and share data for cross-app advertising measurement <strong>if you grant this permission</strong>. If you decline, we do not access the IDFA or use it for advertising attribution.</p>

          <h3>Cross-App & Cross-Website Tracking for Ad Measurement</h3>
          <p>When you grant permission, we use the IDFA together with mobile measurement and advertising partners to understand which ads led to app installs and which product interactions and purchases followed. To do this, product-interaction and purchase events are shared with our advertising partners for advertising measurement and optimization. This activity may involve tracking you across apps and websites owned by other companies, as reflected in our Apple App Privacy label.</p>

          <h3>How to Opt Out</h3>
          <ul>
            <li><strong>At the prompt:</strong> Select "Ask App Not to Track" when the ATT prompt appears.</li>
            <li><strong>Anytime in Settings:</strong> Go to <strong>iOS Settings → Privacy & Security → Tracking</strong> and turn off tracking for Spool (or disable "Allow Apps to Request to Track" for all apps).</li>
            <li><strong>Effect:</strong> When tracking is off, Spool does not access your IDFA or share advertising identifiers for cross-app measurement. Core app features continue to work.</li>
          </ul>
          <p>You can also limit Meta's use of advertising data through your <a href="https://accountscenter.facebook.com/ads/manage_activity" target="_blank" rel="noopener noreferrer">Meta ad settings</a>.</p>
        </section>

        <section>
          <h2>4. Third-Party Service Providers</h2>
          <p>We work with trusted third parties who process data on our behalf to operate, secure, and improve Spool and to measure our advertising. These providers are permitted to use your information only to perform services for us. We encourage you to review their privacy policies:</p>
          <ul>
            <li><strong>AppsFlyer</strong> — mobile measurement and attribution (device identifiers, install and in-app events). <a href="https://www.appsflyer.com/legal/services-privacy-policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
            <li><strong>Meta (Facebook)</strong> — advertising attribution and optimization (product-interaction and purchase events). <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
            <li><strong>Firebase (Google)</strong> — authentication (information provided through your chosen sign-in method) and database. <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">Firebase Privacy</a> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
            <li><strong>RevenueCat</strong> — subscription and purchase management. <a href="https://www.revenuecat.com/privacy/" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
            <li><strong>PostHog</strong> — product analytics and session replay. <a href="https://posthog.com/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a></li>
            <li><strong>Google ML Kit (Android)</strong> — on-device camera analysis and associated technical diagnostics. <a href="https://developers.google.com/ml-kit/android-data-disclosure" target="_blank" rel="noopener noreferrer">Android data disclosure</a> · <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
          </ul>
          <p>Providers vary by platform and feature. Android voice input uses the speech-recognition provider selected on your device; websites and external support services have their own privacy practices.</p>
        </section>

        <section>
          <h2>5. Information Sharing</h2>
          <p>We do not sell or rent your personal information. We share information only in these limited circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> Trusted partners who help us operate, secure, analyze, and advertise Spool (see Section 4), under agreements that limit their use of your data.</li>
            <li><strong>Advertising Measurement:</strong> With your permission, we share advertising identifiers and product-interaction and purchase events with our measurement and advertising partners to attribute and optimize campaigns (see Section 3).</li>
            <li><strong>With Your Consent:</strong> When you explicitly agree to sharing.</li>
            <li><strong>Legal Requirements:</strong> When required by law or to protect our users' safety.</li>
            <li><strong>Business Transfers:</strong> In the unlikely event of a merger or acquisition.</li>
          </ul>

          <h3>Refund requests and sharing with Apple</h3>
          <RefundDataSharing />
        </section>

        <section>
          <h2>6. Your Privacy Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of your personal information</li>
            <li><strong>Update:</strong> Correct any inaccurate information</li>
            <li><strong>Delete:</strong> Request deletion of your account and data</li>
            <li><strong>Opt-out of Tracking:</strong> Decline or withdraw tracking permission at any time via the ATT prompt or iOS Settings (see Section 3)</li>
            <li><strong>Opt-out of Marketing:</strong> Unsubscribe from marketing communications</li>
          </ul>
          <h3 id="delete-account">Delete your Spool account and data</h3>
          <p>In Spool for Android, open <strong>Settings → Danger Zone → Delete Account</strong> and follow the prompts to verify ownership and confirm deletion. You can also request deletion without installing or signing in to the app: email <a href="mailto:team@thespoolapp.com?subject=Delete%20my%20Spool%20account">team@thespoolapp.com</a> with the subject <strong>Delete my Spool account</strong>. Include the email address or phone number linked to your account so support can verify ownership. Never send your password or a verification code.</p>
          <p>Your request covers your Spool account and associated profile, reflection history, insights and friend relationships. Additional cleanup and separately held subscription, purchase, refund, consent or support records may require manual processing or retention as explained in Section 7. Contact support for the status of your request and information about any remaining records; sending a request does not mean processing is complete.</p>
          <p>Account deletion does not cancel a subscription. Cancel separately through <a href="https://support.google.com/googleplay/answer/7018481?hl=en">Google Play subscription settings</a> or <a href="https://support.apple.com/en-us/118428">Apple subscription settings</a>, depending on where you purchased.</p>
        </section>

        <section>
          <h2>7. Data Retention</h2>
          <p>We retain information only as long as necessary for its purpose and applicable legal obligations. Account deletion removes the authentication account and selected account data; additional cleanup can require manual processing. Deleting an account or analytics data does not automatically delete separately held subscription, purchase, refund, consent, or support records, including records held by Apple, Google Play or our service providers. Retention and deletion of those records depend on their purpose and applicable legal requirements. Contact <a href="mailto:team@thespoolapp.com">team@thespoolapp.com</a> to request deletion or information about records that remain. Account deletion does not cancel an App Store or Google Play subscription.</p>
        </section>

        <section>
          <h2>8. Children's Privacy</h2>
          <p>Spool is not intended for children under 13. We do not knowingly collect personal information from children under 13, and we do not knowingly track or use the advertising identifier of anyone we know to be under 13. If we discover we have collected such information, we will delete it promptly.</p>
        </section>

        <section>
          <h2>9. Changes to This Policy</h2>
          <p>We may update this Privacy Policy occasionally. We will provide notice of material changes as required by applicable law. The revision date identifies this version; it does not establish that earlier customers accepted new wording or gave any required data-sharing consent.</p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or your personal information, please contact us:</p>
          <p><strong>Email:</strong> <a href="mailto:team@thespoolapp.com">team@thespoolapp.com</a></p>
          <p>We're committed to addressing your privacy concerns promptly and transparently.</p>
        </section>

        <div className="privacy-footer">
          <p>Thank you for trusting Spool with your digital wellness journey. We're here to help you spend more time living and less time unravelling.</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
