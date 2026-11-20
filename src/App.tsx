import { useEffect, useLayoutEffect } from 'react';
import { initReveals, initSmoothScroll, ScrollTrigger } from './lib/motion';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { TreatmentsSection } from './components/TreatmentsSection';
import {
  ClinicGallery, DifferentialsSection, EmergencySection, FAQSection, Footer,
  LocationSection, WhatsAppButton,
} from './components/Sections';
import { CtaPhoto, JourneyLight } from './components/Variants';

export default function App() {
  useEffect(() => initSmoothScroll(), []);

  useLayoutEffect(() => {
    const cleanup = initReveals();
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    return () => { cleanup(); window.removeEventListener('load', refresh); };
  }, []);

  return (
    <>
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Navbar />
      <main id="conteudo">
        <HeroSection />
        <AboutSection />
        <TreatmentsSection />
        <DifferentialsSection />
        <ClinicGallery />
        <JourneyLight />
        <EmergencySection />
        <FAQSection />
        <LocationSection />
        <CtaPhoto />
      </main>
      <Footer />
      <aside aria-label="Agendamento rápido"><WhatsAppButton /></aside>
    </>
  );
}
