# UMS Landing

The repository root is the canonical source for the Untitled Management Software landing site. `dist/` is generated and remains ignored.

## Build and preview

```sh
./scripts/build-static.sh
python3 -m http.server 4173 --directory dist
```

The UCD campaign page is available at `http://localhost:4173/ucd/`.

## UCD launch backend dependencies

The static client calls the UMS-owned API at `https://app.untitledmanagementsoftware.com` with `credentials: omit`:

- `POST /api/launch/events` with `event`, `occurredAt`, `page: "ucd"`, and optional allowlisted attribution.
- `POST /api/launch/waitlist` with `email`, `list`, `consent`, `source`, and optional allowlisted attribution.

The backend must return `202` for a new waitlist entry and may return `409` for an existing entry. Before public launch, the app must also preserve signup attribution, verify eligible `@ucdconnect.ie` accounts, grant `ucd_autumn_2026` access through 17 January 2027, and bypass billing for those users.

The API must allow CORS requests from `https://untitledmanagementsoftware.com`, accept JSON request bodies, and require no cookies or browser credentials for these two launch endpoints.
