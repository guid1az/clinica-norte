import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
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
      className={`hero-layer hero-layer-${layer} pointer-events-none absolute inset-0 flex items-center justify-center ${tone === 'ink' ? 'text-ink' : 'text-paper'}`}
      style={{ clipPath: layer === 'dark' ? 'inset(0 50% 0 0)' : 'inset(0 0 0 50%)' }}>
      {layer === 'dark' ? (
        <h1 className="display text-center text-[18vw] md:text-[clamp(4.5rem,11.2vw,12.5rem)]">
          {HEADLINE.map((l, i) => <span key={i} className="line-mask"><span className="line-inner">{l}</span></span>)}
        </h1>
      ) : (
        <p className="display text-center text-[18vw] md:text-[clamp(4.5rem,11.2vw,12.5rem)]">
          {HEADLINE.map((l, i) => <span key={i} className="line-mask"><span className="line-inner">{l}</span></span>)}
        </p>
      )}
    </div>
  );
}

/**
 * Vídeo da abertura com autoplay confiável no celular.
 * O React não escreve o atributo `muted` no HTML, e o Safari do iPhone só permite
 * autoplay em vídeo que já nasce mudo. Por isso o mudo e o play são forçados aqui.
 * A versão leve é escolhida pela largura da tela (o atributo `media` em <source> não é confiável).
 */
function HeroVideo({ src, mobileSrc, poster }: { src: string; mobileSrc: string | null; poster: string | null }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.src = mobileSrc && window.matchMedia('(max-width: 767px)').matches ? mobileSrc : src;
    const tryPlay = () => { v.play().catch(() => {}); };
    tryPlay();
    v.addEventListener('canplay', tryPlay, { once: true });
    // Modo economia de energia pode bloquear o autoplay: o primeiro toque na página destrava
    const unlock = () => tryPlay();
    window.addEventListener('touchstart', unlock, { once: true, passive: true });
    const onVis = () => { if (!document.hidden) tryPlay(); };
    document.addEventListener('visibilitychange', onVis);
    return () => { window.removeEventListener('touchstart', unlock); document.removeEventListener('visibilitychange', onVis); };
  }, [src, mobileSrc]);
  return (
    <video ref={ref} className="h-full w-full object-cover" poster={poster ?? undefined}
      autoPlay muted loop playsInline preload="auto" aria-label="Vídeo ilustrativo do atendimento na clínica" />
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
          .from('.hero-layer .line-inner', { yPercent: 105, duration: 1, ease: EASE_OUT, stagger: 0.09 }, 0.15)
          .from('.hero-support', { y: 8, opacity: 0, duration: 0.7, ease: EASE_OUT }, 0.52)
          .from('.hero-meta', { opacity: 0, duration: 0.5, ease: 'none' }, 0.7);
      });
      // Expansão da mídia ao rolar (desktop e celular): mídia + duas camadas do título no mesmo recorte.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const st = { trigger: ref.current, start: 'top top', end: '+=75%', scrub: 0.6, pin: true, anticipatePin: 1 };
        const tl = gsap.timeline({ scrollTrigger: st, defaults: { ease: 'none' } });
        tl.fromTo('.hero-media', { clipPath: 'inset(0 0 0 50%)' }, { clipPath: 'inset(0 0 0 0%)' }, 0)
          .fromTo('.hero-layer-dark', { clipPath: 'inset(0 50% 0 0)' }, { clipPath: 'inset(0 100% 0 0)' }, 0)
          .fromTo('.hero-layer-light', { clipPath: 'inset(0 0 0 50%)' }, { clipPath: 'inset(0 0 0 0%)' }, 0)
          .to('.hero-left-meta, .hero-eyebrow', { opacity: 0, duration: 0.3 }, 0)
          .to('.hero-video-veil', { opacity: 0.5 }, 0);
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  const { heroVideo, heroVideoMobile, heroPoster } = site.media;

  return (
    <section id="inicio" ref={ref} data-hero className="relative h-[100svh] min-h-[640px] overflow-hidden bg-paper">
      {/* Mídia: ocupa a metade direita em qualquer tela, como no desktop */}
      <div className="hero-media absolute inset-0 [clip-path:inset(0_0_0_50%)]">
        <div className="hero-media-inner absolute inset-0 bg-sage-deep">
          {heroVideo ? (
            <HeroVideo src={heroVideo} mobileSrc={heroVideoMobile} poster={heroPoster} />
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
      <p className="hero-meta hero-eyebrow label absolute left-5 top-[96px] z-10 max-w-[calc(50vw-2rem)] text-ink md:left-8 md:top-[104px] md:max-w-none">
        Clínica odontológica<span className="md:hidden"><br /></span><span className="hidden md:inline"> · </span>{site.address.district}, {site.address.city}
      </p>

      {/* Rodapé da hero: esquerda (papel) */}
      <div className="hero-left-meta absolute bottom-7 left-5 z-10 max-w-[calc(50vw-2rem)] text-ink md:left-8 md:max-w-[19rem]">
        <p className="hero-support text-[0.8125rem] leading-relaxed text-ink-soft md:text-[0.9375rem]">
          Consultas sem pressa, planejamento digital e {site.teamSize} especialistas no mesmo lugar.
        </p>
        <div className="hero-support mt-5 flex gap-2 md:mt-6">
          <Button href={links.schedule} className="!px-4 md:!px-[1.6rem]">Agendar<span className="hidden md:inline">&nbsp;consulta</span></Button>
          <a href="#sobre" onClick={(e) => { e.preventDefault(); scrollToId('sobre'); }} className="btn btn-line hidden md:inline-flex">A clínica</a>
        </div>
      </div>

      {/* Rodapé da hero: direita (mídia) */}
      <dl className="hero-meta absolute bottom-7 right-5 z-10 hidden gap-10 text-paper md:right-8 md:flex">
        <div><dt className="label text-paper/75">Endereço</dt><dd className="mt-2 text-[0.8125rem]">{site.address.street}<br />{site.address.district} · {site.address.city}</dd></div>
        <div><dt className="label text-paper/75">Horários</dt><dd className="mt-2 text-[0.8125rem]">Segunda a sexta, 8h às 19h<br />Sábado, 8h às 12h</dd></div>
      </dl>

    </section>
  );
}
