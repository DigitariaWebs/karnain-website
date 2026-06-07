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
      { label: "Collection", href: "/#collection" },
      { label: "La maison", href: "/#histoire" },
      { label: "Contact", href: "/#contact" },
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
    eyebrow: "Contact",
    title: "Une fragrance vous appelle ?",
    body: "Écrivez-nous ou appelez-nous — nous vous conseillons avec plaisir.",
    emailCta: "Nous écrire",
    emailSubject: "Renseignement — parfums Karnain",
    phoneCta: "Nous appeler",
  },

  cart: {
    bag: "Panier",
    openBag: "Ouvrir le panier",
    closeBag: "Fermer le panier",
    addToBag: "Ajouter au panier",
    title: "Votre panier",
    empty: "Votre panier est vide.",
    emptyCta: "Découvrir la collection",
    subtotal: "Sous-total",
    increase: "Augmenter la quantité",
    decrease: "Diminuer la quantité",
    remove: "Retirer",
    continue: "Continuer mes achats",
    viewBag: "Voir le panier",
    checkout: "Passer la commande",
    checkoutSoon: "Le paiement en ligne arrive bientôt.",
  },

  product: {
    backToCollection: "Retour à la collection",
    notesTitle: "Les notes",
    noteHead: "Note de tête",
    noteHeart: "Note de cœur",
    noteBase: "Note de fond",
    adviceLabel: "Besoin de conseil ?",
    emailCta: "Écrivez-nous",
    emailSubject: "Conseil — {fragrance}",
    galleryZoom: "Agrandir l’image",
    galleryClose: "Fermer",
    galleryPrev: "Image précédente",
    galleryNext: "Image suivante",
    alsoTitle: "À découvrir aussi",
    notFoundTitle: "Fragrance introuvable",
    notFoundBody: "Cette fragrance n’existe pas ou n’est plus disponible.",
    errorTitle: "Une erreur est survenue",
    errorBody: "Impossible d’afficher cette fragrance pour le moment.",
    retry: "Réessayer",
  },

  footer: {
    tagline: "Maison de parfum française. Des fragrances d’exception, à la française.",
    maisonTitle: "La maison",
    serviceTitle: "Service client",
    followTitle: "Suivez-nous",
    instagram: "Instagram",
    legalNote: "Mentions légales et CGV — bientôt disponibles.",
    rights: "Tous droits réservés.",
  },
} as const;
