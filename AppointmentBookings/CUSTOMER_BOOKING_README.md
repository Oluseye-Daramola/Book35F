# Book35 Customer Booking

This section is customer-facing only.

## Customer flow

- `/` — customer booking landing page
- `/book/:providerSlug` — public provider booking page
- Provider/service data comes from the backend public API.
- Booking submission uses `POST /api/public/appointments`.

## API configuration

Copy `.env.example` to `.env` if the backend is not running on `http://localhost:5000/api` and set `VITE_API_BASE_URL` to the backend API base URL.

## Backend contract used

- `GET /api/public/providers/:slug`
- `GET /api/public/providers/:slug/services`
- `POST /api/public/appointments`

The backend currently performs the final conflict check when an appointment is submitted. It does not expose a public availability/slot-read endpoint, so this customer frontend does not invent availability data.
