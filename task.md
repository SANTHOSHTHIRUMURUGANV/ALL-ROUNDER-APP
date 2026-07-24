# Checklist: Multilingual i18next & Precise GPS Geocoding

- [x] Setup dependencies & initialization
  - [x] Install `i18next` and `react-i18next` npm packages
  - [x] Create 12 JSON translation files in `src/locales/`
  - [x] Initialize `src/i18n.ts` and import it inside `src/main.tsx`
- [x] Implement Geolocation & Reverse Geocoding (AppContext.tsx)
  - [x] Request HTML5 Geolocation permission and track lat/lng
  - [x] Fetch Nominatim OSM reverse geocoding to resolve street address, city, district, state, PIN, country
  - [x] Save location details to Local Storage and support manual changes
  - [x] Implement Haversine distance calculations (in KM and meters) and update partner directory details
- [x] Translate all components using i18next `t(...)`
  - [x] Update Navbar
  - [x] Update AIChatbot
  - [x] Update CustomerView
  - [x] Update PartnerView
  - [x] Update AdminView
- [x] Verify build and reload local server
