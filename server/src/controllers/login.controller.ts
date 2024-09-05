import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const login = async (req: Request, res: Response) => {
  const { easyproID, password } = req.body;

  // Find user by easyproID
  const user = await prisma.login.findFirst({
    where: { easyproID: Number(easyproID) },
  });

  if (!user) {
    return res.json({ error: "IDまたはパスワードが間違っています！" });
  }

  if (user.password === null) {
    return res.json({ error: "IDまたはパスワードが間違っています！" });
  }

  // Compare provided password with stored hash
  if (!user || password !== user.password) {
    return res.json({ error: "IDまたはパスワードが間違っています！" });
  }

  // Password matches, user authenticated successfully
  res.json({ user });
};
