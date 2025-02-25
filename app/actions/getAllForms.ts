"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
 
export async function getAllForms() {
  try {
    const { userId } = await auth()
    if (!userId) {
      throw new Error("Not authenticated")
    }
    const forms = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        forms: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })
    return forms
  } catch (error) {
    console.error("Error fetching forms:", error)
    throw new Error("Failed to fetch forms")
  }
}