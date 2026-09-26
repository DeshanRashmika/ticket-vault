"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";

export async function registerUser(formData: {
  name: string;
  email: string;
  password: string;
  role?: Role; 
}) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: formData.email },
    });

    if (existingUser) {
      return { success: false, error: "Email is already registered" };
    }

    const hashedPassword = await bcrypt.hash(formData.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: formData.name,
        email: formData.email,
        password: hashedPassword,
        role: formData.role || Role.ATTENDEE, 
      },
    });

    return { success: true, userId: newUser.id };
  } catch (error) {
    return { success: false, error: "Failed to create account" };
  }
}