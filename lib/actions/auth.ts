"use server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";
import getSession from "../auth";

export const createUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("A user with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        username,
        email,
        hashedPassword,
      },
    });

    if (user) {
      console.log(user);
      return user;
    }
  } catch (error) {
    console.error(error);
  }
};

export const getUser = async (email?: string) => {
  try {
    console.log(email);
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    console.log("Fetched user:", user);
    return user;
  } catch (error) {
    console.error(error);
  }
};
