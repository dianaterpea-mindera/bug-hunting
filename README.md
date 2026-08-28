# Bug Hunting

Proiect tehnic (repo / local): **bug-hunting**. Numele afișat utilizatorilor: **Insula după furtună**.

Joc educațional web pentru Tech Kids Camp (clasele VII–VIII). Copiii joacă o misiune de salvare pe o insulă și descoperă **12 bug-uri** intenționate — fără să știe că fac software testing.

## Pornire

```bash
npm install
cp .env.example .env.local
# completează VITE_SUPABASE_URL și VITE_SUPABASE_ANON_KEY
npm run dev
```

Deschide adresa afișată în terminal (de obicei `http://localhost:5173`).

## Supabase (evidențe pe orice calculator)

1. Creează un proiect pe [supabase.com](https://supabase.com).
2. **SQL Editor** → lipește și rulează conținutul din `supabase/schema.sql`.
3. **Project Settings → API** → copiază:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`
4. Pune valorile în `.env.local` (vezi `.env.example`) și repornește `npm run dev`.

Fără aceste variabile, aplicația rulează în **mod local** (`localStorage`). Cu ele, sesiunile și screenshot-urile se salvează în cloud; instructorul le vede de pe alt PC după **Reîncarcă** / login.

## Instructor

- Link pe ecranul de bun venit: **Intră în panoul de instructor**
- PIN default: `2468` (poți schimba în `src/constants.ts` → `INSTRUCTOR_PIN`)

Funcții:

- listă participanți / scor / durată
- jurnal per copil (screenshot + descriere)
- mod **Review** pe scenă
- ecran **Revelație QA**

## Stack

- React + TypeScript + Vite
- Supabase (Postgres + Storage)
- html2canvas (dovezi screenshot)

## Scripturi

| Comandă | Rol |
|--------|-----|
| `npm run dev` | dezvoltare |
| `npm run build` | build producție |
| `npm run preview` | previzualizare build |
