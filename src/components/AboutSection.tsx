import { site } from '../config/site';
import { links } from '../lib/links';
import { Button, Figure, Lines, SectionLabel } from './ui';

/** Filosofia (o porquê). Fala de tempo e escuta; nenhuma outra seção repete isso. */
const STATEMENT =
  'Um bom tratamento começa pela escuta. Por isso nossas consultas não têm pressa: há tempo para entender o que você sente, explicar cada opção e decidir junto.';
const ITALIC = new Set(['escuta.', 'junto.']);

/** Quem somos (o quem). Equipe, história e responsabilidade técnica. */
export function AboutSection() {
  const words = STATEMENT.split(' ');
  const photo = site.media.aboutPhoto;
  return (
    <section id="sobre" className="bg-paper">
      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 pb-28 pt-28 md:grid-cols-12 md:px-8 md:pb-40 md:pt-44">
        <div className="md:col-span-3">
          <SectionLabel index="01">A clínica</SectionLabel>
        </div>
        <p data-reveal="words" className="font-serif text-[clamp(1.75rem,3.1vw,3.3rem)] leading-[1.06] tracking-[-0.025em] md:col-span-9">
          {words.map((w, i) => (
            <span key={i} className={`w ${ITALIC.has(w) ? 'italic' : ''}`}>{w}{i < words.length - 1 ? ' ' : ''}</span>
          ))}
        </p>
      </div>

      <div className="mx-auto grid max-w-[1600px] gap-10 px-5 pb-28 md:grid-cols-12 md:gap-8 md:px-8 md:pb-44">
        <figure className="md:col-span-4 md:col-start-1">
          <div data-reveal="clip" className="relative aspect-[4/5] overflow-hidden">
            <div data-parallax="0.08" className="absolute inset-[-6%_0]"><Figure src={photo.src} alt={photo.alt} label={photo.label} n="01" tone="greige" /></div>
          </div>
          <figcaption data-reveal="fade" className="mt-3 flex justify-between text-[0.8125rem] text-ink-soft">
            <span>{site.technicalLead.name}, {site.technicalLead.role.toLowerCase()}</span><span>{site.technicalLead.cro}</span>
          </figcaption>
        </figure>

        <div className="flex flex-col justify-between md:col-span-7 md:col-start-6">
          <Lines className="h-section" lines={[`${site.teamSize} especialistas,`, <>um só <em>plano de cuidado.</em></>]} />
          <div className="mt-14 grid gap-8 border-t border-ink/15 pt-8 sm:grid-cols-2">
            <p data-reveal="fade" className="leading-relaxed text-ink-soft">
              A {site.name} abriu em {site.founded} no {site.address.district}. Hoje reúne {site.teamSize} dentistas de áreas diferentes,
              sob responsabilidade técnica da {site.technicalLead.name}.
            </p>
            <p data-reveal="fade" data-delay="0.06" className="leading-relaxed text-ink-soft">
              Quando o seu caso envolve mais de uma especialidade, tudo acontece aqui, com a mesma equipe e sem encaminhamento para outro endereço.
            </p>
          </div>
          <div className="mt-12" data-reveal="fade"><Button href={links.schedule}>Agendar uma avaliação</Button></div>
        </div>
      </div>
    </section>
  );
}
