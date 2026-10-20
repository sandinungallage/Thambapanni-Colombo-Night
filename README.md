# Thambapanni Colombo Night

Website for **Thambapanni Colombo Night** by Star Gate Events (Pvt) Ltd.
Phase 1 took place on 29 August 2025 at Arcade Independence Square, Colombo. Phase 2 returns in 2027.

A static site: plain HTML, CSS and JavaScript. No build step and no server needed.

## Folder structure

```
/
├── index.html            Home
├── the-night.html        Run of show, lineup, Phase 1 ticket prices
├── ground-plan.html      Interactive 3D venue plan
├── heritage-moves.html   Heritage Moves dance and culture showcase
├── gallery.html          Photo albums and lightbox
├── shop.html             Merchandise and bag
├── phase-2.html          2027 status, interest sign-up, FAQ
├── contact.html          Phone numbers, WhatsApp, map, social links
├── styles.css            All styling (shared)
├── site.js               Shared settings, menu, footer, shopping bag
├── plan.js               3D ground plan (used by ground-plan.html only)
└── img/
    ├── logo.jpg
    ├── crowd.jpg
    ├── fire.jpg
    ├── mask.jpg
    ├── stage.jpg
    └── plan.jpg
```

Keep every file in the same folder, with the images inside `img/`.

## Running locally

Open `index.html` in a browser. For best results use a small local server:

```
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Where to edit things

### `site.js` (applies to every page)

| What | Where |
| --- | --- |
| WhatsApp number | `CONFIG.whatsapp` (country code first, no `+` or spaces) |
| Ticket link | `CONFIG.ticketUrl` |
| Facebook, Instagram, TikTok links | `CONFIG.social` |
| Contact names and phone numbers | `CONFIG.contacts` |
| Main stage lineup and artist photos | `LINEUP` |
| Shop products, prices, photos | `PRODUCTS` |
| Menu items and page order | `PAGES` |

The menu and footer are built in `site.js`, so editing them there updates all pages.

### Page content

Text, times and prices live in each page's HTML file:

- Event facts and Phase 1 summary: `index.html`
- Run of show and ticket prices: `the-night.html`
- Phase 2 status and FAQ: `phase-2.html`
- Venue zone descriptions: `plan.js` (the `ZONES` list)

### Photos

- **Lineup:** set `photo: 'img/name.jpg'` for a band or artist in `LINEUP`.
- **Shop:** set `img: 'img/product.jpg'` on a product in `PRODUCTS`.
- **Gallery:** edit `ALBUMS` near the bottom of `gallery.html`. Replace a `null` slot with:
  ```js
  P('img/your-photo.jpg', 'Describe what is in the photo')
  ```

## Notes

- **Shopping bag:** orders are sent through WhatsApp. The bag is remembered between pages using the browser's local storage.
- **3D plan:** uses three.js (loaded from cdnjs) and needs WebGL. If WebGL is unavailable, the page shows `img/plan.jpg` instead.
- **Fonts:** Italiana, Cormorant Garamond and Jost are loaded from Google Fonts.
- **Phase 2:** date, venue, lineup and prices are marked "To be announced". Update `phase-2.html`, `the-night.html` and `plan.js` when they are confirmed.

## Credits

- Event by Star Gate Events (Pvt) Ltd
- Event photography by Dreamlense
