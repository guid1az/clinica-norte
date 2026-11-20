declare const process: { env: Record<string, string | undefined> };
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { site, fullAddress } from './src/config/site';

/** SEO local gerado a partir da configuração central. */
function seo(): Plugin {
  const title = `${site.name} | Clínica Odontológica no ${site.address.district}, ${site.address.city}, ${site.address.state}`;
  const description = `Conheça o atendimento odontológico da ${site.name} em ${site.address.city}. Agende sua consulta pelo WhatsApp.`;
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'Dentist', name: site.name, url: site.url, telephone: site.contact.phone,
    address: { '@type': 'PostalAddress', streetAddress: `${site.address.street}, ${site.address.complement}`, addressLocality: site.address.city,
      addressRegion: site.address.state, addressCountry: site.address.country, ...(site.address.postalCode ? { postalCode: site.address.postalCode } : {}) },
    openingHours: site.hours.map((h) => h.schema), sameAs: [site.social.instagram.url], foundingDate: String(site.founded),
  };
  return {
    name: 'seo',
    transformIndexHtml: (html) => html
      .replace('%TITLE%', title).replaceAll('%DESC%', description).replaceAll('%URL%', site.url)
      .replace('%KEYWORDS%', [`dentista em ${site.address.city}`, `dentista no ${site.address.district}`, `consultório odontológico ${site.address.city}`, `dentista em ${site.address.city} ${site.address.state}`].join(', '))
      .replace('%ADDR%', fullAddress)
      .replace('%JSONLD%', JSON.stringify(jsonLd)),
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss(), seo(), ...(process.env.SINGLE ? [viteSingleFile()] : [])],
  build: { chunkSizeWarningLimit: 3000 },
});
