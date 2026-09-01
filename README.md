# Pantry

A phone-first, local-first kitchen inventory mockup. Scan barcodes, keep a list, and see what to use soon — all in the browser. There are no accounts. Inventory is stored in IndexedDB on this device and is never uploaded.

This is a mockup, not a full product. Receipts, store imports, recipes, and a backend are out of scope.

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually `http://localhost:5173`).

Other scripts:

- `npm run build` — production build
- `npm run preview` — serve the production build
- `npm run dev:https` — same as `dev`, with a self-signed certificate (useful for camera access on a phone)

## What to try

The app seeds a few demo items (milk, yogurt, spinach, leftovers, eggs, bread, olive oil, frozen berries, chicken) so Inventory and Use soon look alive before the first scan.

1. **Inventory** — search, then filter with All / Fridge / Freezer / Pantry / Expiring. Use + / − on a card. Quantity 0 removes the item.
2. **Use soon** — same items, grouped by expiry. Dates are derived at render time from stored values, not a server job.
3. **Scan** — on a phone, allow the camera and point at a grocery barcode. Chrome/Android uses `BarcodeDetector` when it exists; Safari/iOS falls back to `@zxing/browser`. After a successful read, a confirm sheet asks for name, quantity, location, and optional expiry.
4. **Same barcode twice** — scanning a code that is already in inventory bumps quantity instead of adding a duplicate.
5. **Desktop / no camera** — on the Scan tab, tap **Enter barcode** and try `3017620422003` (Nutella on Open Food Facts). If the lookup misses, you can still type a name. **No barcode** is for produce and leftovers.
6. **Refresh** — reload the page. The list should still be there (IndexedDB).

Product lookups go to [Open Food Facts](https://world.openfoodfacts.org/) with User-Agent `Pantry/0.1 (https://github.com/jakemay04/pantry)`. Browsers may ignore a custom User-Agent header; the request still works. Cached product metadata stays on device. Your inventory list is not sent with that request.

## Try it on a phone (Add to Home Screen)

The camera only works in a [secure context](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts): `https://` or `http://localhost`. A raw LAN IP like `http://192.168.x.x:5173` is **not** a secure context, so `getUserMedia` will fail.

Options:

1. **HTTPS on your network** — `npm run dev:https`, then open the `https://` URL Vite prints. Accept the self-signed certificate warning on the phone, then allow the camera.
2. **Tunnel** — put localhost on HTTPS with something like Cloudflare Tunnel or ngrok, then open that URL on the phone.
3. **Hosted HTTPS** — deploy `npm run build` output to any static HTTPS host.

Add to Home Screen:

- **iPhone (Safari)** — Share → Add to Home Screen. Camera scanning needs Safari or the home-screen app opened from that install; Chrome on iOS is more limited.
- **Android (Chrome)** — menu → Add to Home screen / Install app.

Inventory still works without camera or install; only barcode scanning needs the secure context and a permission grant.

## Stack

Vite + React + TypeScript, Dexie (IndexedDB), vite-plugin-pwa, Open Food Facts for barcode lookup. No Next.js, no FastAPI, no Postgres in this mockup.
