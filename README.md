# 🥂 Mukesh & Reena — Silver Jubilee Invitation

A hyper-luxurious, interactive Silver Jubilee anniversary invitation built with React + Vite, featuring:

- **Palace Gates** — drag the golden lock downward to swing open ornate Rajasthani doors in 3D
- **Starfield Hero** — animated rotating mandalas with mouse parallax, shimmering "25" and couple names
- **Film Strip Gallery** — infinite auto-scrolling cinematic memory strip
- **Live Countdown** — real-time clock counting to 30 June 2026
- **Horizontal Journey** — GSAP-powered horizontal scroll timeline through the years
- **Royal Decree** — silk parchment event details with animated reveal
- **Wax Seal RSVP** — golden wax seal submit with sparkle confetti burst
- **Framer Motion** throughout for buttery smooth transitions

---

## 🚀 Deploy to Vercel (3 steps)

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
npm install
vercel --prod
```

### Option B — GitHub → Vercel (shareable link)
1. Push this folder to a new GitHub repo
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Framework: **Vite** (auto-detected)
5. Click **Deploy** — done! ✅

---

## 💻 Run locally
```bash
npm install
npm run dev
```
Open http://localhost:5173

## 📦 Build for production
```bash
npm run build
```
Output goes to `dist/` — deploy anywhere.

---

## 🎨 Customisation

All event details, names, date, and venue are in `src/App.jsx`:

| What | Where in App.jsx |
|------|-----------------|
| Couple names | Hero section — search "Mukesh" |
| Event date | `events` array + `CdBox` countdown target |
| Venue | `events` array |
| Journey years | `journey` array |
| Film strip labels | `FILM_FRAMES` array |
| Colours | Top of file — `G`, `G2`, `SIL`, `MAR` etc. |

To add real photos to the Journey cards, replace the placeholder `<div>` inside each card with an `<img>` tag.
