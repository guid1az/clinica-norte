import { site } from '../config/site';

const mapsQuery = `${site.name}, ${site.address.street}, ${site.address.district}, ${site.address.city} - ${site.address.state}`;

export const waLink = (message: string) =>
  `https://wa.me/${site.contact.whatsapp}?text=${encodeURIComponent(message)}`;

export const links = {
  schedule: waLink(site.messages.schedule),
  emergency: waLink(site.messages.emergency),
  treatment: (name: string) =>
    waLink(`Olá! Encontrei seu site e gostaria de agendar uma consulta sobre ${name.toLowerCase()}.`),
  phone: `tel:${site.contact.phone}`,
  instagram: site.social.instagram.url,
  maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
  mapsEmbed: `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`,
};
