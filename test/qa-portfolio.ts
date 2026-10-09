import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function runPortfolioQa() {
  console.log("=================================================");
  console.log("🚀 QA TEST PORTFOLIO & INTEGRATION MONÉTIQUE");
  console.log("=================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(name: string, condition: boolean, details?: string) {
    if (condition) {
      console.log(`✅ ${name}${details ? ` : ${details}` : ""}`);
      passed++;
    } else {
      console.error(`❌ ${name} ÉCHOUÉ ${details ? ` : ${details}` : ""}`);
      failed++;
    }
  }

  try {
    // TEST 1: Utilisateur Administrateur (Mr. Oury)
    const adminUser = await prisma.user.findUnique({
      where: { email: "mohaourydiallo@gmail.com" },
    });
    assert(
      "TEST 1 - Utilisateur Administrateur Mr. Oury",
      !!adminUser && adminUser.role === "ADMIN" && adminUser.active === true,
      `Email: ${adminUser?.email}, Rôle: ${adminUser?.role}`
    );

    // TEST 2: Bio & Section "À propos"
    const aboutData = await prisma.about.findFirst({
      where: { id: "main-about" },
    });
    const skills = aboutData?.skills ? JSON.parse(aboutData.skills) : [];
    const experiences = aboutData?.experiences ? JSON.parse(aboutData.experiences) : [];
    const education = aboutData?.education ? JSON.parse(aboutData.education) : [];

    assert(
      "TEST 2 - Données À propos & Bio Mr. Oury",
      !!aboutData &&
        aboutData.title.includes("Ingénieur Logiciel") &&
        skills.length >= 5 &&
        experiences.length >= 2 &&
        education.length >= 1,
      `Titre: "${aboutData?.title}", ${skills.length} groupes de compétences, ${experiences.length} expériences, ${education.length} formations`
    );

    // TEST 3: Projets Récents et Bancaires
    const projects = await prisma.project.findMany({
      where: { published: true },
    });
    const hasSgabsProject = projects.some((p) => p.title.includes("SGABS") || p.title.includes("Gest-Coffre-fort"));
    const hasMonetiqueProject = projects.some((p) => p.title.includes("ODS CARD") || p.title.includes("Monétique"));

    assert(
      "TEST 3 - Projets Récents & Bancaires SGABS",
      projects.length >= 5 && hasSgabsProject && hasMonetiqueProject,
      `${projects.length} projets publiés trouvés (Gest-Coffre-fort, Météo TFJ, ODS CARD, PLease, Epsi Vente)`
    );

    // TEST 4: Articles de Blog
    const blogPosts = await prisma.blogPost.findMany({
      where: { published: true },
    });
    const hasCbsArticle = blogPosts.some((b) => b.category === "CBS" || b.slug.includes("cbs"));
    const hasMathArticle = blogPosts.some((b) => b.category === "MATHEMATIQUES" || b.slug.includes("analyse-numerique"));

    assert(
      "TEST 4 - Articles de Blog (CBS, Mathématiques, Informatique)",
      blogPosts.length >= 3 && hasCbsArticle && hasMathArticle,
      `${blogPosts.length} articles de blog rédigés et publiés`
    );

    // TEST 5: Statistiques du Site & Contact Info
    const stats = await prisma.siteStats.findFirst({ where: { id: "main-stats" } });
    const contactInfo = await prisma.contactInfo.findFirst({ where: { id: "main-contact" } });

    assert(
      "TEST 5 - Statistiques du site & Contact Info",
      !!stats && stats.yearsExperience >= 5 && !!contactInfo && (contactInfo.email === "mohaourydiallo@gmail.com" || contactInfo.email === "ourykohkoun@gmail.com"),
      `${stats?.yearsExperience} ans d'expérience, Email de contact: ${contactInfo?.email}`
    );

    // TEST 6: Formulaire de Contact - Création & Lecture Message
    const testMessage = await prisma.message.create({
      data: {
        name: "QA Test User",
        email: "qatest@example.com",
        subject: "Test QA Automated",
        content: "Ceci est un message de test automatique de l'interface de contact.",
      },
    });

    const retrievedMessage = await prisma.message.findUnique({
      where: { id: testMessage.id },
    });

    assert(
      "TEST 6 - Enregistrement et lecture des messages de contact",
      !!retrievedMessage && retrievedMessage.subject === "Test QA Automated",
      `Message ID: ${retrievedMessage?.id}, Sujet: "${retrievedMessage?.subject}"`
    );

    // Nettoyage du message de test
    await prisma.message.delete({ where: { id: testMessage.id } });

    console.log("\n=================================================");
    console.log(`📊 RÉSULTAT QA PORTFOLIO : ${passed} RÉUSSIS / ${failed} ÉCHECS`);
    console.log("=================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ ERREUR QA PORTFOLIO:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runPortfolioQa();
