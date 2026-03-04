/**
 * US-072: Réponses IA pré-écrites (mock) — minimum 15 contextuelles.
 */
export const AI_RESPONSES: Record<string, { title: string; message: string }> = {
  "patrimoine-brut": {
    title: "Patrimoine Brut",
    message:
      "Votre patrimoine brut de 1 465 800 € représente la somme de tous vos actifs avant déduction des dettes. Il inclut votre immobilier (85,3%), vos placements financiers (PEA, crypto, épargne) et vos liquidités. Ce chiffre est un bon indicateur de votre capacité d'accumulation.",
  },
  "patrimoine-net": {
    title: "Patrimoine Net",
    message:
      "Votre patrimoine net s'élève à 1 045 800 €, soit votre patrimoine brut diminué de vos dettes (420 000 € de CRD). C'est votre véritable richesse disponible. Un ratio net/brut de 71% est sain et témoigne d'un endettement maîtrisé.",
  },
  projection: {
    title: "Projection 10 ans",
    message:
      "Avec un taux de rendement moyen de 4,8%, votre patrimoine pourrait atteindre 1 785 000 € dans 10 ans. Cette projection tient compte de la capitalisation composée mais ne prédit pas les fluctuations de marché. Continuez votre effort d'épargne régulier pour maximiser cet effet.",
  },
  liquidites: {
    title: "Trésorerie & Liquidités",
    message:
      "Vous disposez de 12 450 € en comptes courants et 34 950 € en épargne de précaution, soit environ 6 mois de charges. C'est un bon coussin de sécurité. Votre taux d'épargne mensuel de 22% est supérieur à la moyenne française (15%).",
  },
  endettement: {
    title: "Endettement & HCSF",
    message:
      "Votre taux d'endettement de 24,5% reste sous le seuil HCSF de 35%. Vous disposez d'une capacité résiduelle d'emprunt d'environ 150 000 €. Le Haut Conseil de Stabilité Financière recommande de ne pas dépasser 35% de taux d'endettement.",
  },
  "revenus-locatifs": {
    title: "Revenus Locatifs",
    message:
      "Vos revenus locatifs bruts de 16 800 €/an (1 400 €/mois) génèrent un cash-flow net positif de 850 €/mois après déduction des crédits. C'est un excellent signal : votre patrimoine immobilier s'autofinance et dégage un surplus.",
  },
  fiscal: {
    title: "Fiscalité & TMI",
    message:
      "Votre TMI de 30% signifie que chaque euro supplémentaire gagné est imposé à 30%. Votre charge fiscale totale annuelle est de 16 500 €. Un versement PER de 10 000 € pourrait vous faire économiser environ 3 000 € d'impôt grâce à la déductibilité.",
  },
  per: {
    title: "PER (Plan Épargne Retraite)",
    message:
      "Votre PER cumule 45 100 € avec un rendement YTD de +5,2%. Les versements sont déductibles de votre revenu imposable (dans la limite de votre plafond). À la retraite, vous pourrez sortir en capital (imposé) ou en rente. Le PER est un outil puissant de défiscalisation et de préparation retraite.",
  },
  pea: {
    title: "PEA (Plan Épargne Actions)",
    message:
      "Votre PEA affiche 84 200 € avec une performance de +12,4% YTD. Après 5 ans de détention, les plus-values sont exonérées d'IR : seuls les prélèvements sociaux (17,2%) s'appliquent. Il vous reste 65 800 € de versements autorisés (plafond 150 000 €).",
  },
  crypto: {
    title: "Portefeuille Crypto",
    message:
      "Votre portefeuille crypto de 32 800 € est concentré sur Bitcoin (56%) et Ethereum (30%). Les plus-values crypto sont soumises à la flat tax de 30% (12,8% IR + 17,2% PS). N'oubliez pas de déclarer vos comptes sur plateformes étrangères (Binance, etc.).",
  },
  lmnp: {
    title: "LMNP (Loueur Meublé)",
    message:
      "Vos 2 biens en LMNP réel totalisent 395 000 € de valeur. Le régime réel vous permet d'amortir le bien et de déduire toutes les charges, réduisant ainsi l'imposition sur les loyers. Le taux d'occupation de 100% est optimal.",
  },
  sci: {
    title: "SCI Patrimoine",
    message:
      "Votre SCI à l'IS détient un immeuble estimé à 867 000 €. La répartition 60/40 entre vous et votre conjoint facilite la transmission progressive. L'abattement de 100 000 € par parent par enfant tous les 15 ans permet de transmettre des parts de manière fiscalement optimisée.",
  },
  pe: {
    title: "Private Equity",
    message:
      "Votre portefeuille PE de 25 000 € affiche un multiple TVPI de 1,05x, soit une légère plus-value. Le private equity est un investissement illiquide de long terme (7-10 ans). Les appels de fonds sont progressifs et les distributions arrivent à maturité. Votre IRR estimé de ~4,2% devrait s'améliorer avec les prochaines distributions.",
  },
  "assurance-vie": {
    title: "Assurance Vie",
    message:
      "Votre contrat d'assurance vie de 42 000 € est réparti entre fonds euros (60%, capital garanti) et unités de compte (40%, potentiel de rendement supérieur). Après 8 ans, vous bénéficiez d'un abattement fiscal de 4 600 € (9 200 € pour un couple) sur les plus-values.",
  },
  diversification: {
    title: "Score de Diversification",
    message:
      "Votre score de diversification de 4/10 indique une concentration élevée sur l'immobilier (85,3%). Pour améliorer ce score, envisagez de renforcer vos placements financiers (PEA, assurance vie) et d'explorer d'autres classes d'actifs comme les obligations ou les matières premières.",
  },
  cto: {
    title: "Compte-Titres Ordinaire",
    message:
      "Votre CTO vous donne accès à tous les marchés mondiaux sans restriction (contrairement au PEA limité aux actions européennes). La fiscalité est moins avantageuse : flat tax 30% dès le premier euro de plus-value. Vous pouvez opter pour le barème progressif si votre TMI est inférieure à 12,8%.",
  },
};
