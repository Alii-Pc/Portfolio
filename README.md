# Ali Husnain — Portfolio

A 3D animated personal portfolio built with React, TypeScript, Tailwind CSS,
Framer Motion, and React Three Fiber (Three.js).

**Design concept:** a "network / systems" motif — a drifting node graph in
the hero, a monospace terminal voice for section labels (`$ ls ./projects`),
and a signal-line timeline spine for Experience and Education — built around
the IT/software-developer subject matter rather than a generic template.

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 (CSS-first `@theme` tokens — see `src/index.css`)
- Framer Motion (page-load and scroll animations)
- React Three Fiber / Three.js (hero background scene)
- React Icons

## Getting started

```bash
npm install
npm run dev       # start the dev server (usually http://localhost:5173)
npm run build     # production build -> dist/
npm run preview   # preview the production build locally
```

## Project structure

```
src/
  components/         UI sections (Hero, About, Skills, Projects, ...)
  components/three/   The 3D hero scene (lazy-loaded for performance)
  data/content.ts     All editable content - names, projects, skills, etc.
  hooks/useTheme.tsx  Dark/light mode context
  index.css           Design tokens (colors, fonts) + global styles
```

## Customize it

1. **Content** - almost everything (name, projects, skills, experience,
   education, certifications, contact info, social links) lives in
   `src/data/content.ts`. Edit that one file first.
2. **Resume** - drop your resume PDF into `public/` as `resume.pdf` (the
   Download/View Resume buttons already point to `/resume.pdf`).
3. **Photo** - the About section currently shows an "AH" placeholder card.
   Swap it for a real `<img>` in `src/components/About.tsx`.
4. **Contact form** - the form validates input and shows a success state,
   but isn't wired to a backend yet. Connect it to a service like
   Formspree (formspree.io) or EmailJS (emailjs.com), or your own API route,
   inside `handleSubmit` in `src/components/Contact.tsx`.
5. **Colors/fonts** - defined once in `src/index.css` under `@theme`. Change
   a value there and it updates everywhere.
6. **Certificates** - link real certificate files/URLs in the `certifications`
   array in `content.ts`.

## Deployment

This is a static Vite build, so it deploys anywhere that serves static files:

- **Vercel**: import the repo, framework preset "Vite", no extra config needed.
- **Netlify**: build command `npm run build`, publish directory `dist`.
- **GitHub Pages**: run `npm run build`, then deploy the `dist/` folder
  (you may need to set `base` in `vite.config.ts` to your repo name).

## Performance notes

The 3D hero scene is lazy-loaded into its own JS chunk (`HeroScene.tsx`) so
the rest of the page loads fast even though Three.js is fairly large. Reduced
motion is respected via `prefers-reduced-motion`.
