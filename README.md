# Kshitij Tourism Private Limited

Company website — plain HTML/CSS/vanilla JS, no framework, no build step. Chosen for speed (no JS bundle to download/parse) and low maintenance (no dependencies to patch or upgrade). Open `index.html` directly, or serve with any static host (GitHub Pages is already wired up).

## Structure
- `index.html` — page content/sections
- `style.css` — all styling
- `script.js` — nav toggle, enquiry tabs, destination cards, and the optimistic-UI form handlers
- `assets/logo.jpg` — company logo

## Optimistic UI
Enquiry widget, destination "Enquire Now", newsletter signup, and the contact form all update their button to the success state immediately, then perform the real action (open WhatsApp / save locally) in the background — rolling back to an error state only if that action actually fails (e.g. pop-up blocked). See `optimisticSubmit()` in `script.js`.

## Edit
- Text/contact details: edit directly in `index.html`.
- Destinations: edit the `DESTINATIONS` array at the top of `script.js`.
- WhatsApp number: `WHATSAPP_NUMBER` constant in `script.js`.

## Known placeholders
Destination images are CSS gradients, not real photos — swap in licensed photography when available (see `.dest-img` in `style.css`).
