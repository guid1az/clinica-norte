import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { site } from '../config/site';
import { links } from '../lib/links';
import { scrollToId } from '../lib/motion';
import { Wordmark } from './ui';

/**
 * Navegação: sobre a hero dividida, o lado esquerdo fica em grafite e o direito (sobre a mídia) em off-white,
 * como na Aventura. Ao rolar, assume um fundo papel translúcido único.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); setOpen(false); scrollToId(id); };
  const solid = scrolled || open;

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        solid ? 'border-b border-ink/10 bg-paper/85 backdrop-blur-md' : 'border-b border-transparent'}`}>
        <nav aria-label="Principal" className="mx-auto grid h-[72px] max-w-[1600px] grid-cols-2 items-center px-5 md:px-8">
          <div className="flex items-center gap-12 text-ink">
            <a href="#inicio" onClick={go('inicio')} aria-label={`${site.name}, início`}><Wordmark /></a>
            <ul className="hidden items-center gap-7 lg:flex">
              {site.nav.slice(1).map((n) => (
                <li key={n.id}><a href={`#${n.id}`} onClick={go(n.id)} className="link-u inline-block py-2 text-[0.8125rem]">{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div className={`flex items-center justify-end gap-6 transition-colors duration-300 ${solid ? 'text-ink' : 'text-ink md:text-paper'}`}>
            <a href={links.phone} className="link-u hidden text-[0.8125rem] xl:inline">{site.contact.phoneDisplay}</a>
            <a href={links.schedule} target="_blank" rel="noopener noreferrer" className="btn btn-line hidden !py-2.5 sm:inline-flex">Agendar consulta</a>
            <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="menu-mobile"
              aria-label={open ? 'Fechar menu' : 'Abrir menu'} className="relative grid size-10 place-items-center lg:hidden">
              <span className={`absolute h-px w-5 bg-current transition-transform duration-200 ${open ? 'rotate-45' : '-translate-y-[3px]'}`} />
              <span className={`absolute h-px w-5 bg-current transition-transform duration-200 ${open ? '-rotate-45' : 'translate-y-[3px]'}`} />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div id="menu-mobile" role="dialog" aria-modal="true" aria-label="Menu"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-paper px-5 pb-8 pt-28 lg:hidden">
            <ul className="border-t border-ink/15">
              {site.nav.map((n, i) => (
                <li key={n.id} className="border-b border-ink/15">
                  <a href={`#${n.id}`} onClick={go(n.id)} className="flex items-baseline justify-between py-4">
                    <span className="font-serif text-[2.6rem] leading-none tracking-[-0.03em]">{n.label}</span>
                    <span className="label text-ink-soft">0{i + 1}</span>
                  </a>
                </li>
              ))}
            </ul>
            <div className="space-y-4">
              <a href={links.schedule} target="_blank" rel="noopener noreferrer" className="btn btn-ink w-full justify-center">Agendar minha consulta</a>
              <p className="text-center text-xs text-ink-soft">{site.address.district} · {site.address.city}, {site.address.state}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
