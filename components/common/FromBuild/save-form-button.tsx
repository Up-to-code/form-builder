"use client";

import { updateForm } from "@/app/actions/form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useFormStore } from "@/store/form-store";
import { InputType } from "@prisma/client";
import { Save, Loader } from "lucide-react";
import { useState } from "react";
 

export interface InputField {
  id: string;
  type: InputType;
  label: string;
  placeholder: string;
  required: boolean;
  defaultValue?: string;
  options?: string[];
}

export function SaveFormButton({ formId }: { formId: string }) {
  const { formTitle, inputs } = useFormStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    const formData = new FormData();
    formData.append("name", formTitle);
      console.log( {
        formTitle ,
        inputs
      })
    inputs.forEach((input, index) => {
      formData.append(`inputs[${index}][id]`, input.id);
      formData.append(`inputs[${index}][name]`, input.label);
      formData.append(`inputs[${index}][type]`, input.type);
      formData.append(`inputs[${index}][label]`, input.label);
      formData.append(`inputs[${index}][required]`, input.required.toString());

      if (input.placeholder) {
        formData.append(`inputs[${index}][placeholder]`, input.placeholder);
      }

      if (input.options) {
        formData.append(
          `inputs[${index}][options]`,
          JSON.stringify(input.options)
        );
      }
    });

    setIsLoading(true);
    try {
      const response = await updateForm(formData, formId); // استبدل "form-id" بـ ID حقيقي
      console.log("Form update response:", response);
    } catch (error) {
      console.error("Error saving form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md my-6 mx-4 shadow-lg rounded-2xl border border-gray-200">
      <CardHeader className="pb-0">
        <h2 className="text-xl font-semibold text-gray-900">
          Save Your Progress
        </h2>
        <p className="text-sm text-muted-foreground">
          Keep your data safe by saving your form.
        </p>
      </CardHeader>
      <CardContent />
      <CardFooter className="flex justify-start">
        <Button
          onClick={handleClick}
          variant="default"
          size="lg"
          className="px-6 flex items-center gap-2 transition-all duration-300 hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Save className="h-5 w-5" />
          )}
          Save Form
        </Button>
      </CardFooter>
    </Card>
  );
}
