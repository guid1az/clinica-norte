import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { site } from '../config/site';
import { links } from '../lib/links';
import { Figure, Lines, SectionLabel } from './ui';

/**
 * Lista editorial numerada + fotografia fixa que troca com o tratamento selecionado.
 * A troca é frequente: crossfade de 220ms, sem deslocamento (Emil: interação repetida = movimento mínimo).
 */
export function TreatmentsSection() {
  const [active, setActive] = useState(0);
  const [canHover, setCanHover] = useState(false);
  useEffect(() => setCanHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches), []);
  const list = site.treatments;
  const shown = Math.max(active, 0);

  return (
    <section id="tratamentos" className="bg-stone py-28 md:py-40">
      <div className="mx-auto max-w-[1600px] px-5 md:px-8">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3"><SectionLabel index="02">Tratamentos</SectionLabel></div>
          <div className="md:col-span-9">
            <Lines className="h-section" lines={[`${list.length} tratamentos,`, <>uma <em>avaliação</em> para começar.</>]} />
            <p data-reveal="fade" className="mt-8 max-w-md leading-relaxed text-ink-soft">
              O que é indicado para você depende do exame clínico. Na avaliação, conversamos sobre as opções possíveis.
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-8 md:mt-24 lg:grid-cols-12 lg:gap-12">
          {/* Fotografia fixa (desktop) */}
          <div className="relative hidden lg:sticky lg:top-[14vh] lg:col-span-4 lg:block lg:h-[70vh]" aria-hidden>
            <div data-reveal="clip" className="relative h-full overflow-hidden">
              {list.map((t, i) => (
                <div key={t.slug} className={`absolute inset-0 transition-opacity duration-[220ms] ease-[var(--ease-out)] ${i === shown ? 'opacity-100' : 'opacity-0'}`}>
                  <Figure src={t.image ?? null} alt="" label={t.name} n={String(i + 1).padStart(2, '0')} tone="greige" />
                </div>
              ))}
            </div>
            <p className="label mt-3 flex justify-between text-ink-soft">
              <span>{list[shown].name}</span>
              <span className="tabular-nums">{String(shown + 1).padStart(2, '0')} / {String(list.length).padStart(2, '0')}</span>
            </p>
          </div>

          <ol className="border-t border-ink/20 lg:col-span-8">
            {list.map((t, i) => {
              const on = i === active;
              return (
                <li key={t.slug} className="border-b border-ink/20">
                  <button type="button" onClick={() => setActive(on && !canHover ? -1 : i)} onMouseEnter={canHover ? () => setActive(i) : undefined}
                    aria-expanded={on} aria-controls={`t-${t.slug}`}
                    className="grid w-full grid-cols-[3rem_1fr_auto] items-baseline py-6 text-left md:grid-cols-[5rem_1fr_auto] md:py-8">
                    <span className="label tabular-nums text-ink-soft">{String(i + 1).padStart(2, '0')}</span>
                    <span className={`font-serif text-[clamp(1.6rem,2.55vw,2.55rem)] leading-[0.95] tracking-[-0.025em] transition-colors duration-200 ${on ? 'text-ink' : 'text-ink/55'}`}>
                      {on ? <em>{t.name}</em> : t.name}
                    </span>
                    <span aria-hidden className="relative ml-4 size-3 shrink-0 self-center">
                      <span className="absolute left-0 top-1/2 h-px w-3 bg-current" />
                      <span className={`absolute left-1/2 top-0 h-3 w-px bg-current transition-transform duration-200 ${on ? 'scale-y-0' : ''}`} />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {on && (
                      <motion.div id={`t-${t.slug}`} key="d" className="overflow-hidden"
                        initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }}
                        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}>
                        <div className="grid gap-6 pb-8 md:grid-cols-[5rem_1fr_auto] md:items-end">
                          <span className="hidden md:block" />
                          <div className="pl-12 md:pl-0">
                            {/* Mobile: a foto aparece dentro do item aberto */}
                            {t.image && (
                              <div className="mb-5 aspect-[4/3] overflow-hidden lg:hidden">
                                <Figure src={t.image} alt="" label={t.name} n={String(i + 1).padStart(2, '0')} />
                              </div>
                            )}
                            <p className="max-w-md leading-relaxed text-ink-soft">{t.description}</p>
                          </div>
                          <a href={links.treatment(t.name)} target="_blank" rel="noopener noreferrer" className="label link-u ml-12 justify-self-start py-2 md:ml-0">
                            Agendar avaliação ↗
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
