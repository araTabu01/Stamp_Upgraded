import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { easyproID, password } = req.body;

  console.log("The received easyproID is ", easyproID);

  try {
    // Find user by easyproID
    const user = await prisma.login.findFirst({
      where: { easyproID: Number(easyproID) },
    });

    if (!user) {
      console.log("No user found with the given easyproID");
      return res.json({ error: "IDまたはパスワードが間違っています！" });
    }

    if (user.password === null) {
      console.log("Password is null for the user");
      return res.json({ error: "IDまたはパスワードが間違っています！" });
    }

    console.log("Stored hash:", user.password);

    // Compare provided password with stored hash
    if (!user || password !== user.password) {
      return res.json({ error: "IDまたはパスワードが間違っています！" });
    }

    // Password matches, user authenticated successfully
    console.log("User authenticated successfully");
    res.json({ user });
  } catch (error) {
    console.error("Error during login process: ", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
