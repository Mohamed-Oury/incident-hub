import { PrismaClient, ProjectCategory, BlogCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Démarrage du seeding de la base de données (Portfolio + Monétique)...');

  // 1. Création de l'utilisateur Admin principal (Mr. Oury)
  const adminEmail = 'mohaourydiallo@gmail.com';
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: 'Mr. Oury',
      role: 'ADMIN',
      active: true,
    },
    create: {
      email: adminEmail,
      name: 'Mr. Oury',
      passwordHash: '$2a$12$K1vGj3Sgq0fR5uR4.fO2eO8.R3e2E3e2E3e2E3e2E3e2E3e2E3e2E',
      role: 'ADMIN',
      active: true,
    },
  });

  console.log('✅ Utilisateur admin configuré:', adminUser.email);

  // 2. Données "À Propos" (Bio, Expériences, Formation, Compétences, Langues)
  const experiencesArray = [
    {
      company: 'SGABS',
      position: 'Consultant Senior en Développement logiciel et Pilotage projet',
      period: 'Mars 2024 - Présent',
      description: 'Senior React / Next.js développement. Rédaction et supervision des tests. Maintenance et conception des applications pour le CBS Sopra Banking System. Pilotage des projets frontend pour les différentes filiales Afrique Subsaharienne (AFS) du groupe.'
    },
    {
      company: 'AMARIS CONSULTING',
      position: 'Ingénieur Logiciel',
      period: 'Mars 2024 - Présent',
      description: 'Définition des exigences d\'amélioration chez nos clients. Développer, maintenir et documenter des applications. Piloter des équipes de développement d\'application pour nos clients.'
    },
    {
      company: 'Novate Digital',
      position: 'Développeur Fullstack',
      period: 'Décembre 2020 - Février 2024',
      description: 'Analyse des besoins et conception d\'applications en ReactJS / Angular. Architecture et développement d\'applications web convertibles en desktop (Angular + ElectronJS).'
    }
  ];

  const educationArray = [
    {
      degree: 'Master en Mathématiques',
      school: 'Université Nangui Abrogoua',
      specialization: 'Optimisation & Analyse Numérique',
      year: '2020'
    },
    {
      degree: 'Licence en Mathématiques & Informatique',
      school: 'Université Nangui Abrogoua',
      specialization: 'Mathématiques & Informatique',
      year: '2018'
    }
  ];

  const aboutData = await prisma.about.upsert({
    where: { id: 'main-about' },
    update: {
      title: 'Ingénieur Logiciel, Mathématicien & Expert CBS / Monétique',
      subtitle: 'Expertise ciblée : Mathématiques Appliquées, CBS Amplitude & Flex, Informix 4GL et Monétique Payway & Powercard',
      content: `# À propos de moi

Je suis un **ingénieur logiciel & mathématicien** diplômé d'un **Master en Mathématiques** (Optimisation & Analyse Numérique). Mon expertise est construite autour de 4 piliers technologiques d'excellence : **Mathématiques**, **CBS Amplitude & Flex**, **Informix 4GL** et **Monétique Payway & Powercard**.

## Domaines d'expertise majeurs

1. **Mathématiques** : Master en Mathématiques, Analyse Numérique, Modélisation & Algorithmes d'optimisation.
2. **CBS Amplitude & Flex** : Sopra Banking Amplitude (v10-v13), Oracle FlexCube, traitements bancaires Core & arrêtés EOD/BOD.
3. **Informix 4GL & Genero BDL** : Développement 4GL Core Banking, masques .per, déclencheurs SQL et automatisation batch.
4. **Monétique Payway & Powercard** : Supervision des incidents monétiques, décodage trames ISO 8583, EMV TLV/TVR, HPS Powercard & Payway.`,
      skills: JSON.stringify([
        { category: 'Mathématiques & Quant', items: ['Analyse Numérique', 'Optimisation sous contraintes', 'Modélisation', 'Algorithmes'] },
        { category: 'CBS Amplitude & Flex', items: ['Sopra Banking Amplitude (v10-v13)', 'Oracle FlexCube', 'Comptabilité bancaire', 'EOD / BOD Batch'] },
        { category: '4GL & System', items: ['Informix 4GL', 'Genero BDL', 'Masques .per', 'Shell AIX / Unix', 'SGBD Informix & Oracle'] },
        { category: 'Monétique Payway & Powercard', items: ['Monétique Payway', 'HPS Powercard', 'Trame ISO 8583', 'Puces EMV (TLV/TVR)', 'ARQC/ARPC'] },
        { category: 'Frontend & APIs', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST APIs', 'Prisma ORM'] },
      ]),
      experiences: JSON.stringify(experiencesArray),
      education: JSON.stringify(educationArray),
      languages: JSON.stringify([
        { name: 'Français', level: 'Courant' },
        { name: 'Anglais', level: 'Professionnel' }
      ])
    },
    create: {
      id: 'main-about',
      title: 'Ingénieur Logiciel & Mathématicien',
      subtitle: 'Spécialisé en développement Frontend, Mobile, Systèmes Bancaires CBS (Amplitude) et Optimisation / Analyse Numérique',
      content: `# À propos de moi

Je suis un **ingénieur logiciel** passionné avec un **Master en Mathématiques** spécialisé en optimisation et analyse numérique. Mon parcours unique me permet d'allier rigueur mathématique et innovation technologique.`,
      skills: JSON.stringify([
        { category: 'Frontend', items: ['React', 'Next.js', 'Angular', 'TypeScript', 'Tailwind CSS', 'Redux'] },
        { category: 'Backend & APIs', items: ['Node.js', 'Java Spring Boot', 'REST', 'Prisma ORM'] },
        { category: 'Bases de données', items: ['PostgreSQL', 'MySQL', 'Informix', 'Oracle'] },
        { category: 'Mobile', items: ['Flutter', 'React Native'] },
        { category: 'CBS / Monétique', items: ['Amplitude (v10-v13)', 'Informix 4GL', 'Monetique PowerCard', 'ISO 8583', 'EMV'] },
        { category: 'Mathématiques', items: ['Analyse numérique', 'Optimisation', 'Algorithmes', 'Modélisation'] },
        { category: 'Outils & DevOps', items: ['Git', 'Docker', 'JIRA', 'CI/CD'] },
      ]),
      experiences: JSON.stringify(experiencesArray),
      education: JSON.stringify(educationArray),
      languages: JSON.stringify([
        { name: 'Français', level: 'Courant' },
        { name: 'Anglais', level: 'Professionnel' }
      ])
    }
  });

  console.log('✅ Données About initialisées:', aboutData.title);

  // 3. Données des Projets Réels
  const projects = [
    {
      id: 'gest-coffre-fort',
      title: 'Gest-Coffre-fort',
      excerpt: 'Application bancaire de gestion des coffres-forts avec architecture hexagonale.',
      description: 'Application de gestion des coffres-forts des filiales du groupe SG permettant les parcours d\'enregistrement des coffres à la souscription de contrat de location de coffres par les clients de la banque.\n\n## Fonctionnalités\n- Gestion complète des coffres-forts\n- Parcours de souscription client\n- Interface d\'administration\n- Suivi des contrats de location\n\n## Architecture\nArchitecture Hexagonale pour une séparation claire des responsabilités.',
      technologies: JSON.stringify(['Next.js', 'TypeScript', 'Redux', 'Redux Toolkit', 'Java Spring Boot']),
      category: 'BANCAIRE' as ProjectCategory,
      published: true,
      featured: true,
    },
    {
      id: 'meteo-tfj',
      title: 'Météo TFJ - SGABS',
      excerpt: 'Application de suivi des traitements de fin de journée bancaires pour les filiales SG.',
      description: 'Application d\'enregistrement des traitements de fin de journée (TFJ) réalisés par les filiales (SGCI, SGSN et SGCAM).\n\n## Fonctionnalités\n- Répertoire des transactions (virements émis/reçus)\n- Gestion des incidents survenus\n- Reporting automatique avec durées des TFJ\n- Statistiques d\'incidents par filiale\n- Interface dédiée aux décisionnaires',
      technologies: JSON.stringify(['React', 'TypeScript', 'Java Spring Boot']),
      category: 'BANCAIRE' as ProjectCategory,
      published: true,
      featured: true,
    },
    {
      id: 'ods-card',
      title: 'ODS CARD - Monétique SGABS',
      excerpt: 'Système de gestion monétique pour les cartes bancaires avec Informix 4GL.',
      description: 'Application de gestion des services de monétique de la SG permettant les parcours d\'enregistrement de commande de carte à la remise des cartes aux clients.\n\n## Fonctionnalités\n- Gestion complète du cycle de vie des cartes\n- Commandes de cartes clients\n- Suivi des livraisons\n- Interface de remise aux clients\n- Reporting monétique',
      technologies: JSON.stringify(['Informix 4GL', 'Oracle', 'CBS', 'ISO 8583']),
      category: 'BANCAIRE' as ProjectCategory,
      published: true,
      featured: true,
    },
    {
      id: 'please-leasing',
      title: 'PLease - SGABS',
      excerpt: 'Plateforme de gestion des opérations de leasing bancaire avec React et TypeScript.',
      description: 'Application d\'enregistrement de compte, contrat et de prélèvement bancaire pour les opérations de Leasing (Prêt Automobile, Immobilier, etc.).\n\n## Fonctionnalités\n- Gestion des comptes clients\n- Création et suivi des contrats de leasing\n- Gestion des prélèvements automatiques\n- Reporting des opérations',
      technologies: JSON.stringify(['React', 'TypeScript', 'Tailwind CSS']),
      category: 'BANCAIRE' as ProjectCategory,
      published: true,
      featured: false,
    },
    {
      id: 'epsi-vente',
      title: 'Epsi Vente - Point de Vente',
      excerpt: 'Solution complète de point de vente avec gestion des stocks pour restaurants et bars.',
      description: 'Application de point de vente disponible au niveau du comptoir caisse permettant la validation ou l\'annulation d\'une commande prise par le client depuis le mobile.\n\n## Fonctionnalités\n- Validation/annulation de commandes mobiles\n- Système de paiement intégré\n- Impression automatique des factures\n- Gestion complète des stocks\n- Tableau de bord administrateur & KPIs',
      technologies: JSON.stringify(['React', 'TypeScript', 'Node.js']),
      category: 'WEB' as ProjectCategory,
      published: true,
      featured: true,
    }
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    });
  }

  console.log(`✅ ${projects.length} projets réels enregistrés !`);

  // 4. Articles de Blog réels
  const posts = [
    {
      slug: 'bienvenue-sur-mon-blog',
      title: 'Bienvenue sur mon espace de réflexion',
      excerpt: 'Un article d\'introduction présentant mon parcours et mes domaines d\'expertise.',
      content: '# Bienvenue sur mon blog\n\nEn tant que mathématicien et ingénieur logiciel, je partage ici mes travaux et réflexions sur la monétique, les systèmes bancaires CBS, l\'analyse numérique et le développement web moderne.',
      category: 'INFORMATIQUE' as BlogCategory,
      tags: JSON.stringify(['bienvenue', 'mathématiques', 'informatique', 'cbs']),
      readTime: 4,
      published: true,
      featured: true,
      authorId: adminUser.id,
    },
    {
      slug: 'systemes-cbs-bancaires-modernisation',
      title: 'Modernisation des systèmes CBS bancaires Amplitude & Informix 4GL',
      excerpt: 'Analyse des enjeux de modernisation des Core Banking Systems avec Amplitude v11 à v13.',
      content: '# Modernisation des systèmes CBS bancaires\n\nLes Core Banking Systems (CBS) tels que **Sopra Banking Amplitude** constituent le cœur battant des banques modernes.\n\n## Défis de développement 4GL & Genero BDL\n- Optimisation des transactions bancaires\n- Masques d\'écrans `.per` et scripts `.4gl`\n- Intégration des flux ISO 8583 et monétique',
      category: 'CBS' as BlogCategory,
      tags: JSON.stringify(['CBS', 'Amplitude', 'Informix 4GL', 'Banque', 'Monétique']),
      readTime: 10,
      published: true,
      featured: true,
      authorId: adminUser.id,
    },
    {
      slug: 'analyse-numerique-methodes-iteratives',
      title: 'Méthodes itératives et d\'optimisation en analyse numérique',
      excerpt: 'Exploration des méthodes de résolution d\'équations complexes et d\'optimisation avancée.',
      content: '# Méthodes itératives en analyse numérique\n\nL\'analyse numérique fournit les outils mathématiques essentiels pour résoudre des systèmes d\'équations linéaires et non-linéaires complexes.\n\n## La méthode de Newton-Raphson & Méthodes du Simplex\nCes algorithmes permettent de modéliser et résoudre des problèmes d\'optimisation sous contraintes dans l\'industrie et la finance.',
      category: 'MATHEMATIQUES' as BlogCategory,
      tags: JSON.stringify(['mathématiques', 'analyse numérique', 'optimisation', 'algorithmes']),
      readTime: 8,
      published: true,
      featured: false,
      authorId: adminUser.id,
    }
  ];

  for (const post of posts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log(`✅ ${posts.length} articles de blog créés !`);

  // 5. Statistiques du site & Contact Info
  await prisma.siteStats.upsert({
    where: { id: 'main-stats' },
    update: {
      totalViews: 1450,
      yearsExperience: 5,
      customStat1Label: 'Projets livrés',
      customStat1Value: 18,
      customStat2Label: 'Filiales accompagnées',
      customStat2Value: 6,
    },
    create: {
      id: 'main-stats',
      totalViews: 1450,
      yearsExperience: 5,
      customStat1Label: 'Projets livrés',
      customStat1Value: 18,
      customStat2Label: 'Filiales accompagnées',
      customStat2Value: 6,
    }
  });

  await prisma.contactInfo.upsert({
    where: { id: 'main-contact' },
    update: {
      title: 'Contactez-moi',
      subtitle: 'N\'hésitez pas à me contacter pour toute collaboration, projet bancaire ou échange technique.',
      email: 'mohaourydiallo@gmail.com',
      phone: '+225 00 00 00 00',
      address: 'Abidjan, Côte d\'Ivoire',
      socialLinks: JSON.stringify({
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }),
      availability: 'Disponible pour missions de conseil & projets',
    },
    create: {
      id: 'main-contact',
      title: 'Contactez-moi',
      subtitle: 'N\'hésitez pas à me contacter pour toute collaboration, projet bancaire ou échange technique.',
      email: 'mohaourydiallo@gmail.com',
      phone: '+225 00 00 00 00',
      address: 'Abidjan, Côte d\'Ivoire',
      socialLinks: JSON.stringify({
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }),
      availability: 'Disponible pour missions de conseil & projets',
    }
  });

  console.log('🎉 Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur de seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
