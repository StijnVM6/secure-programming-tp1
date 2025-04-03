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
	const user = await prisma.$queryRawUnsafe(`SELECT * FROM User WHERE username = '${username}' AND password = '${password}'`);

	if (user.length > 0) {
		res.json({ message: "Login successful!", user });
	} else {
		res.status(401).json({ message: "Invalid credentials" });
	}
});

app.listen(3000, () => console.log("Server running on port 3000"));
