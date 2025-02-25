// app/actions/user.ts
"use server";

import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export async function createOrGetUser(userId: string) {
  const UserData = await currentUser();
  if (!UserData) {
    return { success: false, error: "User not authenticated" };
  }
  try {
    // Try to find existing user
    let user = await prisma.user.findUnique({
      where: { id: userId },
    });

    // Create user if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          id: userId,
          email: UserData.emailAddresses[0].emailAddress,
          name: UserData.firstName,
          role: "USER",
        },
      });
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("Error managing user:", error);
    return { success: false, error: "Failed to manage user" };
  }
}
