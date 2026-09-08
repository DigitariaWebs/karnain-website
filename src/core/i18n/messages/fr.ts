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
      { label: "Collection", href: "/collection" },
      { label: "La maison", href: "/maison" },
      { label: "Contact", href: "/#contact" },
    ],
  },

  heroCarousel: {
    carousel: "Nos parfums signature",
    eyebrow: "Extrait de parfum",
    previous: "Parfum précédent",
    next: "Parfum suivant",
    discover: "Découvrir",
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

  collectionPage: {
    eyebrow: "La collection",
    title: "Karnain Addicte",
    intro: "Six fragrances d’exception. Affinez par famille pour trouver la vôtre.",
    filterLabel: "Filtrer",
    filterAll: "Tout",
  },

  badges: {
    new: "Nouveau",
    bestSeller: "Best-seller",
  },

  story: {
    eyebrow: "La maison",
    title: "L’art du parfum",
    body1:
      "Depuis le XVIᵉ siècle, la culture de la plante à parfum et l’art de composer se transmettent en Pays de Grasse. Karnain s’inscrit dans cet héritage, avec le goût de la mesure et de l’élégance.",
    body2:
      "Nos parfums sont composés par de grands nez, formés dans les plus grandes maisons, à partir des essences les plus nobles — matières choisies aux quatre coins du monde, sans compromis.",
    cta: "Découvrir la maison",
  },

  /**
   * PLACEHOLDER COPY — deliberately evocative rather than factual, so nothing
   * here asserts a history we cannot source. Replace with Maroin’s real brand
   * story when it arrives (see the tracked task); the page structure holds.
   */
  maison: {
    eyebrow: "La maison",
    title: "Entrer dans l’univers Karnain",
    lede: "Karnain est née d’une conviction simple : un parfum ne se porte pas, il se raconte. Chaque fragrance de la maison est pensée comme un souvenir que l’on emporte avec soi.",
    chapters: [
      {
        title: "L’origine",
        body1:
          "Tout commence par une obsession — celle du geste juste. Choisir une matière plutôt qu’une autre, doser à quelques gouttes près, recommencer jusqu’à ce que l’accord s’impose de lui-même.",
        body2:
          "La maison avance à son rythme. Peu de fragrances, longuement travaillées, plutôt qu’une collection qui s’étire. Ce que nous signons doit pouvoir se porter dix ans sans se démoder.",
      },
      {
        title: "La composition",
        body1:
          "Nos parfums sont des extraits : une concentration élevée, une tenue longue, une évolution lente sur la peau. Les matières sont choisies pour leur caractère — une rose qui n’est pas sage, un cuir qui garde sa rudesse, une vanille qui ne bascule jamais dans le sucre facile.",
        body2: "Rien n’est ajouté pour faire joli. Si une note ne sert pas l’accord, elle sort.",
      },
      {
        title: "Le flacon",
        body1:
          "Un verre épais, un bouchon doré, une étiquette blanche qui laisse la fragrance parler. Le flacon Karnain est le même d’une fragrance à l’autre — seule la couleur du parfum change.",
        body2: "C’est une famille, pas une collection d’objets.",
      },
    ],
    quote: "Un parfum réussi ne se remarque pas tout de suite. Il se reconnaît.",
    closingTitle: "Trouver la vôtre",
    closingBody:
      "Six fragrances, six caractères. La plus juste est rarement celle que l’on croit — prenez le temps de les découvrir.",
    closingCta: "Découvrir la collection",
  },

  campaign: {
    eyebrow: "La maison Karnain",
    title: "Six fragrances d’exception. Une signature.",
    cta: "Découvrir la collection",
  },

  instagram: {
    eyebrow: "Suivez-nous",
    handle: "@karnain",
    cta: "Nous suivre sur Instagram",
  },

  contact: {
    eyebrow: "Contact",
    title: "Une fragrance vous appelle ?",
    body: "Écrivez-nous — nous vous conseillons avec plaisir.",
    emailCta: "Nous écrire",
    emailSubject: "Renseignement — parfums Karnain",
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
    checkoutPending: "Redirection vers le paiement…",
    checkoutSoon: "Le paiement en ligne arrive bientôt.",
  },

  orderConfirmation: {
    confirmed: {
      eyebrow: "Commande confirmée",
      title: "Merci pour votre commande",
      body: "Votre paiement a bien été reçu. Un e-mail de confirmation vous parviendra sous peu.",
      cta: "Continuer mes achats",
      href: "/collection",
    },
    processing: {
      eyebrow: "Commande enregistrée",
      title: "Merci pour votre commande",
      body: "Votre paiement est en cours de validation. Vous recevrez un e-mail dès qu’il sera confirmé.",
      cta: "Continuer mes achats",
      href: "/collection",
    },
    failed: {
      eyebrow: "Paiement non finalisé",
      title: "Votre commande n’a pas abouti",
      body: "Aucun montant n’a été débité. Votre panier vous attend si vous souhaitez réessayer.",
      cta: "Retour au panier",
      href: "/panier",
    },
    unknown: {
      eyebrow: "Commande",
      title: "Commande introuvable",
      body: "Nous ne trouvons pas cette commande. Si vous venez de régler, l’e-mail de confirmation fait foi.",
      cta: "Découvrir la collection",
      href: "/collection",
    },
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
