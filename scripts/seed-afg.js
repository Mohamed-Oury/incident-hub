const path = require("path");
const { PrismaClient } = require(path.join(__dirname, "../node_modules/@prisma/client"));
const prisma = new PrismaClient();

async function run() {
  console.log("Tentative insertion Prisma MySQL...");
  try {
    let author = await prisma.user.findFirst();
    if (!author) {
      author = await prisma.user.create({
        data: {
          id: "usr-achraf-paylogic",
          email: "achraf.paylogic@afgbank.com",
          name: "Achraf (Référent PayLogic)",
          role: "EXPERT",
        },
      });
    }

    const ref = "INC-AFG-001";
    const existing = await prisma.incident.findUnique({ where: { reference: ref } });
    if (existing) {
      console.log("INC-AFG-001 déjà en base Prisma.");
      return;
    }

    const created = await prisma.incident.create({
      data: {
        reference: ref,
        title: "IHM Payway - Indisponibilité interface web après changement de mot de passe (Divergence Key/Salt sur ama-gabon-core)",
        description: "L'IHM Payway est devenue totalement indisponible (ne s'affichait pas) immédiatement après le renouvellement des mots de passe sur l'ensemble des serveurs applicatifs Payway. La cause racine provient d'un mot de passe incorrect sur ama-gabon-core (Wallet Manager) dont les propriétés cryptographiques key et salt n'étaient pas identiques aux autres services.",
        status: "RESOLVED",
        severity: "CRITICAL",
        knowledgeStatus: "VALIDATED",
        domain: "Frontal Web & Applications",
        channel: "IHM Payway / Web & Mobile (PayGate)",
        operation: "Accès & Administration Monétique",
        network: "Réseau Interne AFG Gabon / PayLogic",
        environment: "PRODUCTION",
        component: "ama-gabon-core (Wallet Manager)",
        host: "SRV-PAYWAY-GABON-01",
        errorCode: "HTTP 500 / Decryption Mismatch",
        occurredAt: new Date("2026-11-06T10:00:00.000Z"),
        resolvedAt: new Date("2026-11-06T14:30:00.000Z"),
        authorId: author.id,
      },
    });

    console.log("✅ Incident créé avec succès dans Prisma:", created.reference);
  } catch (e) {
    console.log("Prisma warning (fallback en mémoire actif):", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

run();

