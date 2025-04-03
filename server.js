import express from "express";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.get("/", (req, res) => {
	res.send("SQL Injection Demo");
});

// Vulnerable to SQL Injection
app.post("/login", async (req, res) => {
	const { username, password } = req.body;

	// Direct injection of user input into raw SQL query:
	// const user = await prisma.$queryRawUnsafe(`SELECT * FROM User WHERE username = '${username}' AND password = '${password}'`);

	try {
		// Solution 1: Raw SQL with parameterization
		const user = await prisma.$queryRaw`
			SELECT * FROM User WHERE username = ${username} AND password = ${password}
		`;

		// Solution 2: Prisma ORM
		// const user2 = await prisma.user.findUnique({
		// 	where: { username },
		// });
		// if (user2 && user2.password === password) {
		// 	res.json({ message: "Login successful", user2 });
		// } else {
		// 	res.status(401).json({ message: "Invalid credentials" });
		// }

		if (user.length > 0) {
			res.json({ message: "Login successful!", user });
		} else {
			res.status(401).json({ message: "Invalid credentials" });
		}
	} catch (error) {
		res.status(500).json({ message: "Internal server error", error });
	}
});

app.listen(3000, () => console.log("Server running on port 3000"));
