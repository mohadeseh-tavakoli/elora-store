# ÉLORA — Luxury Modest Scarf Store

A Persian RTL storefront prototype built with plain HTML, CSS, and JavaScript.

## Run locally
Open `index.html` in a browser. For best results, use a local static server (for example VS Code Live Server).

## Publish on GitHub Pages
1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root.
3. In repository Settings → Pages, choose **Deploy from a branch**, branch `main`, folder `/ (root)`.
4. Save and wait for the published URL.

## WordPress / WooCommerce handoff
This is a front-end prototype. Cart, wishlist, search, filters, quiz and sample product data currently run in the browser and are not connected to payment, inventory, customer accounts or a database.

For the production WordPress build:
- Convert the shared header/footer and page sections into a custom theme.
- Register the palette and typography as theme design tokens.
- Replace `assets/js/products.js` with WooCommerce product data (attributes: use, size, fabric, color, pattern, season).
- Map add-to-cart to WooCommerce AJAX / native product forms.
- Use WooCommerce taxonomies/attributes for filters.
- Connect checkout to the merchant's selected Iranian payment gateway and shipping provider.
- Save wishlist and quiz preferences with an appropriate plugin or custom integration.
- Replace all demo product photos, prices, contact details, and policies with client-approved real content.

## Design tokens
- Ivory `#F7F4EF`
- Sand `#EFEAE2`
- Charcoal `#1C1B19`
- Body `#6B655C`
- Bronze `#B08D57`
- Espresso `#2A2622`
- Bordeaux `#7A2E2E`

## Important
The product photos and product details are demo content. Confirm image licensing and replace with the client's actual scarf photography before commercial launch.
