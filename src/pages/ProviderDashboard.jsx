import { useEffect, useMemo, useRef, useState } from 'react';
import logoImg from '../assets/book35_logo_full.png';
import '../styles/ProviderDashboard.css';

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

const parseDate = (date) => new Date(`${date}T00:00:00`);
const maxServiceDescriptionLength = 1000;

const startOfWeek = (date) => {
  const monday = new Date(date);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return monday;
};

const toDateKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const defaultAvatar = `data:image/svg+xml;utf8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
    <defs>
      <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#1B1F3B"/>
        <stop offset="100%" stop-color="#FF6B4A"/>
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="60" fill="url(#g)"/>
    <circle cx="60" cy="46" r="20" fill="#fff" fill-opacity="0.92"/>
    <path d="M28 92c10-16 25-24 32-24s22 8 32 24" fill="#fff" fill-opacity="0.92"/>
  </svg>
`)}`;

export const ProviderDashboard = () => {
  const [provider, setProvider] = useState({
    name: 'Provider Name',
    rating: 4.8,
    location: 'Lagos',
    services: [
      { name: 'Service A', description: '' },
      { name: 'Service B', description: '' },
    ],
    avatar: defaultAvatar,
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
  const [profileServices, setProfileServices] = useState(
    provider.services.map((service) => ({ ...service })),
  );
  const [serviceFormError, setServiceFormError] = useState('');
  const [profileImage, setProfileImage] = useState(provider.avatar || defaultAvatar);
  const [imageUploadError, setImageUploadError] = useState('');
  const [slotDate, setSlotDate] = useState('');
  const [slotStartTime, setSlotStartTime] = useState('');
  const [slotEndTime, setSlotEndTime] = useState('');
  const [slotDuration, setSlotDuration] = useState('30');
  const [availabilityFormError, setAvailabilityFormError] = useState('');
  const [calendarWeekStart, setCalendarWeekStart] = useState(() =>
    startOfWeek(parseDate(initialBookings[0].date)),
  );
  const [formMessage, setFormMessage] = useState('');
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDesktopNavCollapsed, setIsDesktopNavCollapsed] = useState(false);
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

  useEffect(() => {
    if (!showAvailabilityForm) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setShowAvailabilityForm(false);
    };

    document.body.classList.add('pd-modal-open');
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('pd-modal-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [showAvailabilityForm]);

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
  const currentWeekStart = startOfWeek(new Date());
  const nextWeekStart = new Date(currentWeekStart);
  nextWeekStart.setDate(nextWeekStart.getDate() + 7);
  const completedThisWeekCount = bookings.filter((booking) => {
    const completedAt = booking.completedAt;
    return (
      booking.status === 'Completed' &&
      completedAt >= toDateKey(currentWeekStart) &&
      completedAt < toDateKey(nextWeekStart)
    );
  }).length;
  const displayedServices = (showProfileForm ? profileServices : provider.services)
    .map((service) => service.name.trim())
    .filter(Boolean);
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
      time: slot.startTime,
      timeLabel: `${slot.startTime}–${slot.endTime}`,
      title: `${slot.duration}-minute slots`,
      detail: 'Open for booking',
    })),
  ].sort((first, second) =>
    `${first.date}T${first.time}`.localeCompare(`${second.date}T${second.time}`),
  );
  const calendarDays = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(calendarWeekStart);
    date.setDate(date.getDate() + index);
    const dateKey = toDateKey(date);
    return {
      date,
      dateKey,
      items: calendarItems.filter((item) => item.date === dateKey),
    };
  });

  const updateBookingStatus = (id, status) => {
    const completedAt = status === 'Completed' ? toDateKey(new Date()) : null;
    setBookings((currentBookings) =>
      currentBookings.map((booking) =>
        booking.id === id ? { ...booking, status, completedAt } : booking,
      ),
    );
  };

  const saveProfile = (event) => {
    event.preventDefault();
    const services = profileServices
      .map((service) => ({
        name: service.name.trim(),
        description: service.description.trim(),
      }))
      .filter((service) => service.name);

    if (services.some((service) => service.description.length > maxServiceDescriptionLength)) {
      setServiceFormError('Each service description must be 1,000 characters or fewer.');
      return;
    }
    if (!profileName.trim() || !profileLocation.trim() || services.length === 0) {
      setFormMessage('Name, location, and at least one service are required.');
      return;
    }
    setProvider((currentProvider) => ({
      ...currentProvider,
      name: profileName.trim(),
      location: profileLocation.trim(),
      services,
      avatar: profileImage || currentProvider.avatar || defaultAvatar,
    }));
    setShowProfileForm(false);
    setFormMessage('Profile updated.');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Please choose an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(typeof reader.result === 'string' ? reader.result : defaultAvatar);
      setImageUploadError('');
    };
    reader.onerror = () => {
      setImageUploadError('Unable to read the selected image.');
    };
    reader.readAsDataURL(file);
  };

  const openProfileForm = () => {
    setProfileName(provider.name);
    setProfileLocation(provider.location);
    setProfileServices(provider.services.map((service) => ({ ...service })));
    setServiceFormError('');
    setProfileImage(provider.avatar || defaultAvatar);
    setImageUploadError('');
    setShowProfileForm(true);
    setFormMessage('');
  };

  const addAvailability = (event) => {
    event.preventDefault();
    if (slotStartTime >= slotEndTime) {
      setAvailabilityFormError('End time must be later than start time.');
      return;
    }

    setAvailability((currentAvailability) => [
      ...currentAvailability,
      {
        id: Date.now(),
        date: slotDate,
        startTime: slotStartTime,
        endTime: slotEndTime,
        duration: Number(slotDuration),
      },
    ]);
    setAvailabilityFormError('');
    setCalendarWeekStart(startOfWeek(parseDate(slotDate)));
    setSlotDate('');
    setSlotStartTime('');
    setSlotEndTime('');
    setSlotDuration('30');
    setShowAvailabilityForm(false);
    setFormMessage('Availability added.');
  };

  const openAvailabilityForm = () => {
    setAvailabilityFormError('');
    setFormMessage('');
    setShowProfileForm(false);
    setShowAvailabilityForm(true);
  };

  return (
    <div className="pd-layout">
      <aside
        className={`pd-sidebar${isMobileNavOpen ? ' pd-sidebar-open' : ''}${isDesktopNavCollapsed ? ' pd-sidebar-collapsed' : ''}`}
        aria-label="Provider dashboard navigation"
      >
        <div className="pd-sidebar-top">
          <div className="pd-sidebar-welcome">
            <p>Provider workspace</p>
            <strong>{provider.name}</strong>
          </div>
          <button
            className="pd-desktop-sidebar-toggle"
            type="button"
            aria-label={isDesktopNavCollapsed ? 'Expand navigation panel' : 'Collapse navigation panel'}
            aria-expanded={!isDesktopNavCollapsed}
            aria-controls="pd-navigation"
            onClick={() => setIsDesktopNavCollapsed((collapsed) => !collapsed)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d={isDesktopNavCollapsed ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'} />
            </svg>
          </button>
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
              openAvailabilityForm();
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
          <button
            type="button"
            className="pd-account-avatar pd-account-avatar-button"
            aria-label={`Edit profile for ${provider.name}`}
            title="Edit profile"
            onClick={openProfileForm}
          >
            {provider.avatar ? (
              <img className="pd-account-image" src={provider.avatar} alt="" aria-hidden="true" />
            ) : (
              provider.name.trim().charAt(0).toUpperCase()
            )}
          </button>
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
        <div className="pd-header-identity">
          <div className="pd-header-avatar-wrap">
            {provider.avatar ? (
              <img className="pd-header-avatar" src={provider.avatar} alt="" aria-hidden="true" />
            ) : (
              <span className="pd-header-avatar pd-header-avatar-fallback" aria-hidden="true">
                {provider.name.trim().charAt(0).toUpperCase()}
              </span>
            )}
            <button
              type="button"
              className="pd-avatar-edit-button"
              aria-label="Edit profile image"
              title="Edit profile"
              onClick={openProfileForm}
            >
              ✎
            </button>
          </div>
          <div>
            <p className="pd-eyebrow">Provider Station</p>
            <h1>{provider.name}</h1>
            <p className="pd-location">
              {[provider.location, displayedServices.join(' · ')].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
        <img className="pd-brand-logo" src={logoImg} alt="Book35" />
        <div className="pd-header-actions">
          <button
            className="pd-btn"
            type="button"
            onClick={() => (showProfileForm ? setShowProfileForm(false) : openProfileForm())}
          >
            Edit Profile
          </button>
          <button
            className="pd-btn primary"
            onClick={openAvailabilityForm}
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
          <fieldset className="pd-service-fields">
            <legend>Services</legend>
            {profileServices.map((service, index) => (
              <div className="pd-service-entry" key={index}>
                <input
                  required
                  aria-label={`Service ${index + 1}`}
                  placeholder="Service name"
                  value={service.name}
                  onChange={(event) => {
                    setProfileServices((services) =>
                      services.map((currentService, serviceIndex) =>
                        serviceIndex === index
                          ? { ...currentService, name: event.target.value }
                          : currentService,
                      ),
                    );
                  }}
                />
                <button
                  className="pd-btn pd-small"
                  type="button"
                  aria-label={`Remove service ${index + 1}`}
                  onClick={() =>
                    setProfileServices((services) =>
                      services.filter((_, serviceIndex) => serviceIndex !== index),
                    )
                  }
                >
                  Remove
                </button>
                <label className="pd-service-description">
                  Description
                  <textarea
                    aria-label={`Description for service ${index + 1}`}
                    aria-describedby={`pd-service-description-count-${index}`}
                    aria-invalid={service.description.length > maxServiceDescriptionLength}
                    value={service.description}
                    maxLength={maxServiceDescriptionLength}
                    onChange={(event) => {
                      setServiceFormError('');
                      setProfileServices((services) =>
                        services.map((currentService, serviceIndex) =>
                          serviceIndex === index
                            ? { ...currentService, description: event.target.value }
                            : currentService,
                        ),
                      );
                    }}
                    rows={3}
                  />
                  <span id={`pd-service-description-count-${index}`}>
                    {service.description.length} / {maxServiceDescriptionLength} characters
                  </span>
                </label>
              </div>
            ))}
            <button
              className="pd-btn"
              type="button"
              onClick={() =>
                setProfileServices((services) => [
                  ...services,
                  { name: '', description: '' },
                ])
              }
            >
              Add service
            </button>
          </fieldset>
          {serviceFormError && (
            <p className="pd-form-error" role="alert">{serviceFormError}</p>
          )}
          <label className="pd-image-upload-label">
            Upload image
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>
          {imageUploadError && <p className="pd-form-error">{imageUploadError}</p>}
          <div className="pd-form-actions">
            <button className="pd-btn" type="button" onClick={() => setShowProfileForm(false)}>
              Cancel
            </button>
            <button className="pd-btn primary" type="submit">Save profile</button>
          </div>
        </form>
      )}

      {showAvailabilityForm && (
        <div
          className="pd-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowAvailabilityForm(false);
          }}
        >
          <form
            className="pd-availability-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pd-availability-title"
            onSubmit={addAvailability}
          >
            <div className="pd-modal-heading">
              <div>
                <p className="pd-eyebrow">Manage your schedule</p>
                <h2 id="pd-availability-title">Set availability</h2>
              </div>
              <button
                className="pd-modal-close"
                type="button"
                aria-label="Close availability form"
                onClick={() => setShowAvailabilityForm(false)}
              >
                ×
              </button>
            </div>
            <label>
              Date
              <input
                type="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                value={slotDate}
                onChange={(event) => setSlotDate(event.target.value)}
                autoFocus
              />
            </label>
            <div className="pd-form-fields">
              <label>
                Start time
                <input
                  type="time"
                  required
                  value={slotStartTime}
                  onChange={(event) => setSlotStartTime(event.target.value)}
                />
              </label>
              <label>
                End time
                <input
                  type="time"
                  required
                  value={slotEndTime}
                  min={slotStartTime || undefined}
                  onChange={(event) => setSlotEndTime(event.target.value)}
                />
              </label>
            </div>
            <label>
              Appointment duration
              <select
                value={slotDuration}
                onChange={(event) => setSlotDuration(event.target.value)}
              >
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="20">20 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </label>
            {availabilityFormError && (
              <p className="pd-form-error" role="alert">{availabilityFormError}</p>
            )}
            <div className="pd-form-actions">
              <button
                className="pd-btn"
                type="button"
                onClick={() => setShowAvailabilityForm(false)}
              >
                Cancel
              </button>
              <button className="pd-btn primary" type="submit">Save availability</button>
            </div>
          </form>
        </div>
      )}

      <section className="pd-stats" aria-label="Dashboard summary">
        <article className="pd-stat-card">
          <span className="pd-stat-label">Completed this week</span>
          <strong>{completedThisWeekCount}</strong>
          <span className="pd-stat-note">Completed appointments</span>
        </article>
        <article className="pd-stat-card">
          <span className="pd-stat-label">Total pending requests</span>
          <strong>{pendingCount}</strong>
          <span className="pd-stat-note">Waiting for review</span>
        </article>
        <article className="pd-stat-card">
          <span className="pd-stat-label">This week</span>
          <strong>{bookings.length}</strong>
          <span className="pd-stat-note">Scheduled in total</span>
        </article>
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
                <option>Completed</option>
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
                        <>
                          {new Date(`${booking.date}T${booking.time}:00`) <= new Date() && (
                            <button
                              className="pd-small pd-complete"
                              onClick={() => updateBookingStatus(booking.id, 'Completed')}
                            >
                              Mark complete
                            </button>
                          )}
                          <button className="pd-small pd-decline" onClick={() => updateBookingStatus(booking.id, 'Cancelled')}>
                            Cancel
                          </button>
                        </>
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
          <button className="pd-text-button" onClick={openAvailabilityForm}>
            + Add time
          </button>
        </div>
        {availability.length === 0 ? (
          <p className="pd-availability-empty">No extra availability added yet. Add a time to let clients book you.</p>
        ) : (
          <ul className="pd-availability-list">
            {availability.map((slot) => (
              <li key={slot.id}>
                <span>
                  {formatDate(slot.date)}{' '}
                  <strong>{slot.startTime}–{slot.endTime}</strong>
                  <span className="pd-availability-duration">{slot.duration}-minute appointments</span>
                </span>
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
        <div className="pd-section-heading pd-calendar-heading">
          <div>
            <p className="pd-eyebrow">Your schedule</p>
            <h2>
              Week of {calendarWeekStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            </h2>
          </div>
          <div className="pd-calendar-controls">
            <span className="pd-muted">{calendarItems.length} scheduled</span>
            <button
              className="pd-calendar-nav"
              type="button"
              aria-label="Previous week"
              onClick={() => setCalendarWeekStart((week) => {
                const previousWeek = new Date(week);
                previousWeek.setDate(previousWeek.getDate() - 7);
                return previousWeek;
              })}
            >
              ‹
            </button>
            <button
              className="pd-calendar-nav"
              type="button"
              aria-label="Next week"
              onClick={() => setCalendarWeekStart((week) => {
                const nextWeek = new Date(week);
                nextWeek.setDate(nextWeek.getDate() + 7);
                return nextWeek;
              })}
            >
              ›
            </button>
          </div>
        </div>
        {calendarItems.length === 0 ? (
          <p className="pd-availability-empty">Your calendar is clear. Add availability or accept a booking to get started.</p>
        ) : (
          <div className="pd-calendar-grid" aria-label="Weekly calendar">
            {calendarDays.map((day) => (
              <section
                className="pd-calendar-day"
                key={day.dateKey}
                aria-label={day.date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              >
                <h3>
                  <span>{day.date.toLocaleDateString(undefined, { weekday: 'short' }).toUpperCase()}</span>
                  <time dateTime={day.dateKey}>
                    {day.date.toLocaleDateString(undefined, { day: 'numeric' })}
                  </time>
                </h3>
                <div className="pd-calendar-day-slots">
                  {day.items.length === 0 ? (
                    <span className="pd-calendar-empty" aria-label="No appointments">—</span>
                  ) : (
                    day.items.map((item) => (
                      <article
                        className={`pd-calendar-slot${item.detail === 'Open for booking' ? ' pd-calendar-slot-open' : ' pd-calendar-slot-booked'}`}
                        key={item.id}
                      >
                        <time dateTime={`${item.date}T${item.time}`}>{item.timeLabel || item.time}</time>
                        <strong>{item.title}</strong>
                        <span>{item.detail}</span>
                      </article>
                    ))
                  )}
                </div>
              </section>
            ))}
          </div>
        )}
      </section>
      </main>
    </div>
  );
};
