# Open Global Sports

Webbplatsen för Open Global Sports med landningssida, automatiskt sändningsschema och en separat livesida.

## Innehåll

- `app/` innehåller webbplatsens sidor och design.
- `content/schedule.json` styr kommande sändningar, live-läge och nedräkningar.
- `public/` innehåller logotyp, favicon och typsnitt.
- `deploy/` innehåller serverkonfigurationen.
- `MANUAL-SV.md` beskriver hur schemat ändras och webbplatsen publiceras.

## Lokal utveckling

Krav: Node.js 22 eller senare.

```bash
npm install
npm run dev
```

Kontrollera en färdig version med:

```bash
npm run build
npm test
```

## Publicering

Webbplatsen körs i Docker på OGS-servern. Fullständiga instruktioner finns i [MANUAL-SV.md](MANUAL-SV.md).

## Teknik

Webbplatsen är byggd med React, TypeScript, Next.js-kompatibla komponenter och vinext. Livesändningen levereras via BoxCast.
