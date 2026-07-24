// Centralized i18n Dictionary for Spanish (ES), English (EN), and Portuguese (PT)

export const translations = {
  es: {
    nav: {
      services: 'Servicios',
      method: 'Método',
      about: 'Nosotros',
      blog: 'Blog',
      contact: 'Contacto',
      demoCta: 'Agendá una demo',
      whatsappCta: 'Escribinos por WhatsApp'
    },
    hero: {
      badge: 'Sistemas Digitales e Integración de Procesos',
      tagline: 'Eliminá las tareas manuales y conectá tu operación con sistemas a medida.',
      description: 'Diseñamos páginas web, software y automatizaciones que centralizan tus consultas, eliminan tareas manuales y ayudan a tu equipo a vender y operar de manera más eficiente.',
      ctaPrimary: 'Solicitar diagnóstico',
      ctaSecondary: 'Conocer nuestros servicios'
    },
    services: {
      title: 'Sistemas a medida para operar sin fricción',
      subtitle: 'Soluciones integradas para automatizar ventas, procesos y atención.'
    },
    footer: {
      tagline: 'Sistemas Digitales e Integración de Procesos para empresas e inmobiliarias.',
      rights: 'Todos los derechos reservados.',
      privacy: 'Política de Privacidad',
      terms: 'Términos del Servicio'
    }
  },
  en: {
    nav: {
      services: 'Services',
      method: 'Method',
      about: 'About Us',
      blog: 'Blog',
      contact: 'Contact',
      demoCta: 'Book a demo',
      whatsappCta: 'Message on WhatsApp'
    },
    hero: {
      badge: 'Digital Systems & Process Integration',
      tagline: 'Eliminate manual tasks and connect your operation with custom software.',
      description: 'We design websites, custom software, and automations that centralize your inquiries and boost team sales efficiency.',
      ctaPrimary: 'Request Diagnosis',
      ctaSecondary: 'Explore Services'
    },
    services: {
      title: 'Custom systems to operate without friction',
      subtitle: 'Integrated solutions to automate sales, operations, and customer support.'
    },
    footer: {
      tagline: 'Digital Systems & Process Integration for businesses and real estate.',
      rights: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    }
  },
  pt: {
    nav: {
      services: 'Serviços',
      method: 'Método',
      about: 'Sobre Nós',
      blog: 'Blog',
      contact: 'Contato',
      demoCta: 'Agendar demonstração',
      whatsappCta: 'Enviar mensagem no WhatsApp'
    },
    hero: {
      badge: 'Sistemas Digitais e Integração de Processos',
      tagline: 'Elimine tarefas manuais e conecte sua operação com sistemas sob medida.',
      description: 'Desenvolvemos sites, softwares e automações que centralizam suas consultas e otimizam suas vendas.',
      ctaPrimary: 'Solicitar Diagnóstico',
      ctaSecondary: 'Conhecer Serviços'
    },
    services: {
      title: 'Sistemas sob medida para operar sem atrito',
      subtitle: 'Soluções integradas para automatizar vendas, processos e atendimento.'
    },
    footer: {
      tagline: 'Sistemas Digitais e Integração de Processos para empresas e imobiliárias.',
      rights: 'Todos os direitos reservados.',
      privacy: 'Política de Privacidade',
      terms: 'Termos de Serviço'
    }
  }
};

export function getTranslation(lang = 'es') {
  return translations[lang] || translations.es;
}
