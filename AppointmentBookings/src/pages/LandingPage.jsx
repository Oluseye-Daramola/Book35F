<<<<<<< HEAD
import heroAsset from '../assets/hero.png';
import fullLogo from '../assets/book35_logo_full.png';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CustomerLanding.css';

export const LandingPage = () => {
  const navigate = useNavigate();
  const [bookingLink, setBookingLink] = useState('');
  const [linkError, setLinkError] = useState('');

  const openBooking = (event) => {
    event.preventDefault();
    setLinkError('');
    const value = bookingLink.trim();
    if (!value) {
      setLinkError('Enter your booking link to continue.');
      return;
    }
    try {
      const url = new URL(value);
      const match = url.pathname.match(/\/book\/([^/]+)/i);
      if (match?.[1]) return navigate(`/book/${match[1]}`);
    } catch {
      // Allow customers to paste a plain slug as well.
    }
    const slug = value.replace(/^.*\/book\//i, '').replace(/^\//, '').replace(/\/$/, '');
    if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)) return navigate(`/book/${slug}`);
    setLinkError('That does not look like a valid Book35 booking link.');
  };

  return (
    <div className="customer-landing">
      <header className="landing-nav">
        <a className="landing-brand" href="/" aria-label="Book35 home">
          <img className="landing-full-logo" src={fullLogo} alt="Book35" />
        </a>
        <div className="landing-nav-note"><span className="live-dot" /> Simple booking, on your time</div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="hero-copy">
            <div className="landing-pill">YOUR TIME MATTERS</div>
            <h1>Book the time<br /><em>that works for you.</em></h1>
            <p>Got a Book35 link from a business or professional? Open it, choose a service, pick a time and you’re done.</p>
            <form className="booking-link-form" onSubmit={openBooking}>
              <div className="link-input-wrap"><span>↗</span><input value={bookingLink} onChange={(e) => setBookingLink(e.target.value)} placeholder="Paste your booking link" aria-label="Booking link" /><button type="submit">Open booking</button></div>
              {linkError && <small className="landing-error">{linkError}</small>}
            </form>
            <div className="trust-row"><span>✓ No account needed</span><span>✓ Quick booking</span><span>✓ Your details stay private</span></div>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="visual-glow" />
            <img className="hero-brand-asset" src={heroAsset} alt="" />
            <div className="calendar-card">
              <div className="calendar-head"><span>OCTOBER 2026</span><b>···</b></div>
              <div className="calendar-week"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div>
              <div className="calendar-grid">{Array.from({ length: 35 }, (_, i) => <span key={i} className={[7, 8, 14, 15, 21, 22, 28, 29].includes(i) ? 'muted' : i === 19 ? 'chosen' : ''}>{i < 3 ? '' : ((i - 2) % 30) + 1}</span>)}</div>
              <div className="calendar-selected"><div><span>SELECTED</span><strong>Tuesday, Oct 20</strong></div><b>10:30 AM</b></div>
            </div>
            <div className="floating-card floating-service"><span className="floating-icon">✓</span><div><small>BOOKED</small><strong>Consultation</strong></div></div>
            <div className="floating-card floating-duration"><span>30 min</span><small>appointment</small></div>
          </div>
        </section>

        <section className="landing-flow">
          <div className="flow-intro"><span>01 — HOW IT WORKS</span><h2>Nothing complicated.<br />Just a better way to book.</h2></div>
          <div className="flow-grid">
            <article><b>01</b><div className="flow-icon">↗</div><h3>Open their link</h3><p>Use the booking link shared by your provider, business or professional.</p></article>
            <article><b>02</b><div className="flow-icon">◷</div><h3>Choose your time</h3><p>Select the service and a time that fits naturally into your day.</p></article>
            <article><b>03</b><div className="flow-icon">✓</div><h3>Confirm & go</h3><p>Enter your details once, confirm your appointment and you’re set.</p></article>
          </div>
        </section>
      </main>
      <footer className="landing-footer"><span>Book35</span><span>Appointments made simple.</span></footer>
    </div>
  );
};
=======

import { Link } from 'react-router-dom';
import {Button} from '../components/Button';
import {Card} from '../components/Card';
import {Logo} from '../components/Logo';

import '../styles/Landing.css';






export const LandingPage=()=>{
  return (
    <div>
      
      <div className="hero">
        
        <div style={{ marginBottom: 20 }}>
          <Logo />
        </div>

        <p className="text-display">Appointment booking, made simple</p>
        <p style={{ marginTop: 10 }}>
          Set your hours once. Share a link. Let people book straight into
          your calendar.
        </p>

        <div className="hero-ctas">
          
          <Link to="/signup">
            <Button variant="accent">
              Get Started
            </Button>
          </Link>
          
          <Link to="/login">
            <Button variant="primary">
              Log In
            </Button>
          </Link>
          
        </div>
        
      </div>

      
      <div className="how-it-works">
        
        <Card>
          <h2>For providers</h2>
          <p>
            Set your availability. Share a link. Get bookings.
          </p>
        </Card>
        
        <Card>
          <h2>For customers</h2>
          <p>
            Click a link. Choose a time. Confirm your booking.
          </p>
        </Card>
        
      </div>
      
    </div>
    
  );
}
>>>>>>> origin/Appointment-Booking
