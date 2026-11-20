import { useLayoutEffect, useRef, useState } from 'react';
import { site } from '../config/site';
import { links } from '../lib/links';
import { gsap, prefersReducedMotion } from '../lib/motion';
import { Button, Figure, Lines, SectionLabel } from './ui';

/* ═════════ "Como funciona": três versões ═════════ */

const pad = (i: number) => String(i + 1).padStart(2, '0');

/** Linha de progresso horizontal fixada (desktop) / vertical (mobile). Nenhuma etapa fica apagada. */
function useJourneyProgress(ref: React.RefObject<HTMLElement | null>) {
  const [step, setStep] = useState(0);
  const n = site.journey.length;
  useLayoutEffect(() => {
    if (prefersReducedMotion()) { setStep(n - 1); return; }
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: '+=1200', pin: true, scrub: 0.5,
          onUpdate: (s) => setStep(Math.min(n - 1, Math.floor(s.progress * n * 0.999))) } })
          .fromTo('.j-line', { scaleX: 0 }, { scaleX: 1, ease: 'none' }, 0);
      });
      mm.add('(max-width: 1023px)', () => {
        gsap.timeline({ scrollTrigger: { trigger: '.j-list', start: 'top 70%', end: 'bottom 55%', scrub: 0.5,
          onUpdate: (s) => setStep(Math.min(n - 1, Math.floor(s.progress * n * 0.999))) } })
          .fromTo('.j-line', { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0);
      });
    }, ref);
    return () => ctx.revert();
  }, [ref, n]);
  return step;
}

function NumberedJourney({ dark }: { dark: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const step = useJourneyProgress(ref);
  const t = dark
    ? { bg: 'on-dark bg-[#262523] text-paper', rail: 'bg-paper/15', line: 'bg-paper', text: 'text-paper/75', numOn: 'text-paper', numOff: 'text-paper/35' }
    : { bg: 'bg-stone text-ink', rail: 'bg-ink/15', line: 'bg-ink', text: 'text-ink-soft', numOn: 'text-ink', numOff: 'text-ink/30' };
  return (
    <section ref={ref} className={`relative flex min-h-[100svh] items-center py-28 ${t.bg}`} aria-labelledby={`journey-${dark ? 'g' : 'l'}`}>
      <div className="mx-auto w-full max-w-[1600px] px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3"><SectionLabel index="05" dark={dark}>Como funciona</SectionLabel></div>
          <Lines id={`journey-${dark ? 'g' : 'l'}`} className="h-section md:col-span-9" lines={['Do primeiro contato', <>ao <em>acompanhamento.</em></>]} />
        </div>
        <div className="j-list relative mt-16 lg:mt-24">
          <ol className="grid gap-14 pl-8 lg:grid-cols-4 lg:gap-0 lg:pl-0">
            {site.journey.map((j, i) => (
              <li key={j.title} aria-current={i === step ? 'step' : undefined} className="lg:pr-10">
                {/* Número grande: o elemento visual da seção. A cor acompanha o progresso; o texto nunca apaga. */}
                <span className={`block font-serif text-[clamp(4rem,7.2vw,7.6rem)] italic leading-[0.8] tracking-[-0.04em] transition-colors duration-300 ${i <= step ? t.numOn : t.numOff}`}>
                  {pad(i)}
                </span>
                <h3 className="mt-10 font-serif text-[2.1rem] leading-none tracking-[-0.02em] lg:mt-16">{j.title}</h3>
                <p className={`mt-4 max-w-[30ch] text-[0.9375rem] leading-relaxed ${t.text}`}>{j.text}</p>
              </li>
            ))}
          </ol>
          <div aria-hidden className={`absolute left-0 top-0 h-full w-px lg:top-[calc(clamp(4rem,7.2vw,7.6rem)*0.8+1.75rem)] lg:h-px lg:w-full ${t.rail}`}>
            <div className={`j-line h-full w-full origin-top lg:origin-left ${t.line}`} />
          </div>
        </div>
      </div>
    </section>
  );
}

export const JourneyLight = () => <NumberedJourney dark={false} />;
export const JourneyGraphite = () => <NumberedJourney dark />;

/** Versão com fotografia fixa que troca conforme a etapa em leitura. */
const STEP_PHOTOS = [
  { src: './media/about.webp', label: 'Contato' },
  { src: './media/equipamentos.webp', label: 'Avaliação' },
  { src: './media/tratamentos/implantes.webp', label: 'Plano' },
  { src: './media/tratamentos/lentes-facetas.webp', label: 'Acompanhamento' },
];

export function JourneyPhoto() {
  const ref = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.jp-step').forEach((el, i) => {
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 55%', end: 'bottom 55%', onToggle: (s) => s.isActive && setStep(i) } });
      });
    }, ref);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={ref} className="bg-paper py-28 md:py-40" aria-labelledby="journey-p">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3"><SectionLabel index="05">Como funciona</SectionLabel></div>
          <Lines id="journey-p" className="h-section md:col-span-9" lines={['Do primeiro contato', <>ao <em>acompanhamento.</em></>]} />
        </div>
        <div className="mt-16 grid gap-10 md:mt-24 lg:grid-cols-12 lg:gap-12">
          <div className="relative hidden lg:sticky lg:top-[14vh] lg:col-span-5 lg:block lg:h-[70vh]" aria-hidden>
            <div className="relative h-full overflow-hidden">
              {STEP_PHOTOS.map((p, i) => (
                <div key={p.src} className={`absolute inset-0 transition-opacity duration-[220ms] ease-[var(--ease-out)] ${i === step ? 'opacity-100' : 'opacity-0'}`}>
                  <Figure src={p.src} alt="" label={p.label} n={pad(i)} />
                </div>
              ))}
            </div>
            <p className="label mt-3 flex justify-between text-ink-soft"><span>{STEP_PHOTOS[step].label}</span><span>{pad(step)} / 04</span></p>
          </div>
          <ol className="lg:col-span-6 lg:col-start-7">
            {site.journey.map((j, i) => (
              <li key={j.title} className="jp-step border-t border-ink/20 py-10 lg:min-h-[44vh] lg:py-14">
                <div className="mb-6 aspect-[4/3] overflow-hidden lg:hidden"><Figure src={STEP_PHOTOS[i].src} alt="" label={STEP_PHOTOS[i].label} n={pad(i)} /></div>
                <span className={`label tabular-nums transition-colors duration-300 ${i === step ? 'text-ink' : 'text-ink-soft'}`}>{pad(i)}</span>
                <h3 className="mt-6 font-serif text-[clamp(2.4rem,4vw,3.8rem)] leading-[0.95] tracking-[-0.025em]">
                  {i === step ? <em>{j.title}</em> : j.title}
                </h3>
                <p className="mt-5 max-w-[36ch] leading-relaxed text-ink-soft">{j.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ═════════ "Agendamento": duas versões ═════════ */

const hoursLine = site.hours.map((h) => `${h.days}, ${h.time}`).join(' · ');

export function CtaPhoto() {
  return (
    <section id="agendar" data-final-cta className="on-dark relative overflow-hidden text-paper" aria-labelledby="cta-p">
      <div className="absolute inset-0" aria-hidden>
        <div data-parallax="0.04" className="absolute inset-[-3%_0]">
          <img src="./media/cta.webp" alt="" loading="lazy" className="h-full w-full object-cover object-[60%_center]" />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(29,34,31,0.85)_0%,rgba(29,34,31,0.5)_50%,rgba(29,34,31,0.2)_100%)]" />
      </div>
      <div className="relative mx-auto flex min-h-[86svh] max-w-[1600px] flex-col justify-end px-5 py-24 md:px-8 md:py-28">
        <SectionLabel index={site.faq.length ? '08' : '07'} dark>Agendamento</SectionLabel>
        <Lines id="cta-p" className="display mt-10 text-[clamp(3.4rem,8.4vw,9rem)]" lines={['Agende sua', <><em>avaliação.</em></>]} />
        <div className="mt-12 flex flex-col gap-6 border-t border-paper/20 pt-8 md:flex-row md:items-center md:justify-between" data-reveal="fade">
          <p className="max-w-md text-[0.9375rem] leading-relaxed text-paper/80">Pelo WhatsApp. A equipe confirma o horário com você.<br />{hoursLine}</p>
          <Button href={links.schedule} variant="paper">Agendar pelo WhatsApp</Button>
        </div>
      </div>
    </section>
  );
}

export function CtaLight() {
  return (
    <section id="agendar" data-final-cta className="border-t border-ink/15 bg-paper py-28 md:py-40" aria-labelledby="cta-l">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        <SectionLabel index={site.faq.length ? '08' : '07'}>Agendamento</SectionLabel>
        <Lines id="cta-l" className="display mt-10 text-[clamp(3.6rem,10vw,11rem)]" lines={[<>Agende sua <em>avaliação.</em></>]} />
        <div data-reveal="draw" className="mt-14 h-px w-full bg-ink/20" />
        <div className="grid gap-8 pt-8 md:grid-cols-12 md:items-center" data-reveal="fade">
          <div className="md:col-span-4"><Button href={links.schedule}>Agendar pelo WhatsApp</Button></div>
          <div className="md:col-span-3">
            <p className="label text-ink-soft">Telefone</p>
            <a href={links.phone} className="link-u mt-2 inline-block font-serif text-[1.6rem] tracking-[-0.02em]">{site.contact.phoneDisplay}</a>
          </div>
          <div className="md:col-span-5">
            <p className="label text-ink-soft">Horários</p>
            <p className="mt-2 text-[0.9375rem]">{hoursLine}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
