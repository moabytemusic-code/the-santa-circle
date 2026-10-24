const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Pre-computed bcrypt hash (12 salt rounds) for default password "ChristmasAdmin2026!"
const DEFAULT_HASH = "$2a$12$fUQbhW4eVHY2TdoKE/oRgey2wMQmI2l/HpeQ00v6Fhjm.6TeMJtze";

async function getAdminPasswordHash(password) {
  try {
    const bcrypt = require("bcryptjs");
    return await bcrypt.hash(password, 12);
  } catch {
    if (password === "ChristmasAdmin2026!") {
      return DEFAULT_HASH;
    }
    // If bcrypt is not in runtime path, attempt requiring from potential paths
    try {
      const bcryptAlt = require("../node_modules/bcryptjs");
      return await bcryptAlt.hash(password, 12);
    } catch {
      return DEFAULT_HASH;
    }
  }
}

async function main() {
  console.log("🌱 Seeding database...");

  const adminEmail = (process.env.ADMIN_DEFAULT_EMAIL || "admin@family.com").toLowerCase();
  const adminPassword = process.env.ADMIN_DEFAULT_PASSWORD || "ChristmasAdmin2026!";
  const adminName = process.env.ADMIN_DEFAULT_NAME || "Family Organizer";

  const passwordHash = await getAdminPasswordHash(adminPassword);

  // Upsert Admin User
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log(`✅ Admin user ready: ${admin.email}`);

  // Create Default Family Group
  const groupCount = await prisma.familyGroup.count();
  let defaultGroup;
  if (groupCount === 0) {
    defaultGroup = await prisma.familyGroup.create({
      data: {
        name: "Our Family Christmas",
        description: "Annual Secret Santa gift exchange for the entire family",
        createdById: admin.id,
        memberships: {
          create: {
            userId: admin.id,
            role: "ADMIN",
          },
        },
      },
    });
    console.log(`✅ Created default family group: "${defaultGroup.name}"`);
  } else {
    defaultGroup = await prisma.familyGroup.findFirst();
  }

  // Create current Christmas Exchange if none exists
  if (defaultGroup) {
    const currentYear = new Date().getFullYear();
    const existingExchange = await prisma.giftExchange.findUnique({
      where: {
        familyGroupId_year: {
          familyGroupId: defaultGroup.id,
          year: currentYear,
        },
      },
    });

    if (!existingExchange) {
      await prisma.giftExchange.create({
        data: {
          familyGroupId: defaultGroup.id,
          name: `Family Christmas ${currentYear}`,
          year: currentYear,
          budget: 35.0,
          currency: "USD",
          exchangeDate: new Date(`${currentYear}-12-25T12:00:00Z`),
          instructions: "Wrap your gift festively and label it with your recipient's name!",
          status: "CONFIRMING",
          createdById: admin.id,
          participants: {
            create: {
              userId: admin.id,
              status: "CONFIRMED",
              confirmedAt: new Date(),
            },
          },
        },
      });
      console.log(`✅ Created Christmas ${currentYear} gift exchange`);
    }
  }

  console.log("🌟 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
