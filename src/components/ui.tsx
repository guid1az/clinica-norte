import type { ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { site } from '../config/site';

/** Título revelado por linhas. Cada item é uma linha. */
export function Lines({ lines, as: Tag = 'h2', className = '', id, manual = false }: {
  lines: ReactNode[]; as?: 'h1' | 'h2' | 'h3' | 'p'; className?: string; id?: string; manual?: boolean;
}) {
  return (
    <Tag id={id} className={className} data-reveal={manual ? undefined : 'lines'}>
      {lines.map((l, i) => <span key={i} className="line-mask"><span className="line-inner">{l}</span></span>)}
    </Tag>
  );
}

/** Rótulo de seção editorial: número + nome, separados por um fio. */
export function SectionLabel({ index, children, dark = false }: { index: string; children: ReactNode; dark?: boolean }) {
  return (
    <div data-reveal="fade" className={`label flex items-center gap-3 ${dark ? 'text-paper/75' : 'text-ink-soft'}`}>
      <span className="tabular-nums">{index}</span>
      <span className={`h-px w-8 ${dark ? 'bg-paper/30' : 'bg-ink/25'}`} />
      <span>{children}</span>
    </div>
  );
}

export function Button({ href, children, variant = 'ink', className = '', external = true, onClick }: {
  href: string; children: ReactNode; variant?: 'ink' | 'paper' | 'line'; className?: string; external?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <a href={href} onClick={onClick} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`btn btn-${variant} ${className}`}>
      {children}
      <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={1.5} />
    </a>
  );
}

/** Espaço reservado para fotografia real — tratado como "figura" editorial. */
export function Figure({ src, alt, label, n, tone = 'stone', className = '' }: {
  src: string | null; alt: string; label: string; n: string; tone?: 'stone' | 'sage' | 'greige' | 'night'; className?: string;
}) {
  if (src) return <img data-zoom src={src} alt={alt} loading="lazy" className={`h-full w-full object-cover ${className}`} />;
  const bg = { stone: '#dcd7cc', sage: '#a7b1a3', greige: '#c4bfb3', night: '#2f3732' }[tone];
  const light = tone === 'night';
  return (
    <div data-zoom role="img" aria-label={`Espaço reservado para fotografia: ${label}`}
      className={`grain relative h-full w-full overflow-hidden ${className}`} style={{ background: bg }}>
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_30%_20%,rgba(255,255,255,0.28),transparent_70%)]" />
      <span className={`label absolute left-4 top-[7%] z-[2] ${light ? 'text-paper/75' : 'text-ink/70'}`}>Fig. {n}</span>
      <span className={`label absolute bottom-[7%] left-4 z-[2] ${light ? 'text-paper/75' : 'text-ink/70'}`}>{label}</span>
    </div>
  );
}

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-serif text-[1.55rem] leading-none tracking-[-0.02em] ${className}`}>
      Clínica <em className="italic">{site.wordmark}</em>
    </span>
  );
}
