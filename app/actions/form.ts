"use server";

import { prisma } from "@/lib/prisma";
import { createOrGetUser } from "./user";
import { Form, InputType } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";

export async function createForm(formData: FormData, userId: string) {
  try {
    const name = formData.get("name") as string;
    const description = formData.get("description") as string | null;

    if (!name) {
      return { success: false, error: "Name is required" };
    }

    if (!userId) {
      return { success: false, error: "User not authenticated" };
    }
    const user = await createOrGetUser(userId);
    if (!user.success) {
      return { success: false, error: user.error };
    }

    // إنشاء النموذج
    const form = await prisma.form.create({
      data: {
        name,
        description,
        userId,
      },
    });
    return { success: true, data: form };
  } catch (error) {
    console.error("Error creating form:", error);
    return { success: false, error: "Failed to create form" };
  }
}

export const getForm = async (id: string) => {
  try {
    const form = await prisma.form.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        inputs: true,
        userId: true,
      },
    });

    if (!form) {
      return { success: false, error: "Form not found" };
    }

    return { success: true, data: form };
  } catch (error) {
    console.error("Error getting form:", error);
    return { success: false, error: "Failed to get form" };
  }
};

export async function updateForm(formData: FormData, id: string) {
  const userId = (await auth()).userId;
  if (!userId) {
    return { success: false, error: "User not authenticated" };
  }

  try {
    console.log("Updating form with ID:", id);

    const name = formData.get("name") as string;
    if (!name) {
      return { success: false, error: "Name is required" };
    }

    // تحديث أو إنشاء النموذج
    const form = await prisma.form.upsert({
      where: { id },
      update: { name },
      create: { id, name, userId },
    });

    console.log("Form updated/created successfully:", form);

    // استخراج جميع المدخلات من formData
    const inputs: any[] = [];
    for (const [key, value] of formData.entries()) {
      const match = key.match(/^inputs\[(\d+)\]\[(\w+)\]$/);
      if (match) {
        const index = Number(match[1]);
        const field = match[2];

        if (!inputs[index]) {
          inputs[index] = {};
        }
        inputs[index][field] = value;
      }
    }

    console.log("Parsed inputs:", inputs); // تحقق من البيانات بعد معالجتها

    // إدخال البيانات في قاعدة البيانات
    for (const input of inputs) {
      let {
        id: inputId,
        name: inputName,
        type,
        label,
        required,
        placeholder,
        defaultValue,
      } = input;

      if (inputName && type && label) {
        const normalizedType = type.toUpperCase() as keyof typeof InputType;
        if (!Object.keys(InputType).includes(normalizedType)) {
          console.warn(`Skipping input due to invalid type: ${type}`);
          continue;
        }

        const inputData = {
          name: inputName,
          type: normalizedType as InputType,
          label,
          required: required === "true",
          placeholder: placeholder || null,
          defaultValue: defaultValue || null,
          formId: form.id,
        };

        try {
          await prisma.input.upsert({
            where: { id: inputId || "" },
            update: inputData,
            create: inputData,
          });
          console.log(`Input ${inputId ? "updated" : "created"}:`, inputData);
        } catch (error) {
          console.error("Error saving input:", error);
        }
      } else {
        console.warn("Skipping input due to missing required fields.");
      }
    }

    return { success: true, data: form };
  } catch (error) {
    console.error("Error updating form:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update form",
    };
  }
}

export async function submitForm(formId: string, userId: string, formData: any) {
  try {
    if (!userId) {
      throw new Error("User ID is required for form submission")
    }

    const submission = await prisma.submit.create({
      data: {
        formId: formId,
        userId: userId,
        data: formData,
      },
    })

    return { success: true, data: submission }
  } catch (error) {
    console.error("Error submitting form:", error)
    return { success: false, error: "Failed to submit form" }
  }
}






