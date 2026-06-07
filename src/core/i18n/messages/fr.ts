/**
 * French UI dictionary (single source of user-facing chrome copy).
 * Curly quotes/apostrophes and real ellipses per docs/conventions/copy.md.
 * Domain content (fragrance names, descriptions) lives in the catalog slice, not here.
 */
export const fr = {
  nav: {
    brandHome: "Karnain — accueil",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    items: [
      { label: "Collection", href: "#collection" },
      { label: "La maison", href: "#histoire" },
      { label: "Contact", href: "#contact" },
    ],
  },

  hero: {
    eyebrow: "Maison de parfum · France",
    statement: "L’art du parfum, à la française.",
    lede: "Des fragrances d’exception, composées à partir des essences les plus nobles, pour celles et ceux qui font du parfum une signature.",
    primaryCta: "Découvrir la collection",
    secondaryCta: "Nous contacter",
  },

  signatures: {
    eyebrow: "Les incontournables",
    title: "Les signatures",
    intro: "Nos fragrances les plus désirées, à découvrir en premier.",
  },

  collection: {
    eyebrow: "La collection",
    title: "Karnain Addicte",
    intro:
      "Une collection de parfums d’exception — des classiques que les amoureux du parfum se doivent de posséder.",
    imageComingSoon: "Visuel à venir",
    fromLabel: "À partir de",
  },

  story: {
    eyebrow: "La maison",
    title: "L’art du parfum",
    body1:
      "Depuis le XVIᵉ siècle, la culture de la plante à parfum et l’art de composer se transmettent en Pays de Grasse. Karnain s’inscrit dans cet héritage, avec le goût de la mesure et de l’élégance.",
    body2:
      "Nos parfums sont composés par de grands nez, formés dans les plus grandes maisons, à partir des essences les plus nobles — matières choisies aux quatre coins du monde, sans compromis.",
  },

  contact: {
    eyebrow: "Commander",
    title: "Une fragrance vous appelle ?",
    body: "Écrivez-nous pour commander ou pour être conseillé. Nous vous répondons personnellement.",
    whatsappCta: "Commander sur WhatsApp",
    whatsappMessage: "Bonjour Karnain, je souhaite des renseignements sur vos parfums.",
    emailCta: "Nous écrire",
    emailSubject: "Renseignement — parfums Karnain",
  },

  footer: {
    tagline: "Maison de parfum française. Des fragrances d’exception, à la française.",
    maisonTitle: "La maison",
    orderTitle: "Commander",
    followTitle: "Suivez-nous",
    instagram: "Instagram",
    legalNote: "Mentions légales et CGV — bientôt disponibles.",
    rights: "Tous droits réservés.",
  },
} as const;
