# Meowa 🐱

A gamified cat health tracker. Track vaccinations, medical visits, reminders, and earn XP badges for your cats.

## Dev

```bash
npm run dev          # start frontend (port 5173) + backend (port 3001)
```

## Tests

```bash
cd backend && npx vitest run     # 20 backend route tests
cd frontend && npx vitest run    # 27 frontend unit + component tests
```

## Build

```bash
npm run build -w frontend                  # production build
npm run check-bundle-size -w frontend      # verify main chunk < 250KB gzipped
```

## Health check

```bash
curl http://localhost:3001/api/health
# {"status":"ok","db":"ok","requestId":"..."}
```

## Brand palette

| Token | Hex | Use |
|-------|-----|-----|
| Yellow | `#FFD93D` | Primary CTA, XP bar |
| Green | `#6DD3A8` | Brand primary, success states |
| Violet | `#9B7EDC` | Secondary accent, hover states |
| Cream | `#FFFBF0` | Page background (light mode) |
| Ink | `#2A2438` | Page background (dark mode), text |

Dark mode: click the ☀️/🌙 toggle in the header.

## Performance budget

Main JS chunk must stay under **250KB gzipped**. Run `npm run check-bundle-size -w frontend` to verify.
