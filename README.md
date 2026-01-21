# 📘 One Minute Festival – Voting App

Een webapplicatie ontwikkeld met **Next.js + Supabase** als eindopdracht voor een **real-life klantproject** (One Minute Festival).  
De applicatie is opgezet als een **realistische, productiegerichte stemtool**, met focus op betrouwbaarheid, schaalbaarheid, security en gebruikerservaring.

---

## 🎯 Doel van de applicatie

Het doel van deze applicatie is om het publiek op een **eenvoudige en veilige manier** te laten stemmen op één film uit een shortlist (±50 films), waarbij:

- stemmen mogelijk is voor **zaalpubliek** én **online publiek**
- elke gebruiker **slechts één stem** kan uitbrengen
- stemmen enkel mogelijk is binnen een **tijdvenster** (timer)
- de organisatie resultaten snel en discreet kan raadplegen via een **admin dashboard**
- stemmen per doelgroep **gescheiden** én **gecombineerd** kunnen worden bekeken
- de tool eenvoudig kan worden **gereset** voor een nieuwe editie

De applicatie is **geen prototype**, maar ontworpen als een **volwaardige productie-app** met:

- echte database (Supabase)
- admin-authenticatie en protected routes
- beveiligde API endpoints
- import/export flows voor beheer
- animaties en UX-polish via **Framer Motion**

---

## ✨ Functionaliteiten

### Core functionaliteiten
- 🗳️ Stemmen via QR-code (mobielvriendelijk)
- ⏱️ Stemmen enkel binnen een open/closed voting window (timer)
- ✅ Bevestiging na stemmen (succes-pagina)
- 🔒 Eén stem per gebruiker (fraudepreventie)
- 🧾 Disclaimer rond eerlijk stemmen
- 🎬 Filmlijst met:
  - nummer
  - titel
  - maker(s)
  - optionele thumbnail
  - optionele tagline

---

## 🧑‍💻 Admin functionaliteiten
- 🔐 Admin login & protected pages
- 🎛️ Voting control: stemmen openen / sluiten / resetten
- 📊 Resultaten bekijken:
  - zaal
  - online
  - gecombineerd
- 📤 Export resultaten naar Excel (ExcelJS)
- 📥 Import filmlijst via CSV (PapaParse)
- ♻️ Editie resetten (voor nieuw festivaljaar)
- 📱 QR-pagina met downloadbare QR-codes

---

## 🚀 Extra’s — Exceleren (effectief geïmplementeerd)

De volgende extra’s zijn **daadwerkelijk toegevoegd** en zorgen ervoor dat dit project **boven het gemiddelde niveau uitstijgt**.

---

### 🎞️ Animaties (Framer Motion)

- Subtiele, performante animaties via **Framer Motion**
- Toegepast op:
  - page transitions (navigatie voelt vloeiend)
  - call-to-action knoppen (hover/tap feedback)
  - succes-schermen (visuele “reward” na stemmen)
  - micro-interactions (subtiele motion voor duidelijkheid)
- Declaratief animatiemodel
- Geen impact op business logic of dataflow

➡️ Animaties verbeteren de UX zonder performanceproblemen.

---

### 🧠 Fraudepreventie & betrouwbaarheid

- Eén stem per gebruiker (device-identificatie / fingerprint aanpak)
- Timer-based stemvenster voorkomt onbeperkt stemmen
- Rate limiting op API routes tegen misbruik
- Geen login vereist → snelle flow voor publiek, toch gecontroleerd

➡️ Ideale balans tussen **frictionless voting** en **betrouwbare resultaten**.

---

### 🎨 UX & polish

- Mobile-first voting flow (scan → kies → bevestig)
- Duidelijke feedback bij elke stap
- Consistente UI componenten (buttons/modals/toasts)
- Succes-pagina met polish en duidelijke afronding
- Neutrale, eenvoudige styling zoals gevraagd door de klant

➡️ De app voelt visueel en functioneel “af”.

---

### 🧱 Architectuur & codekwaliteit

- Strikte **Separation of Concerns**
- Geen god-components: UI, services en helpers gescheiden
- Service layer voor auth/films/votes/admin
- API routes per feature (auth, films, votes, edition)
- TypeScript types + Supabase type generation
- Herbruikbare helpers (parsing, export, voting utils)

➡️ Deze architecturale keuzes maken de applicatie schaalbaar en onderhoudbaar.

---

## 🛠️ Tech stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Framer Motion** (animaties)
- CSS Modules

### Backend
- **Supabase**
  - PostgreSQL database
  - Authentication (admin)
- **ExcelJS** (export resultaten)
- **PapaParse** (CSV import)
- **qrcode** (QR generatie)

---

## 🔐 Security & data-integriteit

- Admin routes afgeschermd (guard/middleware)
- Resultaten niet publiek zichtbaar
- Rate limiting aanwezig op gevoelige endpoints
- Stemmen gescheiden opgeslagen per doelgroep (zaal vs online)
- Eén stem per gebruiker enforced via backend-logica

---

## ▶️ Installatie & gebruik

### Vereisten
- Node.js (LTS)
- pnpm
- Supabase project met correcte environment variables

### Installatie
```bash
pnpm install


pnpm dev
Build (production)
pnpm build
pnpm start
Lint
pnpm lint
🗄️ Supabase types genereren
pnpm db-pull
Dit genereert types naar: src/types/supabase.ts

🌱 Seeding (optioneel)
pnpm seed
🔧 Environment variables
Maak een .env.local bestand aan:

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
👨‍💻 Auteur
Gemaakt door: Eros en Yabetse
Klant: One Minute Festival
Project: Publieksprijs voting app