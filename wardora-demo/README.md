# Wardora

Wardora este un MVP React/Vite pentru o aplicație AI fashion stylist: cont utilizator, upload poză, garderobă digitală, analiză OpenAI Vision, generator de outfituri și plan Premium `Wardora Unlimited Couture`.

## Rulare locală

```bash
npm install
npm run dev:all
```

Frontend: `http://127.0.0.1:5173`  
Server AI: `http://127.0.0.1:8787`

Pentru a porni separat:

```bash
npm run server
npm run dev
```

## Configurare environment

Copiază `.env.example` în `.env`:

```bash
cp .env.example .env
```

Completează valorile:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
PORT=8787
CLIENT_ORIGIN=http://127.0.0.1:5173
```

Nu pune cheia OpenAI în frontend. Ea este citită doar de serverul Express din `server/index.js`.

## Firebase

1. Creează un proiect în Firebase Console.
2. Activează Authentication cu provider `Email/Password`.
3. Creează Firestore Database.
4. Activează Firebase Storage.
5. Copiază configul web app în `.env`.
6. Pentru development, setează reguli permisive doar temporar, apoi restrânge accesul pe `request.auth.uid`.

Date folosite:

- `users/{uid}` pentru profil și status Premium.
- `users/{uid}/wardrobe` pentru haine uploadate.
- `users/{uid}/ai/latestAnalysis` pentru ultima analiză AI.
- `users/{uid}/outfits` pentru istoricul outfiturilor.
- `Storage users/{uid}/profile` și `users/{uid}/wardrobe` pentru imagini.

## OpenAI Vision

Serverul Express expune:

- `POST /api/analyze`
- `POST /api/generate-outfit`
- `GET /api/health`

Frontendul apelează aceste endpointuri prin proxy Vite (`vite.config.js`). Serverul trimite către OpenAI poza utilizatorului și imaginile garderobei ca input multimodal și cere JSON structurat.

Conform documentației oficiale OpenAI, Responses API suportă input text + imagini, iar Structured Outputs ajută la răspunsuri JSON consistente.

## Limitări MVP

- Plata este simulată, dar structura este pregătită pentru Stripe.
- Avatarul este un preview inteligent peste poza utilizatorului, pregătit pentru integrare ulterioară cu un serviciu avatar real.
- Dacă Firebase sau OpenAI nu sunt configurate, aplicația folosește fallback local ca să rămână demonstrabilă.
