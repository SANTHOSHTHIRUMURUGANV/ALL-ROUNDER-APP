# Checklist: Multilingual i18next & Precise GPS Geocoding

- [ ] Setup dependencies & initialization
  - [ ] Install `i18next` and `react-i18next` npm packages
  - [ ] Create 12 JSON translation files in `src/locales/`
  - [ ] Initialize `src/i18n.ts` and import it inside `src/main.tsx`
- [ ] Implement Geolocation & Reverse Geocoding (AppContext.tsx)
  - [ ] Request HTML5 Geolocation permission and track lat/lng
  - [ ] Fetch Nominatim OSM reverse geocoding to resolve street address, city, district, state, PIN, country
  - [ ] Save location details to Local Storage and support manual changes
  - [ ] Implement Haversine distance calculations (in KM and meters) and update partner directory details
- [ ] Translate all components using i18next `t(...)`
  - [ ] Update Navbar
  - [ ] Update AIChatbot
  - [ ] Update CustomerView
  - [ ] Update PartnerView
  - [ ] Update AdminView
- [ ] Verify build and reload local server
