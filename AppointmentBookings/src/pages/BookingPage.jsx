<<<<<<< HEAD
import fullLogo from '../assets/book35_logo_full.png';
import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/CustomerBooking.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const money = (minorUnits = 0, currency = 'NGN') => {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(minorUnits / 100);
  } catch {
    return `${currency} ${(minorUnits / 100).toFixed(2)}`;
  }
};

const formatDuration = (minutes) => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins} min`;
  if (!mins) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
};

const formatDate = (dateString) => new Intl.DateTimeFormat(undefined, {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
}).format(new Date(`${dateString}T12:00:00`));

const formatTime = (iso) => new Intl.DateTimeFormat(undefined, {
  hour: 'numeric', minute: '2-digit'
}).format(new Date(iso));

const toLocalISO = (date, time) => {
  const [hours, minutes] = time.split(':').map(Number);
  const value = new Date(date);
  value.setHours(hours, minutes, 0, 0);
  return value.toISOString();
};

export const BookingPage = () => {
  const { providerSlug } = useParams();
  const [provider, setProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    notes: ''
  });

  const today = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const [providerResponse, servicesResponse] = await Promise.all([
          fetch(`${API_BASE}/public/providers/${encodeURIComponent(providerSlug)}`),
          fetch(`${API_BASE}/public/providers/${encodeURIComponent(providerSlug)}/services`)
        ]);

        const providerData = await providerResponse.json().catch(() => ({}));
        const servicesData = await servicesResponse.json().catch(() => ({}));

        if (!providerResponse.ok) throw new Error(providerData.message || 'This booking page could not be found.');
        if (!servicesResponse.ok) throw new Error(servicesData.message || 'Services could not be loaded.');
        if (cancelled) return;

        const loadedServices = servicesData?.data?.services || [];
        setProvider(providerData?.data?.provider || null);
        setServices(loadedServices);
        setSelectedService(loadedServices[0] || null);
      } catch (err) {
        if (!cancelled) setError(err.message || 'Something went wrong while loading this booking page.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [providerSlug]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));

  const startISO = form.date && form.time ? toLocalISO(form.date, form.time) : '';
  const endISO = startISO && selectedService
    ? new Date(new Date(startISO).getTime() + selectedService.durationMinutes * 60000).toISOString()
    : '';

  const validateDetails = () => {
    if (!selectedService) return 'Please select a service.';
    if (!form.date || !form.time) return 'Please choose a date and start time.';
    if (new Date(startISO) <= new Date()) return 'Please choose a future date and time.';
    return '';
  };

  const submitBooking = async (event) => {
    event.preventDefault();
    setError('');
    const validation = validateDetails();
    if (validation) {
      setError(validation);
      setStep(1);
      return;
    }
    if (!form.customerName.trim() || !form.customerEmail.trim()) {
      setError('Please enter your name and email address.');
      setStep(2);
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await fetch(`${API_BASE}/public/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: selectedService?.provider || provider?._id || provider?.id,
          service: selectedService._id || selectedService.id,
          customerName: form.customerName.trim(),
          customerEmail: form.customerEmail.trim(),
          customerPhone: form.customerPhone.trim(),
          startTime: startISO,
          endTime: endISO,
          notes: form.notes.trim()
        })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.message || 'We could not complete this booking. Please try another time.');
      setSuccess(data?.data?.appointment || { startTime: startISO, endTime: endISO });
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return <div className="customer-shell"><div className="loading-screen"><span className="loader" /><p>Loading booking page…</p></div></div>;
  }

  if (error && !provider) {
    return (
      <div className="customer-shell customer-centered">
        <div className="error-card">
          <div className="status-icon">!</div>
          <p className="eyebrow">BOOK35</p>
          <h1>Booking page unavailable</h1>
          <p>{error}</p>
          <Link className="customer-button customer-button-dark" to="/">Back to Book35</Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="customer-shell customer-centered">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <p className="eyebrow">BOOKING CONFIRMED</p>
          <h1>You’re booked.</h1>
          <p className="success-lead">Your appointment with <strong>{provider.businessName}</strong> has been received.</p>
          <div className="confirmation-box">
            <div><span>Service</span><strong>{selectedService.name}</strong></div>
            <div><span>Date</span><strong>{formatDate(form.date)}</strong></div>
            <div><span>Time</span><strong>{formatTime(success.startTime)} – {formatTime(success.endTime)}</strong></div>
            <div><span>Booked for</span><strong>{form.customerEmail}</strong></div>
          </div>
          <p className="small-note">Keep this information for your records. The provider will handle any further appointment communication.</p>
          <Link className="customer-button customer-button-dark" to="/">Return to Book35</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-shell">
      <header className="customer-topbar">
        <Link to="/" className="brand-lockup" aria-label="Book35 home">
          <img className="booking-full-logo" src={fullLogo} alt="Book35" />
        </Link>
        <div className="secure-label"><span>●</span> Secure booking</div>
      </header>

      <main className="booking-layout">
        <aside className="provider-panel">
          <div className="provider-orb">{(provider.businessName || provider.name || 'B').charAt(0).toUpperCase()}</div>
          <p className="eyebrow">APPOINTMENT WITH</p>
          <h1>{provider.businessName || provider.name}</h1>
          {provider.businessName && provider.name && provider.name !== provider.businessName && <p className="provider-name">{provider.name}</p>}
          {provider.bio && <p className="provider-bio">{provider.bio}</p>}
          <div className="provider-divider" />
          <div className="provider-detail"><span className="detail-dot" />Choose a service</div>
          <div className="provider-detail"><span className="detail-dot" />Pick a convenient time</div>
          <div className="provider-detail"><span className="detail-dot" />Confirm your details</div>
          <div className="provider-footer">Powered by <strong>Book35</strong></div>
        </aside>

        <section className="booking-panel">
          <div className="progress-row">
            {[['01', 'Service'], ['02', 'Date & time'], ['03', 'Your details']].map(([number, label], index) => {
              const current = index + 1;
              return <div key={number} className={`progress-item ${step >= current ? 'active' : ''}`}><span>{number}</span><small>{label}</small></div>;
            })}
          </div>

          {error && <div className="inline-error"><span>!</span>{error}<button type="button" onClick={() => setError('')}>×</button></div>}

          {step === 1 && (
            <div className="booking-step enter-step">
              <div className="step-heading"><p className="eyebrow">STEP 01</p><h2>What would you like to book?</h2><p>Select a service to see its duration and price.</p></div>
              {services.length === 0 ? (
                <div className="empty-state"><div>◌</div><h3>No services available</h3><p>This provider has not published a bookable service yet.</p></div>
              ) : (
                <>
                  <div className="service-list">
                    {services.map((service) => (
                      <button type="button" key={service._id} className={`service-card ${selectedService?._id === service._id ? 'selected' : ''}`} onClick={() => setSelectedService(service)}>
                        <span className="service-check">{selectedService?._id === service._id ? '✓' : ''}</span>
                        <span className="service-main"><strong>{service.name}</strong><span>{service.description || 'Appointment with this provider'}</span></span>
                        <span className="service-meta"><strong>{money(service.priceMinorUnits, service.currency)}</strong><span>{formatDuration(service.durationMinutes)}</span></span>
                      </button>
                    ))}
                  </div>
                  <button type="button" className="customer-button customer-button-coral full-width" disabled={!selectedService} onClick={() => setStep(2)}>Continue <span>→</span></button>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="booking-step enter-step">
              <div className="step-heading"><p className="eyebrow">STEP 02</p><h2>Choose your date and time</h2><p>Your appointment will be booked for the selected service duration.</p></div>
              <div className="selected-service-mini"><div><span>Selected service</span><strong>{selectedService?.name}</strong></div><button type="button" onClick={() => setStep(1)}>Change</button></div>
              <div className="date-time-grid">
                <label className="booking-field"><span>Date</span><input type="date" min={today} value={form.date} onChange={(e) => update('date', e.target.value)} /></label>
                <label className="booking-field"><span>Start time</span><input type="time" value={form.time} onChange={(e) => update('time', e.target.value)} /></label>
              </div>
              {form.date && form.time && selectedService && (
                <div className="time-preview"><span>Appointment</span><strong>{formatDate(form.date)} · {form.time}</strong><small>Ends {formatTime(endISO)} · {formatDuration(selectedService.durationMinutes)}</small></div>
              )}
              <div className="availability-note"><span>i</span><p>The provider's availability is checked when you confirm your booking. If the selected time has just been taken, you’ll be asked to choose another.</p></div>
              <div className="step-actions"><button type="button" className="customer-button customer-button-light" onClick={() => setStep(1)}>← Back</button><button type="button" className="customer-button customer-button-coral" onClick={() => { const v = validateDetails(); if (v) setError(v); else { setError(''); setStep(3); }}}>Continue <span>→</span></button></div>
            </div>
          )}

          {step === 3 && (
            <form className="booking-step enter-step" onSubmit={submitBooking}>
              <div className="step-heading"><p className="eyebrow">STEP 03</p><h2>Tell us about you</h2><p>These details will be shared with the provider for your appointment.</p></div>
              <div className="your-appointment"><div><span>Appointment</span><strong>{selectedService?.name}</strong></div><div><span>When</span><strong>{formatDate(form.date)} · {form.time}</strong></div><div><span>Duration</span><strong>{formatDuration(selectedService?.durationMinutes)}</strong></div></div>
              <div className="form-grid">
                <label className="booking-field full"><span>Full name *</span><input required maxLength="100" value={form.customerName} onChange={(e) => update('customerName', e.target.value)} placeholder="e.g. Ada Okafor" autoComplete="name" /></label>
                <label className="booking-field"><span>Email address *</span><input required type="email" value={form.customerEmail} onChange={(e) => update('customerEmail', e.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
                <label className="booking-field"><span>Phone number</span><input type="tel" value={form.customerPhone} onChange={(e) => update('customerPhone', e.target.value)} placeholder="+234 800 000 0000" autoComplete="tel" /></label>
                <label className="booking-field full"><span>Notes <em>Optional</em></span><textarea maxLength="1000" rows="4" value={form.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Anything the provider should know before your appointment?" /></label>
              </div>
              <div className="step-actions"><button type="button" className="customer-button customer-button-light" onClick={() => setStep(2)}>← Back</button><button type="submit" className="customer-button customer-button-coral" disabled={submitLoading}>{submitLoading ? <><span className="button-loader" />Booking…</> : <>Confirm booking <span>→</span></>}</button></div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
};
=======






export const BookingPage=()=>{
  return (
    <div>
      Booking Page
    </div>
  );
}
>>>>>>> origin/Appointment-Booking
