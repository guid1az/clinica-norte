import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { fullAddress, site, type Photo } from '../config/site';
import { links } from '../lib/links';
import { gsap, prefersReducedMotion, scrollToId } from '../lib/motion';
import { Button, Figure, Lines, SectionLabel, Wordmark } from './ui';

const EASE: [number, number, number, number] = [0.23, 1, 0.32, 1];

/* ───────── Diferenciais — grid de colunas com fios (Ruthy) ───────── */

export function DifferentialsSection() {
  return (
    <section className="bg-paper py-28 md:py-44" aria-labelledby="dif-title">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        {/* Quebra de ritmo: título centralizado */}
        <div className="flex flex-col items-center text-center">
          <SectionLabel index="03">Como trabalhamos</SectionLabel>
          <Lines id="dif-title" className="h-section mt-10" lines={['O que muda', <>na sua <em>consulta.</em></>]} />
        </div>
        <ul className="mt-20 grid gap-y-12 md:mt-28 md:grid-cols-3">
          {site.differentials.map((d, i) => (
            <li key={d.title} data-reveal="fade" data-delay={String([0, 0.07, 0.12][i])}
              className="border-t border-ink/20 pt-6 md:border-l md:border-t-0 md:px-8 md:pt-0 md:first:border-l-0 md:first:pl-0">
              <span className="label tabular-nums text-ink-soft">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-10 font-serif text-[2.2rem] leading-[0.95] tracking-[-0.02em] md:mt-20">{d.title}</h3>
              <p className="mt-4 max-w-[34ch] text-[0.9375rem] leading-relaxed text-ink-soft">{d.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────── Consultório — composição assimétrica ───────── */

export function ClinicGallery() {
  const g = site.media.gallery;
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<(Photo & { n: string }) | null>(null);
  // Guarda qual foto abriu a ampliação para devolver o foco a ela ao fechar
  const openerIndex = useRef(-1);
  const open = (p: Photo, n: string) => { openerIndex.current = g.indexOf(p); setCurrent({ ...p, n }); dialog.current?.showModal(); };

  const Tile = ({ i, ratio, className = '', tone }: { i: number; ratio: string; className?: string; tone: 'stone' | 'sage' | 'greige' | 'night' }) => {
    const n = String(i + 2).padStart(2, '0');
    return (
      <button type="button" data-tile={i} onClick={() => open(g[i], n)} aria-label={`Ampliar: ${g[i].label}`} className={`group block w-full text-left ${className}`}>
        <div data-reveal="clip" className={`relative overflow-hidden ${ratio}`}>
          <div data-parallax="0.06" className="absolute inset-[-5%_0]"><Figure src={g[i].src} alt={g[i].alt} label={g[i].label} n={n} tone={tone} /></div>
        </div>
      </button>
    );
  };

  return (
    <section id="consultorio" className="bg-paper pb-28 md:pb-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        <div className="grid gap-10 pt-4 md:grid-cols-12">
          <div className="md:col-span-3"><SectionLabel index="04">O consultório</SectionLabel></div>
          <Lines className="h-section md:col-span-9" lines={['Um lugar para', <>ficar <em>à vontade.</em></>]} />
        </div>
      </div>

      {/* Quebra de ritmo: imagem de ponta a ponta */}
      <div className="mt-16 md:mt-24">
        <Tile i={1} tone="stone" ratio="aspect-[4/3] md:aspect-[21/9]" />
      </div>

      <div className="mx-auto mt-4 grid max-w-[1600px] grid-cols-2 gap-4 px-5 md:mt-6 md:grid-cols-12 md:gap-6 md:px-8">
        <Tile i={0} tone="greige" ratio="aspect-[4/5]" className="col-span-2 md:col-span-4" />
        <Tile i={2} tone="night" ratio="aspect-[4/5]" className="md:col-span-4 md:mt-24" />
        <Tile i={3} tone="sage" ratio="aspect-[4/5]" className="md:col-span-4" />
      </div>

      <dialog ref={dialog} onClose={() => { setCurrent(null); requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-tile="${openerIndex.current}"]`)?.focus({ preventScroll: true })); }} aria-label={current?.label}
        className="m-auto w-[min(92vw,1200px)] bg-transparent p-0"
        onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}>
        {current && (
          <div className="relative">
            <div className="aspect-[16/10] w-full"><Figure src={current.src} alt={current.alt} label={current.label} n={current.n} tone="stone" /></div>
            <button type="button" autoFocus onClick={() => dialog.current?.close()} className="btn btn-paper absolute right-4 top-4 !py-2.5">Fechar</button>
          </div>
        )}
      </dialog>
    </section>
  );
}

/* ───────── Urgências (somente se confirmado) ───────── */

export function EmergencySection() {
  if (!site.emergency.enabled) return null;
  return (
    <section className="on-dark bg-night py-24 text-paper" aria-labelledby="urg-title">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-3"><span className="label text-paper/75">{site.emergency.is24h ? 'Atendimento 24h' : 'Urgências'}</span></div>
        <div className="md:col-span-6">
          <h2 id="urg-title" className="h-section">Imprevistos acontecem. O cuidado <em>não pode esperar.</em></h2>
          <p className="mt-6 max-w-md text-paper/70">Precisa de atendimento odontológico de urgência? Entre em contato para receber orientações sobre a disponibilidade.</p>
          {site.emergency.hours && <p className="mt-2 text-sm text-paper/75">{site.emergency.hours}</p>}
        </div>
        <div className="self-end md:col-span-3"><Button href={links.emergency} variant="line">Solicitar atendimento de urgência</Button></div>
      </div>
    </section>
  );
}

/* ───────── FAQ (só aparece com perguntas preenchidas na configuração) ───────── */

export function FAQSection() {
  const faq = site.faq;
  const [open, setOpen] = useState<number | null>(0);
  if (!faq.length) return null;
  return (
    <section className="bg-paper py-28 md:py-40" aria-labelledby="faq-title">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 md:grid-cols-12 md:px-8">
        <div className="md:col-span-3"><SectionLabel index="06">Dúvidas</SectionLabel></div>
        <div className="md:col-span-9">
          <Lines id="faq-title" className="h-section" lines={['Dúvidas', <><em>frequentes.</em></>]} />
          <ul className="mt-16 border-t border-ink/20">
            {faq.map((f, i) => {
              const on = open === i;
              return (
                <li key={f.q} className="border-b border-ink/20">
                  <h3>
                    <button type="button" onClick={() => setOpen(on ? null : i)} aria-expanded={on} aria-controls={`faq-${i}`}
                      className="flex w-full items-baseline justify-between gap-6 py-6 text-left">
                      <span className="font-serif text-[clamp(1.5rem,2.2vw,2.1rem)] leading-tight tracking-[-0.015em]">{f.q}</span>
                      <span aria-hidden className="relative size-3 shrink-0">
                        <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
                        <span className={`absolute left-1/2 top-0 h-3 w-px bg-current transition-transform duration-200 ${on ? 'scale-y-0' : ''}`} />
                      </span>
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div id={`faq-${i}`} className="overflow-hidden"
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0, transition: { duration: 0.18, ease: EASE } }} transition={{ duration: 0.26, ease: EASE }}>
                        <p className="max-w-xl pb-7 leading-relaxed text-ink-soft">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ───────── Localização ───────── */

function QuietMap() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-stone" role="img" aria-label={`Mapa ilustrativo: ${fullAddress}`}>
      <svg viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
        <g stroke="#cbc7bc" fill="none">
          <path d="M-20 250 L420 150" strokeWidth="10" /><path d="M150 -20 L220 420" strokeWidth="8" />
          <path d="M-20 110 L420 50" strokeWidth="3" /><path d="M300 -20 L360 420" strokeWidth="3" />
          <path d="M-20 340 L420 260" strokeWidth="3" /><path d="M50 -20 L100 420" strokeWidth="3" />
        </g>
      </svg>
      <div className="absolute left-[46%] top-[50%] flex -translate-x-1/2 -translate-y-1/2 items-center gap-3">
        <span className="size-3 rounded-full bg-ink" />
        <span className="label bg-paper px-3 py-2">{site.name}</span>
      </div>
    </div>
  );
}

export function LocationSection() {
  return (
    <section id="contato" className="bg-paper py-28 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-12 px-5 md:grid-cols-12 md:gap-8 md:px-8">
        <div className="flex flex-col md:col-span-5">
          <SectionLabel index={site.faq.length ? '07' : '06'}>Localização</SectionLabel>
          <Lines className="h-section mt-10" lines={['Esperamos por', <>você no <em>{site.address.district}.</em></>]} />
          <address className="mt-14 grid gap-10 not-italic sm:grid-cols-2 md:mt-auto md:pt-16" data-reveal="fade">
            <div>
              <p className="label text-ink-soft">Endereço</p>
              <p className="mt-4 leading-relaxed">{site.address.street}<br />{site.address.complement} · {site.address.district}<br />{site.address.city}, {site.address.state}</p>
            </div>
            <div>
              <p className="label text-ink-soft">Horários</p>
              <ul className="mt-4 space-y-1">{site.hours.map((h) => <li key={h.days}>{h.days}, {h.time}</li>)}</ul>
              <p className="mt-4">WhatsApp e telefone<br /><a href={links.phone} className="link-u">{site.contact.phoneDisplay}</a></p>
            </div>
          </address>
          <div className="mt-10 flex flex-wrap gap-2" data-reveal="fade">
            <Button href={links.schedule}>Agendar consulta</Button>
            <Button href={links.maps} variant="line">Ver localização</Button>
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <div data-reveal="clip" className="relative aspect-square overflow-hidden md:aspect-[4/5]">
            {site.map.embed ? (
              <iframe title={`Mapa da ${site.name}`} src={links.mapsEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 h-full w-full grayscale" />
            ) : <QuietMap />}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────── Footer ───────── */

export function Footer() {
  const go = (id: string) => (e: React.MouseEvent) => { e.preventDefault(); scrollToId(id); };
  const ref = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        // Assinatura sobe de dentro da borda inferior conforme o rodapé entra
        gsap.fromTo('.sig-inner', { yPercent: 45 }, { yPercent: 0, ease: 'none',
          scrollTrigger: { trigger: '.sig', start: 'top bottom', end: 'bottom bottom', scrub: 0.6 } });
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <footer ref={ref} className="on-dark bg-night text-paper/75">
      <div className="mx-auto max-w-[1600px] px-5 pt-20 md:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-3">
            <Wordmark className="text-paper" />
            <p className="mt-4 text-[0.8125rem]">{site.tagline}</p>
          </div>
          <nav aria-label="Rodapé" className="md:col-span-2 md:col-start-6">
            <p className="label text-paper/75">Navegação</p>
            <ul className="mt-5 space-y-1.5 text-[0.875rem]">
              {site.nav.map((n) => <li key={n.id}><a href={`#${n.id}`} onClick={go(n.id)} className="link-u inline-block py-1">{n.label}</a></li>)}
            </ul>
          </nav>
          <div className="md:col-span-3">
            <p className="label text-paper/75">Visite</p>
            <address className="mt-5 space-y-1 text-[0.875rem] not-italic">
              <p>{site.address.street}, {site.address.complement}</p>
              <p>{site.address.district} · {site.address.city}, {site.address.state}</p>
              {site.hours.map((h) => <p key={h.days} className="text-paper/75">{h.days}, {h.time}</p>)}
            </address>
          </div>
          <div className="md:col-span-2">
            <p className="label text-paper/75">Contato</p>
            <ul className="mt-5 space-y-1.5 text-[0.875rem]">
              <li><a href={links.schedule} target="_blank" rel="noopener noreferrer" className="link-u">WhatsApp</a></li>
              <li><a href={links.phone} className="link-u">{site.contact.phoneDisplay}</a></li>
              <li><a href={links.instagram} target="_blank" rel="noopener noreferrer" className="link-u">Instagram</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Assinatura: "Norte" em itálico, de ponta a ponta, cortado pela borda inferior,
          com a coordenada do Batel como legenda (o "norte" da marca vira um lugar real). */}
      <div aria-hidden className="sig relative mt-20 select-none overflow-hidden">
        <div className="mx-auto flex max-w-[1600px] items-end justify-between px-5 pb-4 md:px-8">
          <span className="label text-paper/50">25°26′ S · 49°17′ O</span>
          <span className="label text-paper/50">{site.address.district}, {site.address.city}</span>
        </div>
        <div className="border-t border-paper/10" />
        <div className="sig-inner">
          <p className="display -mb-[0.2em] whitespace-nowrap text-center text-[35vw] italic leading-[0.9] tracking-[-0.05em]
            bg-[linear-gradient(180deg,rgba(243,241,235,0.9)_0%,rgba(243,241,235,0.35)_45%,rgba(243,241,235,0)_85%)] bg-clip-text text-transparent">
            Norte
          </p>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-8">
        <div className="flex flex-col justify-between gap-2 border-t border-paper/10 py-6 text-[0.75rem] text-paper/75 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. Projeto conceitual · Imagens ilustrativas.</p>
          <p>{site.technicalLead.role}: {site.technicalLead.name}, {site.technicalLead.cro}. Indicação de tratamento sujeita a avaliação clínica.</p>
        </div>
      </div>
    </footer>
  );
}

/* ───────── WhatsApp flutuante ───────── */

export function WhatsAppButton() {
  const [show, setShow] = useState(false);
  const [atEnd, setAtEnd] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    // Some no fechamento e no rodapé, onde já há chamadas de contato
    const targets = [document.querySelector('[data-final-cta]'), document.querySelector('footer')].filter(Boolean) as Element[];
    const seen = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => (e.isIntersecting ? seen.add(e.target) : seen.delete(e.target)));
      setAtEnd(seen.size > 0);
    }, { threshold: 0.05 });
    targets.forEach((t) => io.observe(t));
    return () => { window.removeEventListener('scroll', onScroll); io.disconnect(); };
  }, []);
  return (
    <AnimatePresence>
      {show && !atEnd && (
        <motion.a href={links.schedule} target="_blank" rel="noopener noreferrer" aria-label="Agendar consulta pelo WhatsApp"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
          transition={{ duration: 0.25, ease: EASE }}
          className="btn btn-ink fixed bottom-5 right-5 z-40 shadow-[0_8px_30px_-12px_rgba(29,34,31,0.5)]">
          WhatsApp · Agendar
        </motion.a>
      )}
    </AnimatePresence>
  );
}
