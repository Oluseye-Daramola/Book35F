import { useEffect, useMemo, useRef, useState } from 'react';
import logoImg from '../assets/book35_logo_full.png';
import './ProviderDashboard.css';

const initialBookings = [
  {
    id: 1,
    client: 'John Doe',
    email: 'john.doe@example.com',
    date: '2026-10-10',
    time: '10:00',
    service: 'Service A',
    price: 45,
    status: 'Pending',
  },
  {
    id: 2,
    client: 'Jane Smith',
    email: 'jane.smith@example.com',
    date: '2026-10-12',
    time: '14:00',
    service: 'Service B',
    price: 65,
    status: 'Confirmed',
  },
  {
    id: 3,
    client: 'Alex Morgan',
    email: 'alex.morgan@example.com',
    date: '2026-10-14',
    time: '09:30',
    service: 'Service A',
    price: 45,
    status: 'Pending',
  },
];

const formatDate = (date) =>
  new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export const ProviderDashboard = () => {
  const [provider, setProvider] = useState({
    name: 'Provider Name',
    rating: 4.8,
    location: 'Lagos',
    services: ['Service A', 'Service B'],
  });
  const [bookings, setBookings] = useState(initialBookings);
  const [availability, setAvailability] = useState([]);
  const [filter, setFilter] = useState('All bookings');
  const [search, setSearch] = useState('');
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [profileName, setProfileName] = useState(provider.name);
  const [profileLocation, setProfileLocation] = useState(provider.location);
  const [profileService, setProfileService] = useState(provider.services[0] ?? '');
  const [slotDate, setSlotDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(
    () => window.location.hash.slice(1) || 'dashboard',
  );
  const mobileMenuButtonRef = useRef(null);

  useEffect(() => {
    const syncActiveSection = () => {
      const section = window.location.hash.slice(1);
      setActiveSection(
        ['dashboard', 'bookings', 'availability', 'calendar'].includes(section)
          ? section
          : 'dashboard',
      );
    };

    window.addEventListener('hashchange', syncActiveSection);
    syncActiveSection();

    return () => window.removeEventListener('hashchange', syncActiveSection);
  }, []);

  useEffect(() => {
    if (!isMobileNavOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMobileNavOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };
    const closeOnDesktop = () => {
      if (window.innerWidth > 860) setIsMobileNavOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    window.addEventListener('resize', closeOnDesktop);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      window.removeEventListener('resize', closeOnDesktop);
    };
  }, [isMobileNavOpen]);

  const filteredBookings = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesStatus = filter === 'All bookings' || booking.status === filter;
      const matchesSearch =
        !query ||
        [booking.client, booking.service, booking.date, booking.status]
          .join(' ')
          .toLowerCase()
          .includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, filter, search]);

  const pendingCount = bookings.filter((booking) => booking.status === 'Pending').length;
  const confirmedCount = bookings.filter((booking) => booking.status === 'Confirmed').length;
  const activeBooking = bookings.find((booking) => booking.id === expandedBooking);
  const calendarItems = [
    ...bookings
      .filter((booking) => booking.status !== 'Cancelled')
      .map((booking) => ({
        id: `booking-${booking.id}`,
        date: booking.date,
        time: booking.time,
        title: `${booking.client} · ${booking.service}`,
        detail: booking.status,
      })),
    ...availability.map((slot) => ({
      id: `availability-${slot.id}`,
      date: slot.date,
      time: slot.time,
      title: 'Available time',
      detail: 'Open for booking',
    })),
  ].sort((first, second) =>
    `${first.date}T${first.time}`.localeCompare(`${second.date}T${second.time}`),
  );

  const updateBookingStatus = (id, status) => {
    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === id ? { ...booking, status } : booking,
      ),
    );
  };

  const saveProfile = (event) => {
    event.preventDefault();
    if (!profileName.trim() || !profileLocation.trim() || !profileService.trim()) {
      setFormMessage('Name, location, and service are required.');
      return;
    }
    setProvider((currentProvider) => ({
      ...currentProvider,
      name: profileName.trim(),
      location: profileLocation.trim(),
      services: [profileService.trim(), ...currentProvider.services.slice(1)],
    }));
    setShowProfileForm(false);
    setFormMessage('Profile updated.');
  };

  const addAvailability = (event) => {
    event.preventDefault();
    setAvailability((currentAvailability) => [
      ...currentAvailability,
      { id: Date.now(), date: slotDate, time: slotTime },
    ]);
    setSlotDate('');
    setSlotTime('');
    setShowAvailabilityForm(false);
    setFormMessage('Availability added.');
  };

  return (
    <div className="pd-layout">
      <aside
        className={`pd-sidebar${isMobileNavOpen ? ' pd-sidebar-open' : ''}`}
        aria-label="Provider dashboard navigation"
      >
        <div className="pd-sidebar-top">
          <div className="pd-sidebar-welcome">
            <p>Provider workspace</p>
            <strong>{provider.name}</strong>
          </div>
          <button
            className="pd-mobile-menu-toggle"
            type="button"
            ref={mobileMenuButtonRef}
            aria-label={isMobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileNavOpen}
            aria-controls="pd-navigation"
            onClick={() => setIsMobileNavOpen((open) => !open)}
          >
            <span className={`pd-menu-icon${isMobileNavOpen ? ' pd-menu-icon-open' : ''}`} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span>{isMobileNavOpen ? 'Close' : 'Menu'}</span>
          </button>
        </div>
        <p className="pd-nav-heading">Manage</p>
        <nav className="pd-nav" id="pd-navigation" aria-label="Dashboard sections">
          <a
            href="#dashboard"
            aria-current={activeSection === 'dashboard' ? 'location' : undefined}
            onClick={() => {
              setActiveSection('dashboard');
              setIsMobileNavOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="3.5" width="7" height="7" rx="1" />
              <rect x="13.5" y="3.5" width="7" height="7" rx="1" />
              <rect x="3.5" y="13.5" width="7" height="7" rx="1" />
              <rect x="13.5" y="13.5" width="7" height="7" rx="1" />
            </svg>
            <span>Dashboard</span>
          </a>
          <a
            href="#availability"
            aria-current={activeSection === 'availability' ? 'location' : undefined}
            onClick={() => {
              setActiveSection('availability');
              setIsMobileNavOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
              <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17M8 13h3m2.5 0H16m-8 3.5h3" />
            </svg>
            <span>Availability</span>
          </a>
          <a
            href="#bookings"
            aria-current={activeSection === 'bookings' ? 'location' : undefined}
            onClick={() => {
              setActiveSection('bookings');
              setIsMobileNavOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5h12M8 12h12M8 18.5h12" />
              <circle cx="4.5" cy="5.5" r=".75" />
              <circle cx="4.5" cy="12" r=".75" />
              <circle cx="4.5" cy="18.5" r=".75" />
            </svg>
            <span>Bookings</span>
            {pendingCount > 0 && (
              <>
                <span className="pd-nav-badge" aria-hidden="true">{pendingCount}</span>
                <span className="pd-visually-hidden">
                  {pendingCount} pending booking requests
                </span>
              </>
            )}
          </a>
          <a
            href="#calendar"
            aria-current={activeSection === 'calendar' ? 'location' : undefined}
            onClick={() => {
              setActiveSection('calendar');
              setIsMobileNavOpen(false);
            }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
              <path d="M7.5 3.5v3M16.5 3.5v3M3.5 9.5h17M8 13h2m3 0h3M8 16.5h2m3 0h3" />
            </svg>
            <span>Calendar</span>
          </a>
        </nav>
        <div className="pd-sidebar-account">
          <span className="pd-account-avatar" aria-hidden="true">
            {provider.name.trim().charAt(0).toUpperCase()}
          </span>
          <div className="pd-account-details">
            <strong title={provider.name}>{provider.name}</strong>
            <span>Provider account</span>
          </div>
          <a href="/login" title="Sign out">
            Sign out
          </a>
        </div>
      </aside>

      <main className="provider-dashboard" id="dashboard">
      <header className="pd-header">
        <div>
          <p className="pd-eyebrow">Provider Station</p>
          <h1>{provider.name}</h1>
          <p className="pd-location">{provider.location} ·Healthcare</p>
        </div>
        <img className="pd-brand-logo" src={logoImg} alt="Book35" />
        <div className="pd-header-actions">
          <span className="pd-rating" aria-label={`Rating ${provider.rating} out of 5`}>
            <span aria-hidden="true">★</span> {provider.rating}
          </span>
          <button
            className="pd-btn"
            onClick={() => {
              setProfileName(provider.name);
              setProfileLocation(provider.location);
              setProfileService(provider.services[0] ?? '');
              setShowProfileForm((show) => !show);
              setFormMessage('');
            }}
          >
            Edit profile
          </button>
          <button
            className="pd-btn primary"
            onClick={() => {
              setShowAvailabilityForm((show) => !show);
              setFormMessage('');
            }}
          >
            Add availability
          </button>
        </div>
      </header>

      {formMessage && <p className="pd-toast" role="status">{formMessage}</p>}

      {showProfileForm && (
        <form className="pd-inline-form" onSubmit={saveProfile}>
          <h2>Edit your profile</h2>
          <label>
            Display name
            <input
              required
              value={profileName}
              onChange={(event) => setProfileName(event.target.value)}
            />
          </label>
          <label>
            Location
            <input
              required
              value={profileLocation}
              onChange={(event) => setProfileLocation(event.target.value)}
             />
          </label>
          <label>
            Service
            <input
              required
              value={profileService}
              onChange={(event) => setProfileService(event.target.value)}
            />
          </label>
          <div className="pd-form-actions">
            <button className="pd-btn" type="button" onClick={() => setShowProfileForm(false)}>
              Cancel
            </button>
            <button className="pd-btn primary" type="submit">Save profile</button>
          </div>
        </form>
      )}

      {showAvailabilityForm && (
        <form className="pd-inline-form" onSubmit={addAvailability}>
          <h2>Add an available time</h2>
          <div className="pd-form-fields">
            <label>
              Date
              <input
                type="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                value={slotDate}
                onChange={(event) => setSlotDate(event.target.value)}
              />
            </label>
            <label>
              Start time
              <input
                type="time"
                required
                value={slotTime}
                onChange={(event) => setSlotTime(event.target.value)}
              />
            </label>
          </div>
          <div className="pd-form-actions">
            <button className="pd-btn" type="button" onClick={() => setShowAvailabilityForm(false)}>
              Cancel
            </button>
            <button className="pd-btn primary" type="submit">Save time</button>
          </div>
        </form>
      )}

      <section className="pd-stats" aria-label="Dashboard summary">
        <article className="pd-stat-card">
          <span className="pd-stat-label">Total bookings</span>
          <strong>{bookings.length}</strong>
          <span className="pd-stat-note">All time</span>
        </article>
        <article className="pd-stat-card">
          <span className="pd-stat-label"></span>
          <strong>{pendingCount}</strong>
          <span className="pd-stat-note">Pending requests</span>
        </article>
        <article className="pd-stat-card">
          <span className="pd-stat-label">Confirmed</span>
          <strong>{confirmedCount}</strong>
          <span className="pd-stat-note">Upcoming appointments</span>
        </article>
        <article className="pd-stat-card">
          <span className="pd-stat-label">Services</span>
          <strong>{provider.services.length}</strong>
          <span className="pd-stat-note">Available to book</span>
        </article>
      </section>

      <section className="pd-panel pd-section">
        <div className="pd-section-heading">
          <div>
            <p className="pd-eyebrow">Your services</p>
            <h2>Services</h2>
          </div>
          <span className="pd-muted">{provider.services.length} listed</span>
        </div>
        <ul className="pd-services">
          {provider.services.map((service) => <li key={service}>{service}</li>)}
        </ul>
      </section>

      <section className="pd-panel pd-section" id="bookings">
        <div className="pd-section-heading pd-booking-heading">
          <div>
            <p className="pd-eyebrow">Keep everything on track</p>
            <h2>Bookings</h2>
          </div>
          <div className="pd-booking-tools">
            <label className="pd-search-label">
              <span className="pd-visually-hidden">Search bookings</span>
              <input
                type="search"
                placeholder="Search clients or services"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label>
              <span className="pd-visually-hidden">Filter bookings</span>
              <select value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option>All bookings</option>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Cancelled</option>
              </select>
            </label>
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="pd-empty-state">
            <strong>No bookings found</strong>
            <p>Try another search or choose a different status filter.</p>
          </div>
        ) : (
          <div className="pd-table-wrap">
            <table className="pd-table">
              <thead>
                <tr>
                  <th scope="col">Client</th>
                  <th scope="col">Date &amp; time</th>
                  <th scope="col">Service</th>
                  <th scope="col">Status</th>
                  <th scope="col"><span className="pd-visually-hidden">Actions</span></th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>{booking.client}</strong>
                      <span className="pd-cell-subtitle">{booking.email}</span>
                    </td>
                    <td>{formatDate(booking.date)}<span className="pd-cell-subtitle">{booking.time}</span></td>
                    <td>{booking.service}<span className="pd-cell-subtitle">${booking.price}</span></td>
                    <td><span className={`pd-status pd-status-${booking.status.toLowerCase()}`}>{booking.status}</span></td>
                    <td className="pd-row-actions">
                      <button
                        className="pd-small"
                        aria-expanded={expandedBooking === booking.id}
                        onClick={() => setExpandedBooking((current) =>
                          current === booking.id ? null : booking.id,
                        )}
                      >
                        {expandedBooking === booking.id ? 'Hide details' : 'Details'}
                      </button>
                      {booking.status === 'Pending' && (
                        <>
                          <button className="pd-small pd-accept" onClick={() => updateBookingStatus(booking.id, 'Confirmed')}>
                            Accept
                          </button>
                          <button className="pd-small pd-decline" onClick={() => updateBookingStatus(booking.id, 'Cancelled')}>
                            Decline
                          </button>
                        </>
                      )}
                      {booking.status === 'Confirmed' && (
                        <button className="pd-small pd-decline" onClick={() => updateBookingStatus(booking.id, 'Cancelled')}>
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {activeBooking && (
          <div className="pd-detail-panel">
            <strong>Booking details</strong>
            <p>
              {activeBooking.client} booked {activeBooking.service} on{' '}
              {formatDate(activeBooking.date)} at {activeBooking.time}.
            </p>
          </div>
        )}
      </section>

      <section className="pd-panel pd-section" id="availability">
        <div className="pd-section-heading">
          <div>
            <p className="pd-eyebrow">Manage your schedule</p>
            <h2>Availability</h2>
          </div>
          <button className="pd-text-button" onClick={() => {
            setShowAvailabilityForm(true);
            setFormMessage('');
          }}>
            + Add time
          </button>
        </div>
        {availability.length === 0 ? (
          <p className="pd-availability-empty">No extra availability added yet. Add a time to let clients book you.</p>
        ) : (
          <ul className="pd-availability-list">
            {availability.map((slot) => (
              <li key={slot.id}>
                <span>{formatDate(slot.date)} <strong>{slot.time}</strong></span>
                <button
                  className="pd-text-button"
                  onClick={() => setAvailability((current) => current.filter((item) => item.id !== slot.id))}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="pd-panel pd-section" id="calendar">
        <div className="pd-section-heading">
          <div>
            <p className="pd-eyebrow">Your schedule</p>
            <h2>Calendar</h2>
          </div>
          <span className="pd-muted">{calendarItems.length} upcoming</span>
        </div>
        {calendarItems.length === 0 ? (
          <p className="pd-availability-empty">Your calendar is clear. Add availability or accept a booking to get started.</p>
        ) : (
          <ul className="pd-calendar-list">
            {calendarItems.map((item) => (
              <li key={item.id}>
                <time dateTime={`${item.date}T${item.time}`}>
                  <strong>{formatDate(item.date)}</strong>
                  <span>{item.time}</span>
                </time>
                <span className="pd-calendar-title">{item.title}</span>
                <span className="pd-calendar-detail">{item.detail}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      </main>
    </div>
  );
};
