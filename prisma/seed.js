import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const main = async () => {
	await prisma.user.createMany({
		data: [
			{ username: "admin", password: "securepassword123" },
			{ username: "user1", password: "mypassword" },
		],
	});
	console.log("Database seeded!");
};

main()
	.catch((e) => console.error(e))
	.finally(async () => await prisma.$disconnect());
