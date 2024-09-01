import prisma from "../../server/db/db";

const main = async () => {
  await clearOwnedCards();
};

const clearOwnedCards = async () => {
  //delete whole owned cards only for user with username = "jozef_kov"
  await prisma.ownedCard.deleteMany({
    where: {
      user: {
        username: "jozef_kov",
      },
    },
  });

  //delete records from Transaction table, where desc is "purchase_pack", for user with username = "jozef_kov"
  await prisma.transaction.deleteMany({
    where: {
      desc: "purchase_pack",
      user: {
        username: "jozef_kov",
      },
    },
  });

  //on User record with username = "jozef_kov" set collectedCards to 0
  await prisma.user.updateMany({
    where: {
      username: "jozef_kov",
    },
    data: {
      collectedCards: 0,
    },
  });

  await prisma.$disconnect();
};

main();
