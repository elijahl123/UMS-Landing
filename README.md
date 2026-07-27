UMS-Landing

## Local CSS workflow

This static site uses Tailwind CSS with the `tw-` prefix so Tailwind utilities do not collide with Bootstrap classes used by the existing landing page.

- Edit `assets/css/tailwind.css`.
- Run `npm run build:css` to regenerate `assets/css/styles.min.css`.
- Use `npm run watch:css` while actively styling.

## Device mockups

The MacBook, iPhone, and feature mockups are self-contained, text-free vector representations of the UMS interface. They use layout, navigation shapes, and course color coding to suggest the real app without depending on captured account data or tiny UI copy.

- Edit `scripts/generate-device-mockups.js` when the represented app UI changes.
- Run `npm run build:mockups` to regenerate the responsive device and feature SVGs.

## Progressive web app

The landing page is installable and available offline through `manifest.json` and `sw.js`.

- Update `CACHE_NAME` in `sw.js` whenever cached production assets change.
- Keep new critical local assets in `APP_SHELL`.
- Test service workers through `http://localhost` or HTTPS; they do not run from a plain local file.

The page defers analytics and form enhancement and lazy-loads below-the-fold mockups.

## Production build

DigitalOcean App Platform deploys the generated static site from `dist/`.

- Run `npm run build` to regenerate assets and assemble the production directory.
- `npm ci` also runs the production build through `postinstall`, matching the DigitalOcean buildpack flow.
- Keep source-only files and licensed icon inputs outside `dist/`.

## Font Awesome Pro

The landing page uses a project-specific SVG sprite generated from the vendored Font Awesome Pro 7.3.1 Regular icons in `assets/vendor/fontawesome-pro/`.

- The commercial license notice is retained at `assets/vendor/fontawesome-pro/LICENSE.txt`.
- Run `npm run build:icons` after adding or replacing vendored SVG icons.
- Do not place Font Awesome package tokens or license keys in browser code or committed configuration.
