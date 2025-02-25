// app/actions/form.ts

"use server"
 
import { prisma } from "@/lib/prisma"
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

export interface SubmissionData {
  id: string
  formId: string
  userId: string
  data: Record<string, string>
  createdAt: Date
  updatedAt: Date
}

/**
 * Get all submissions for a specific form
 */
export async function getFormSubmissions(formId: string) {
  try {
    const session = await auth()
    
    if (!session?.userId) {
      return { success: false, error: "Unauthorized" }
    }
    
    // Get the form to check ownership
    const form = await prisma.form.findUnique({
      where: {
        id: formId,
        userId: session.userId,

      },
    })
    
    if (!form) {
      return { success: false, error: "Form not found" }
    }
    
    // Get all submissions for this form
    const submissions = await prisma.submit.findMany({
      where: {
        formId,
      },
      orderBy: {
        createdAt: "desc",
     
      },
    })
    
    return { 
      success: true, 
      data: submissions 
    }
  } catch (error) {
    console.error("Error getting form submissions:", error)
    return { 
      success: false, 
      error: "Failed to get submissions" 
    }
  }
}

/**
 * Submit form data
 */
export async function submitForm(
  formId: string, 
  ownerId: string, 
  data: Record<string, string>
) {
  try {
    // Create a new submission
    await prisma.submit.create({
      data: {
        formId,
        userId: ownerId,
        data,
      },
    })
    
    // Revalidate the form page to show updated data
    revalidatePath(`/forms/${formId}`)
    
    return { success: true }
  } catch (error) {
    console.error("Error submitting form:", error)
    return { 
      success: false, 
      error: "Failed to submit form" 
    }
  }
}

/**
 * Delete a form submission
 */
export async function deleteSubmission(submissionId: string) {
  try {
    const session = await auth()
    
    if (!session?.userId) {
      return { success: false, error: "Unauthorized" }
    }
    
    // Get the submission to check ownership via the form
    const submission = await prisma.submit.findUnique({
      where: {
        id: submissionId,
      },
      include: {
        form: true,
      },
    })
    
    if (!submission) {
      return { success: false, error: "Submission not found" }
    }
    
    // Check if the user owns the form this submission belongs to
    if (submission.form.userId !== session.userId) {
      return { success: false, error: "Unauthorized" }
    }
    
    // Delete the submission
    await prisma.submit.delete({
      where: {
        id: submissionId,
      },
    })
    
    // Revalidate the form page
    revalidatePath(`/forms/${submission.formId}`)
    
    return { success: true }
  } catch (error) {
    console.error("Error deleting submission:", error)
    return { 
      success: false, 
      error: "Failed to delete submission" 
    }
  }
}