# UMS Landing

The repository root is the canonical source for the Untitled Management Software landing site. `dist/` is generated and remains ignored.

## Build and preview

```sh
./scripts/build-static.sh
python3 -m http.server 4173 --directory dist
```

The campus campaign pages are available at `http://localhost:4173/ucd/` and `http://localhost:4173/palomar/`.

## Campus launch backend dependencies

The static client calls the UMS-owned API at `https://app.untitledmanagementsoftware.com` with `credentials: omit`:

- `POST /api/launch/events` with `event`, `occurredAt`, the campus `page`, and optional allowlisted attribution.
- `POST /api/launch/waitlist` with `email`, `list`, `consent`, `source`, and optional allowlisted attribution.

The backend must return `202` for a new waitlist entry and may return `409` for an existing entry. Before public launch, the app must preserve `ucd_landing` and `palomar_landing` attribution; verify exact-domain `@ucdconnect.ie` and `@student.palomar.edu` addresses; grant `ucd_autumn_2026` or `palomar_autumn_2026` through 17 January 2027; and bypass ordinary trial billing for those journeys.

Each campus page declares its page, source, and incoming-list values through `data-*` attributes. `assets/js/landing.js` reads those values and must not hardcode either institution. UCD and Palomar incoming-student lists use separate double-opt-in records and SendGrid suppression groups.

The API must allow CORS requests from `https://untitledmanagementsoftware.com`, accept JSON request bodies, and require no cookies or browser credentials for these two launch endpoints.
