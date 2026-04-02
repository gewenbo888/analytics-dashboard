# Analytics Dashboard — 流量监控

A self-hosted, lightweight analytics system for monitoring traffic across all your Vercel projects. Like Google Analytics, but you own the data.

## Architecture

```
tracker.js  →  /api/collect  →  Vercel KV (Redis)  →  /api/stats  →  Dashboard
(embed in     (serverless       (persistent           (serverless     (real-time
 any site)     edge function)    storage)               API)           charts)
```

## Features

- **Overview dashboard** — total pageviews, daily trends, sparkline charts for all projects
- **Per-project detail** — 30-day daily chart, 48-hour hourly chart, top pages, traffic sources, countries, devices, languages
- **Lightweight tracker** — ~500 bytes, no cookies, uses `sendBeacon`, tracks SPAs
- **Edge-powered** — collect endpoint runs on Vercel Edge for minimal latency
- **Privacy-friendly** — no cookies, no fingerprinting, no personal data stored

## Setup

### 1. Deploy

```bash
vercel --prod
```

### 2. Create KV Store

```bash
vercel kv create analytics-store
```

Then link it in the Vercel dashboard (Project Settings → Storage → Connect).

### 3. Add Tracker to Your Sites

Add this one line to the `<head>` of every site you want to track:

```html
<script defer src="https://YOUR-ANALYTICS-DOMAIN.vercel.app/tracker.js"></script>
```

### 4. (Optional) Protect Dashboard

Set an `ANALYTICS_KEY` environment variable in Vercel, then access the dashboard with `?key=YOUR_KEY`.

## Tech

- **Frontend**: Vanilla HTML/CSS/JS dashboard with canvas charts
- **Backend**: Vercel Edge Functions (Node.js)
- **Storage**: Vercel KV (Upstash Redis)
- **Tracker**: ~500 byte vanilla JS, `sendBeacon` API

## Data Collected

| Field | Purpose |
|-------|---------|
| hostname | Identify which project |
| path | Page popularity |
| referrer | Traffic sources |
| screen width | Device type (mobile/tablet/desktop) |
| language | User language |
| country | From Vercel edge header (x-vercel-ip-country) |
