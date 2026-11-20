import { useEffect, useLayoutEffect, type ReactNode } from 'react';
import { initReveals, initSmoothScroll, ScrollTrigger } from './lib/motion';
import { CtaLight, CtaPhoto, JourneyGraphite, JourneyLight, JourneyPhoto } from './components/Variants';
import { Footer } from './components/Sections';

/** Página de comparação: cada opção aparece no contexto real, separada por uma faixa de identificação. */
function Divider({ id, title, note }: { id: string; title: string; note: string }) {
  return (
    <div id={id} className="flex flex-col gap-2 bg-[#c95b3c] px-5 py-6 text-white md:flex-row md:items-baseline md:justify-between md:px-8">
      <p className="font-serif text-[2rem] leading-none tracking-[-0.02em]">{title}</p>
      <p className="text-[0.875rem] text-white/90">{note}</p>
    </div>
  );
}

function Group({ children }: { children: ReactNode }) { return <>{children}</>; }

export default function Compare() {
  useEffect(() => initSmoothScroll(), []);
  useLayoutEffect(() => {
    const cleanup = initReveals();
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return cleanup;
  }, []);
  return (
    <main>
      <header className="bg-ink px-5 py-10 text-paper md:px-8">
        <p className="label text-paper/70">Clínica Norte · Variações para escolha</p>
        <h1 className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.025em]">Como funciona: A, B, C<br />Agendamento: 1, 2</h1>
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Opções">
          {[['a', 'A · Clara'], ['b', 'B · Com foto'], ['c', 'C · Grafite'], ['um', '1 · Foto de fundo'], ['dois', '2 · Clara editorial']].map(([id, l]) => (
            <a key={id} href={`#${id}`} className="btn btn-line text-paper">{l}</a>
          ))}
        </nav>
      </header>
      <Group>
        <Divider id="a" title="Opção A · Clara com números grandes" note="Fundo areia, números em itálico como elemento visual. Role para ver a linha avançar." />
        <JourneyLight />
        <Divider id="b" title="Opção B · Com foto que troca" note="A foto à esquerda muda conforme a etapa em leitura." />
        <JourneyPhoto />
        <Divider id="c" title="Opção C · Grafite quente" note="Fundo escuro em grafite no lugar da sálvia, mesmos números grandes." />
        <JourneyGraphite />
      </Group>
      <Group>
        <Divider id="um" title="Agendamento 1 · Foto de fundo" note="Exibido com o rodapé logo abaixo, como ficaria no site." />
        <CtaPhoto />
        <Footer />
        <Divider id="dois" title="Agendamento 2 · Clara e editorial" note="Exibido com o rodapé logo abaixo, como ficaria no site." />
        <CtaLight />
        <Footer />
      </Group>
    </main>
  );
}
