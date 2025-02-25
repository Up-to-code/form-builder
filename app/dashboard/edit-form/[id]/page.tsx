"use client";

import { FormBuilder } from "@/components/common/FromBuild/form-builder";
import Form_Settings from "@/components/common/FromBuild/Form_Settings";
import { SaveFormButton } from "@/components/common/FromBuild/save-form-button";
import UrlCart from "@/components/common/UrlCart";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormStore, InputType } from "@/store/form-store";
import { getForm } from "@/app/actions/form";
import Link from "next/link";
 import FormSkeleton from "@/components/common/loadingPage";

type FormResponse = {
  success: boolean;
  data?: {
    name: string;
    inputs: Array<{
      id: string;
      type: string;
      label: string;
      placeholder: string | null;
      required: boolean;
      options?: string[];
      defaultValue?: string | null;
      name?: string;
      formId?: string;
      createdAt?: Date;
      updatedAt?: Date;
    }>;
  };
  error?: string;
};

type FormBuilderPageProps = {
  params: {
    id: string;
  };
};

const FormBuilderPage = ({ params }: FormBuilderPageProps) => {
  const { setFormTitle, setInputs } = useFormStore();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response: FormResponse = await getForm(params.id);
        if (response.success && response.data) {
          setFormTitle(response.data.name || "Untitled Form");

          const formattedInputs = response.data.inputs.map((input) => ({
            id: input.id,
            type: input.type.toLowerCase() as InputType,
            label: input.label,
            placeholder: input.placeholder || "",
            required: input.required,
            options: input.options || undefined,
          }));

          setInputs(formattedInputs);
        } else {
          console.error("Failed to fetch form:", response.error);
        }
      } catch (error) {
        console.error("Error fetching form:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchForm();
  }, [params.id, setFormTitle, setInputs]);

  if (loading) {
    return <FormSkeleton />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Edit Form</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <FormBuilder />

        <div className="space-y-6">
          <Form_Settings />
          <UrlCart id={params.id} />
          <SaveFormButton formId={params.id} />
        </div>
      </div>
    </div>
  );
};

export default FormBuilderPage;
