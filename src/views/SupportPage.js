"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Logo from '../components/Logo/Logo.js';
import Footer from '../components/Footer/Footer.js';
import './SupportPage.css';

const SupportPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const mailtoLink = `mailto:team@thespoolapp.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )}`;
    window.location.href = mailtoLink;
  };

  const faqs = [
    {
      question: "How does Spool help reduce screen time?",
      answer: "Spool uses 5-second voice check-ins before you open distracting apps. This mindful pause helps you become more aware of your usage patterns and make intentional choices about your phone use."
    },
    {
      question: "Can I customize which apps are blocked?",
      answer: "Yes! Spool offers flexible blocking where you can choose which apps require voice check-ins and customize your blocking schedule to fit your lifestyle."
    },
    {
      question: "How does friend accountability work?",
      answer: "You can connect with friends on Spool to share your intentions and progress. Friends can see your check-ins (if you choose to share) and provide encouragement to help you stay accountable to your goals."
    },
    {
      question: "What kind of insights does Spool provide?",
      answer: "Spool provides personalized insights about your app usage patterns, successful mindful pauses, and progress toward your screen time goals. Our AI helps identify trends and suggests improvements."
    }
  ];

  return (
    <>
      <Logo />
      <div className="support-page">
        {/* Hero Section */}
        <section className="support-hero">
          <div className="support-hero-content">
            <h1 className="support-title" data-aos="fade-up">
              💬 We're here to help
            </h1>
            <p className="support-subtitle" data-aos="fade-up" data-aos-delay="100">
              Got questions about Spool? Need assistance? We'd love to hear from you.
            </p>
            <nav className="support-quick-links" aria-label="Account help">
              <Link href="/privacy#delete-account">Delete your Spool account and data</Link>
              <a href="https://play.google.com/store/account/subscriptions">Manage Google Play subscriptions</a>
            </nav>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="contact-section">
          <div className="contact-container">
            <div className="contact-content">
              <div className="contact-info" data-aos="fade-right">
                <h2>Get in Touch</h2>
                <p><Link href="/privacy#delete-account"><strong>Delete your Spool account and data</strong></Link> — request deletion in the app or by email, even if you no longer have the app installed.</p>
                <p>For refund-data-sharing consent withdrawal or privacy requests, email <a href="mailto:team@thespoolapp.com">team@thespoolapp.com</a>. Sending a request is not confirmation that processing is complete.</p>
                <p><a href="https://support.apple.com/en-us/118428">Manage or cancel an Apple subscription</a> · <a href="https://support.apple.com/en-us/118223">Request an App Store refund</a></p>
                <p><a href="https://support.google.com/googleplay/answer/7018481?hl=en">Manage or cancel a Google Play subscription</a></p>
                <p><strong>Deleting your account does not cancel a subscription.</strong> Use the store where you purchased to cancel separately.</p>
                <p>Send us a message and we'll get back to you as soon as possible.</p>
                <div className="contact-details">
                  <div className="contact-item">
                    <span className="contact-icon">📧</span>
                    <div>
                      <strong>Email</strong>
                      <p>team@thespoolapp.com</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">𝕏</span>
                    <div>
                      <strong>Follow Us</strong>
                      <p><a href="https://twitter.com/the_spool_app" target="_blank" rel="noopener noreferrer">@the_spool_app</a></p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">👥</span>
                    <div>
                      <strong>Connect with Founders</strong>
                      <p>
                        <a href="https://twitter.com/prafull_truffle" target="_blank" rel="noopener noreferrer">@prafull_truffle</a> • 
                        <a href="https://twitter.com/whoelsebutns" target="_blank" rel="noopener noreferrer">@whoelsebutns</a> • 
                        <a href="https://x.com/JainamManot" target="_blank" rel="noopener noreferrer">@JainamManot</a>
                      </p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <span className="contact-icon">⚡</span>
                    <div>
                      <strong>Support</strong>
                      <p>Response times vary</p>
                    </div>
                  </div>
                </div>
              </div>

              <form className="contact-form" onSubmit={handleSubmit} data-aos="fade-left">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a topic</option>
                    <option value="Delete my Spool account">Delete my Spool account</option>
                    <option value="General Question">General Question</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                
                <button type="submit" className="submit-button">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="faq-container">
            <h2 className="faq-title" data-aos="fade-up">
              Frequently Asked Questions
            </h2>
            <div className="faq-grid">
              {faqs.map((faq, index) => (
                <div 
                  className="faq-item" 
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <h3 className="faq-question">{faq.question}</h3>
                  <p className="faq-answer">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default SupportPage;
