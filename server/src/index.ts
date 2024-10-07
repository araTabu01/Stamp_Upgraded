import app from "./app";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PORT = Number(process.env.PORT) || 5020;

async function checkDatabaseConnection() {
  try {
    await prisma.$connect();
    //console.log("Database connected successfully.");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    process.exit(1);
  }
}

async function main() {
  await checkDatabaseConnection();

  app.listen(PORT, () => {
    //console.log(`Server is running on port ${PORT}`);
  });
}

main().catch((error) => {
  console.error("An error occurred while starting the server:", error);
  process.exit(1);
});
