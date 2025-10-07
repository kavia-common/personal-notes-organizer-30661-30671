# Notes Frontend

This React app includes a top search bar that filters notes by title/content with a debounce and syncs the query to the URL (?q=).

- Theme: Ocean Professional (primary #2563EB, secondary #F59E0B, background #f9fafb, surface #ffffff, text #111827)
- Accessibility: aria-label on search input, keyboard focusable
- URL Sync: Updates ?q= and initializes from it on load
- Backend: If GET /notes?search=term is available, debounced calls are made and results displayed; otherwise client-side filtering is used.

## Scripts

- npm start
- npm run build
- npm test

```sh
npm install
npm start
```
