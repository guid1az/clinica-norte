# Clínica Norte — Landing page

React + TypeScript + Vite + Tailwind v4 + GSAP/ScrollTrigger + Lenis + Motion + Three.js (R3F/Drei).

- `npm install` · `npm run dev` · `npm run build` (gera `dist/index.html`)
- **Todos os dados** (contatos, endereço, horários, tratamentos, mídias, urgência) ficam em `src/config/site.ts`.
- Cores e fontes: `src/index.css` (`@theme`).
- Fotos/vídeo: preencha `media.*` com os caminhos dos arquivos (ex.: `public/media/hero.mp4`); os placeholders somem sozinhos.
- Mapa real do Google: `map.embed: true` em hospedagem própria.
- Urgências: `emergency.enabled: true` exibe a seção, o CTA e a pergunta no FAQ.
- Antes de publicar: troque o domínio em `site.url`, `public/robots.txt` e `public/sitemap.xml`.
