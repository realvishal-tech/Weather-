# VishvaX Weather — Complete Cloudflare Website

Premium responsive liquid-glass weather website with live Weatherstack current conditions, location search, browser geolocation, Celsius/Fahrenheit, theme toggle, atmospheric details, and a forecast section ready for a forecast API.

## Deploy on Cloudflare
1. Upload this folder to a GitHub repository. Do not upload `.dev.vars` or any real API key.
2. In Cloudflare Dashboard, open Workers & Pages and create a Worker connected to your repository.
3. Build/install command: `npm install`
4. Deploy command: `npx wrangler deploy`
5. In Worker settings → Variables and Secrets, add secret `WEATHERSTACK_API_KEY` with your Weatherstack key.
6. Deploy. The same Worker serves the website and `/api/weather`.

## Local development
- Install Node.js, then run `npm install`.
- Copy `.dev.vars.example` to `.dev.vars` and put your key in it.
- Run `npm run dev`.
- Publish with `npx wrangler login` and `npm run deploy`.

## Features
- `public/index.html`: website structure
- `public/styles.css`: responsive premium liquid glass design and light theme
- `public/app.js`: current weather API integration, city search, unit conversion, geolocation, refresh
- `src/index.js`: server-side Weatherstack proxy; API key stays in Worker secret
- `wrangler.toml`: Cloudflare Worker + static asset binding

## Forecast limitation
The Weatherstack `/current` endpoint returns current conditions, not hourly or 7-day forecasts. The website clearly labels the forecast area and explains this limitation rather than displaying fabricated forecasts. A Weatherstack plan that supports forecast endpoints or a separate forecast API must be connected to populate forecast cards.
