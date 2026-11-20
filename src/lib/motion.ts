import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/** Equivalentes GSAP das curvas de Emil: ease-out forte e ease-in-out forte. */
export const EASE_OUT = 'power4.out';
export const EASE_IN_OUT = 'power4.inOut';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let lenis: Lenis | null = null;

export function initSmoothScroll() {
  if (prefersReducedMotion()) return () => {};
  lenis = new Lenis({ duration: 1.05, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t: number) => lenis?.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => { gsap.ticker.remove(tick); lenis?.destroy(); lenis = null; };
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  // A hero fica fixada durante a expansão; "início" sempre volta ao topo absoluto
  if (id === 'inicio') {
    if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    return;
  }
  if (lenis) lenis.scrollTo(el, { offset: 0 });
  else el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
}

/** Stagger não uniforme (choreograph): intervalos que encolhem. */
const shrinking = (step: number) => (i: number) => i * step - i * (i - 1) * step * 0.12;

/**
 * Sistema global de reveals (uma entrada por contêiner):
 *  data-reveal="lines" → título (lead): linhas sobem, intervalos decrescentes
 *  data-reveal="fade"  → apoio: 8px + opacidade
 *  data-reveal="clip"  → figura revelada de baixo para cima; [data-zoom] assenta de 1.08
 *  data-reveal="draw"  → fio horizontal
 *  data-reveal="words" → texto que escurece palavra a palavra com o scroll (Aventura)
 *  data-parallax       → deslocamento sutil
 * Reduced motion: sem deslocamento; apenas opacidade.
 */
export function initReveals() {
  const mm = gsap.matchMedia();
  const once = (trigger: Element, start = 'top 85%') => ({ trigger, start, once: true });

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray<HTMLElement>('[data-reveal="lines"]').forEach((el) => {
      gsap.from(el.querySelectorAll('.line-inner'), { yPercent: 105, duration: 1, ease: EASE_OUT, stagger: shrinking(0.09), scrollTrigger: once(el) });
    });
    gsap.utils.toArray<HTMLElement>('[data-reveal="fade"]').forEach((el) => {
      gsap.from(el, { y: 8, opacity: 0, duration: 0.7, ease: EASE_OUT, delay: Number(el.dataset.delay || 0), scrollTrigger: once(el, 'top 90%') });
    });
    gsap.utils.toArray<HTMLElement>('[data-reveal="clip"]').forEach((el) => {
      gsap.fromTo(el, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: EASE_IN_OUT, scrollTrigger: once(el) });
      const z = el.querySelector('[data-zoom]');
      if (z) gsap.from(z, { scale: 1.08, duration: 1.6, ease: EASE_OUT, scrollTrigger: once(el) });
    });
    gsap.utils.toArray<HTMLElement>('[data-reveal="draw"]').forEach((el) => {
      gsap.from(el, { scaleX: 0, transformOrigin: 'left center', duration: 1.2, ease: EASE_IN_OUT, scrollTrigger: once(el, 'top 92%') });
    });
    gsap.utils.toArray<HTMLElement>('[data-reveal="words"]').forEach((el) => {
      gsap.fromTo(el.querySelectorAll('.w'), { opacity: 0.16 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 52%', scrub: true },
      });
    });
    gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
      const a = Number(el.dataset.parallax || 0.08);
      gsap.fromTo(el, { yPercent: a * 50 }, { yPercent: -a * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.utils.toArray<HTMLElement>('[data-reveal="fade"], [data-reveal="lines"], [data-reveal="clip"]').forEach((el) => {
      gsap.from(el, { opacity: 0, duration: 0.3, ease: 'none', scrollTrigger: once(el, 'top 95%') });
    });
  });
  return () => mm.revert();
}

export { gsap, ScrollTrigger };
