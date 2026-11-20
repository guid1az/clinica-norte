import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { site } from '../config/site';
import { links } from '../lib/links';
import { EASE_IN_OUT, EASE_OUT, gsap, scrollToId } from '../lib/motion';
import { Button } from './ui';

/**
 * Hero dividida (absorvida da Aventura): papel à esquerda, mídia à direita, título atravessando as duas metades.
 * O título existe em duas camadas recortadas — grafite sobre o papel, off-white sobre a mídia —, então a cor
 * troca exatamente na divisa. Ao rolar, a mídia se expande e ocupa a tela; as duas camadas acompanham o mesmo recorte.
 *
 * Coreografia de entrada (uma entrada por contêiner):
 *  mídia      decoração  0ms     1100ms  clip de baixo (ease-in-out)
 *  título     lead       150ms   1000ms  linhas sobem, intervalos 90/80ms
 *  subtítulo  apoio      520ms    700ms  8px + opacidade (junto com CTAs)
 *  meta       decoração  700ms    500ms  só opacidade
 */
const HEADLINE: ReactNode[] = [<>Seu sorriso,</>, <><em>no seu tempo.</em></>];

function Headline({ tone, layer }: { tone: 'ink' | 'paper'; layer: 'dark' | 'light' }) {
  return (
    <div aria-hidden={layer === 'light' ? true : undefined}
      className={`hero-layer hero-layer-${layer} pointer-events-none absolute inset-0 hidden items-center justify-center md:flex ${tone === 'ink' ? 'text-ink' : 'text-paper'}`}
      style={{ clipPath: layer === 'dark' ? 'inset(0 50% 0 0)' : 'inset(0 0 0 50%)' }}>
      {layer === 'dark' ? (
        <h1 className="display text-center text-[clamp(4.5rem,11.2vw,12.5rem)]">
          {HEADLINE.map((l, i) => <span key={i} className="line-mask"><span className="line-inner">{l}</span></span>)}
        </h1>
      ) : (
        <p className="display text-center text-[clamp(4.5rem,11.2vw,12.5rem)]">
          {HEADLINE.map((l, i) => <span key={i} className="line-mask"><span className="line-inner">{l}</span></span>)}
        </p>
      )}
    </div>
  );
}

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({ delay: 0.1 });
        tl.fromTo('.hero-media-inner', { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: EASE_IN_OUT }, 0)
          .from('.hero-layer .line-inner, .hero-mobile .line-inner', { yPercent: 105, duration: 1, ease: EASE_OUT, stagger: 0.09 }, 0.15)
          .from('.hero-support', { y: 8, opacity: 0, duration: 0.7, ease: EASE_OUT }, 0.52)
          .from('.hero-meta', { opacity: 0, duration: 0.5, ease: 'none' }, 0.7);
      });
      // Expansão da mídia ao rolar (desktop): media + duas camadas do título no mesmo recorte.
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const st = { trigger: ref.current, start: 'top top', end: '+=75%', scrub: 0.6, pin: true, anticipatePin: 1 };
        const tl = gsap.timeline({ scrollTrigger: st, defaults: { ease: 'none' } });
        tl.fromTo('.hero-media', { clipPath: 'inset(0 0 0 50%)' }, { clipPath: 'inset(0 0 0 0%)' }, 0)
          .fromTo('.hero-layer-dark', { clipPath: 'inset(0 50% 0 0)' }, { clipPath: 'inset(0 100% 0 0)' }, 0)
          .fromTo('.hero-layer-light', { clipPath: 'inset(0 0 0 50%)' }, { clipPath: 'inset(0 0 0 0%)' }, 0)
          .to('.hero-left-meta', { opacity: 0, duration: 0.3 }, 0)
          .to('.hero-video-veil', { opacity: 0.5 }, 0);
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const { heroVideo, heroVideoMobile, heroPoster } = site.media;

  return (
    <section id="inicio" ref={ref} data-hero className="relative h-[100svh] min-h-[640px] overflow-hidden bg-paper">
      {/* Mídia: no desktop ocupa a metade direita; no mobile, a parte de baixo */}
      <div className="hero-media absolute inset-x-0 bottom-0 top-[calc(140px+clamp(3.6rem,17vw,5.5rem)*1.75+11.5rem)] md:top-0 md:[clip-path:inset(0_0_0_50%)]">
        <div className="hero-media-inner absolute inset-0 bg-sage-deep">
          {heroVideo ? (
            <video className="h-full w-full object-cover" poster={heroPoster ?? undefined} autoPlay muted loop playsInline preload="auto" aria-label="Vídeo ilustrativo do atendimento na clínica">
              {heroVideoMobile && <source src={heroVideoMobile} type="video/mp4" media="(max-width: 767px)" />}
              <source src={heroVideo} type="video/mp4" />
            </video>
          ) : (
            <div className="grain absolute inset-0 overflow-hidden" role="img" aria-label="Espaço reservado para o vídeo institucional da clínica">
              <div className="anim-light absolute inset-[-20%] bg-[radial-gradient(40%_50%_at_62%_38%,rgba(214,222,209,0.35),transparent_70%)]" />
              <span className="label absolute right-8 top-24 z-[2] text-paper/75">Vídeo institucional</span>
            </div>
          )}
          <div className="hero-video-veil absolute inset-0 bg-night opacity-30" />
        </div>
      </div>

      {/* Título em duas camadas (desktop) */}
      <Headline tone="ink" layer="dark" />
      <Headline tone="paper" layer="light" />

      {/* Identificação: deixa claro, antes do título, que é uma clínica odontológica */}
      <p className="hero-meta label absolute left-5 top-[96px] z-10 text-ink md:left-8 md:top-[104px]">
        Clínica odontológica · {site.address.district}, {site.address.city}
      </p>

      {/* Título mobile (sem divisão) */}
      <div className="hero-mobile absolute inset-x-5 top-[140px] md:hidden">
        <h1 className="display text-[clamp(3.6rem,17vw,5.5rem)] text-ink">
          {HEADLINE.map((l, i) => <span key={i} className="line-mask"><span className="line-inner">{l}</span></span>)}
        </h1>
      </div>

      {/* Rodapé da hero: esquerda (papel) */}
      <div className="hero-left-meta absolute bottom-7 left-5 z-10 hidden max-w-[19rem] text-ink md:left-8 md:block">
        <p className="hero-support text-[0.9375rem] leading-relaxed text-ink-soft">
          Consultas sem pressa, planejamento digital e {site.teamSize} especialistas no mesmo lugar.
        </p>
        <div className="hero-support mt-6 flex gap-2">
          <Button href={links.schedule}>Agendar consulta</Button>
          <a href="#sobre" onClick={(e) => { e.preventDefault(); scrollToId('sobre'); }} className="btn btn-line">A clínica</a>
        </div>
      </div>

      {/* Rodapé da hero: direita (mídia) */}
      <dl className="hero-meta absolute bottom-7 right-5 z-10 hidden gap-10 text-paper md:right-8 md:flex">
        <div><dt className="label text-paper/75">Endereço</dt><dd className="mt-2 text-[0.8125rem]">{site.address.street}<br />{site.address.district} · {site.address.city}</dd></div>
        <div><dt className="label text-paper/75">Horários</dt><dd className="mt-2 text-[0.8125rem]">Segunda a sexta, 8h às 19h<br />Sábado, 8h às 12h</dd></div>
      </dl>

      {/* Mobile: apoio sob o título */}
      <div className="hero-support absolute inset-x-5 top-[calc(140px+clamp(3.6rem,17vw,5.5rem)*1.75+1.25rem)] md:hidden">
        <p className="max-w-[30ch] text-[0.9375rem] leading-relaxed text-ink-soft">
          Consultas sem pressa, planejamento digital e {site.teamSize} especialistas no mesmo lugar.
        </p>
        <a href={links.schedule} target="_blank" rel="noopener noreferrer" className="btn btn-ink mt-5">Agendar consulta</a>
      </div>
    </section>
  );
}
