"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@clerk/nextjs";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { createForm } from "@/app/actions/form";
import { redirect } from "next/navigation";

export default function Page() {
  const [isPending, startTransition] = useTransition();
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const { userId } = useAuth();

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsUserLoading(true);

    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("description", formData.description);

      if (!userId) {
        toast.error("User not authenticated");
        setIsUserLoading(false);
        return;
      }

      startTransition(async () => {
        const result = await createForm(formDataObj, userId);
        if (result?.success) {
          toast.success("Form created successfully");
          setFormData({ name: "", description: "" });
          redirect("/dashboard/edit-form/" + result?.data?.id);
        } else {
          toast.error(result?.error || "Failed to create form");
        }
        setIsUserLoading(false);
      });
    } catch (error) {
      toast.error("Failed to process request");
      setIsUserLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-bold">Create Form</h2>
          <p className="text-gray-600">Create a new form from a template</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="name">Form template name:</Label>
              <Input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="name"
                required
                disabled={isPending || isUserLoading}
              />
            </div>
            <div>
              <Label htmlFor="description">Form template description:</Label>
              <Input
                type="text"
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="description"
                disabled={isPending || isUserLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isUserLoading}
            >
              {isPending || isUserLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isUserLoading ? "Setting up..." : "Creating form..."}
                </span>
              ) : (
                "Create Form"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
