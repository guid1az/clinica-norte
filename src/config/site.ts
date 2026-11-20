/**
 * CONFIGURAÇÃO CENTRAL — Clínica Norte
 * Todos os dados profissionais, contatos, conteúdos editáveis e mídias ficam aqui.
 * Fonte: briefing do cliente (Clínica Norte, Curitiba/PR).
 *
 * Campos marcados com `null` ainda não foram fornecidos: os componentes
 * correspondentes se ocultam ou exibem um espaço reservado discreto.
 */

export type Treatment = { slug: string; name: string; description: string; image?: string | null };
export type Photo = { label: string; src: string | null; alt: string };

export const site = {
  name: 'Clínica Norte',
  wordmark: 'Norte',
  profession: 'Odontologia',
  tagline: 'Odontologia no Batel desde 2014.',
  founded: 2014,
  teamSize: 6,
  /** Domínio definitivo — substituir antes de publicar (usado em canonical, OG e sitemap). */
  url: 'https://www.clinicanorte.com.br',

  technicalLead: {
    name: 'Dra. Helena Martins',
    role: 'Responsável técnica',
    cro: 'CRO-PR 12345',
  },

  address: {
    street: 'Rua Bispo Dom José, 1180',
    complement: 'Sala 4',
    district: 'Batel',
    city: 'Curitiba',
    state: 'PR',
    postalCode: null as string | null, // CEP não informado
    country: 'BR',
  },

  contact: {
    whatsapp: '5541999990000',
    phone: '+5541999990000',
    phoneDisplay: '(41) 99999-0000',
    email: null as string | null,
  },

  social: {
    instagram: { handle: '@clinicanorte', url: 'https://www.instagram.com/clinicanorte' },
  },

  hours: [
    { days: 'Segunda a sexta', time: '8h às 19h', schema: 'Mo-Fr 08:00-19:00' },
    { days: 'Sábado', time: '8h às 12h', schema: 'Sa 08:00-12:00' },
  ],

  /** Atendimento de urgência: não informado no briefing → seção oculta. */
  emergency: { enabled: false, is24h: false, hours: null as string | null },

  messages: {
    schedule: 'Olá! Encontrei seu site e gostaria de agendar uma consulta.',
    emergency: 'Olá! Preciso de atendimento odontológico de urgência. Poderia me orientar sobre a disponibilidade?',
  },

  /**
   * Mapa incorporado do Google Maps. Em hospedagem própria, mude para `true`.
   * (Ambientes com política de conteúdo restrita bloqueiam iframes externos.)
   */
  map: { embed: false },

  media: {
    /** Vídeo da hero: ex. '/media/hero.mp4'. Sem vídeo → fundo cinematográfico animado. */
    heroVideo: './media/hero.mp4' as string | null,
    heroVideoMobile: './media/hero-mobile.mp4' as string | null,
    heroPoster: './media/hero-poster.jpg' as string | null,
    aboutPhoto: { label: 'Dra. Helena Martins', src: './media/about.webp', alt: 'Retrato da Dra. Helena Martins, responsável técnica da Clínica Norte' } as Photo,
    /** Imagens ilustrativas (Mixkit, licença gratuita) — substituir pelas fotos reais da clínica. */
    gallery: [
      { label: 'Atendimento', src: './media/atendimento.webp', alt: 'Dentista iniciando o atendimento' },
      { label: 'Consultório', src: './media/consultorio-amplo.webp', alt: 'Vista ampla do consultório com a cadeira odontológica' },
      { label: 'Equipamentos', src: './media/equipamentos.webp', alt: 'Instrumentos odontológicos no equipo' },
      { label: 'Detalhes', src: './media/detalhes.webp', alt: 'Materiais e instrumentos organizados na bancada' },
    ] as Photo[],
  },

  treatments: [
    { slug: 'lentes-facetas', image: './media/tratamentos/lentes-facetas.webp', name: 'Lentes de contato dental e facetas', description: 'Lâminas finas de cerâmica, planejadas digitalmente para harmonizar forma, cor e proporção dos dentes, quando indicadas na avaliação.' },
    { slug: 'implantes', image: './media/tratamentos/implantes.webp', name: 'Implantes dentários', description: 'Reposição de dentes perdidos, do exame de imagem à prótese final, com a posição de cada implante planejada no computador antes da cirurgia.' },
    { slug: 'clareamento', image: './media/tratamentos/clareamento.webp', name: 'Clareamento', description: 'Protocolos no consultório ou caseiros, sempre supervisionados, para clarear o tom dos dentes com segurança.' },
    { slug: 'alinhadores', image: './media/tratamentos/alinhadores.webp', name: 'Ortodontia invisível', description: 'Alinhadores transparentes e removíveis, com planejamento 3D das etapas de movimentação dos dentes.' },
    { slug: 'clinica-geral', image: './media/tratamentos/clinica-geral.webp', name: 'Clínica geral e prevenção', description: 'Consultas de rotina, limpeza profissional e restaurações para manter a saúde bucal em dia.' },
    { slug: 'odontopediatria', image: './media/tratamentos/odontopediatria.webp', name: 'Odontopediatria', description: 'Atendimento para crianças, com linguagem adequada à idade e consultas no ritmo delas.' },
  ] as Treatment[],

  /** Como a clínica trabalha. Cada pilar diz algo que nenhuma outra seção diz. */
  differentials: [
    { title: 'Planejamento digital', text: 'Escaneamos a boca em 3D, sem moldeira de massa. Você vê o planejamento do tratamento na tela antes de começar.' },
    { title: 'Para quem tem receio', text: 'Avise no agendamento. A equipe explica cada procedimento antes de fazer e você pode pedir pausa a qualquer momento.' },
    { title: 'Adultos e crianças', text: 'Da primeira consulta do seu filho à reabilitação com implantes, a família inteira é atendida na mesma clínica.' },
  ],

  journey: [
    { title: 'Contato', text: 'Você chama no WhatsApp e escolhe o melhor horário.' },
    { title: 'Avaliação', text: 'Exame clínico e escaneamento digital. Você conta o que sente e o que espera.' },
    { title: 'Plano', text: 'Apresentamos as opções possíveis, com etapas e prazos, e você decide com calma.' },
    { title: 'Acompanhamento', text: 'Retornos combinados para revisar o resultado e cuidar da manutenção.' },
  ],

  /**
   * Perguntas frequentes. Vazio = seção oculta.
   * Preencher com o que o cliente informar (convênios, formas de pagamento, duração da primeira consulta):
   * só entram perguntas que nenhuma outra seção já responde.
   */
  faq: [] as { q: string; a: string }[],

  nav: [
    { id: 'inicio', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'tratamentos', label: 'Tratamentos' },
    { id: 'consultorio', label: 'Consultório' },
    { id: 'contato', label: 'Contato' },
  ],
} as const;

export const fullAddress = `${site.address.street}, ${site.address.complement}, ${site.address.district}, ${site.address.city}, ${site.address.state}`;
