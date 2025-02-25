"use client"

import type React from "react"
import { getForm, submitForm } from "@/app/actions/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { InfoIcon, SendIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FormSkeleton } from "@/components/common/form-skeleton"

interface PageProps {
  params: {
    id: string
  }
}

interface FormInput {
  id: string
  name: string
  type: string
  label: string
  required: boolean
  placeholder: string | undefined
  description?: string
  value: string
  defaultValue?: string | null
  createdAt?: Date
  updatedAt?: Date
  formId?: string
}

interface FormData {
  id: string
  name: string
  description?: string
  userId: string
  inputs: FormInput[]
}

function FormComponent({ id }: { id: string }) {
  const [formData, setFormData] = useState<FormData | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, success } = await getForm(id)
        if (success && data) {
          setFormData({
            id: data.id,
            name: data.name,
            userId: data.userId,
            inputs: data.inputs.map(input => ({
              ...input,
              value: input.defaultValue || "",
              placeholder: input.placeholder || undefined,
            })),
          })
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching form:", error)
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  useEffect(() => {
    if (formData) {
      const totalInputs = formData.inputs.length
      if (totalInputs === 0) return
      
      const filledInputs = formData.inputs.filter((input) => input.value).length
      setProgress((filledInputs / totalInputs) * 100)
    }
  }, [formData])

  const handleInputChange = (inputId: string, value: string) => {
    setFormData((prevData) => {
      if (!prevData) return null

      const updatedInputs = prevData.inputs.map((input) =>
        input.id === inputId ? { ...input, value } : input
      )

      return { ...prevData, inputs: updatedInputs }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Check required fields
    if (formData) {
      const missingFields = formData.inputs.filter(
        input => input.required && !input.value
      )
      
      if (missingFields.length > 0) {
        toast({
          title: "Missing Required Fields",
          description: "Please fill out all required fields before submitting.",
          variant: "destructive",
        })
        return
      }
    }
    
    setShowConfirmation(true)
  }

  const confirmSubmit = async () => {
    setSubmitting(true)
    if (!formData) return

    try {
      const submissionData = formData.inputs.reduce((acc: Record<string, string>, input: FormInput) => {
        acc[input.name] = input.value
        return acc
      }, {})

      const { success, error } = await submitForm(id, formData.userId, submissionData)

      if (success) {
        toast({
          title: "Form Submitted",
          description: "Your form has been successfully submitted.",
        })
        // Reset form data
        setFormData((prevData) => {
          if (!prevData) return null
          const resetInputs = prevData.inputs.map((input) => ({ ...input, value: "" }))
          return { ...prevData, inputs: resetInputs }
        })
        setProgress(0)
      } else {
        toast({
          title: "Submission Failed",
          description: error || "An error occurred while submitting the form.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "An unexpected error occurred while submitting the form.",
        variant: "destructive",
      })
    } finally {
      setShowConfirmation(false)
      setSubmitting(false)
    }
  }

  if (loading) {
    return <FormSkeleton />
  }

  if (!formData) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Form Not Found</CardTitle>
          <CardDescription>The requested form could not be found.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <TooltipProvider>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{formData.name}</CardTitle>
          {formData.description && <CardDescription>{formData.description}</CardDescription>}
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full mb-6" />
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence>
              {formData.inputs.map((input: FormInput) => (
                <motion.div
                  key={input.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-2 mb-4"
                >
                  <div className="flex items-center">
                    <Label htmlFor={input.id} className="flex-grow">
                      {input.label}
                      {input.required && <span className="text-red-500 ml-1">*</span>}
                    </Label>
                    {input.description && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InfoIcon className="w-4 h-4 text-muted-foreground ml-2" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{input.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                  <div className="relative">
                    {input.type === "TEXTAREA" ? (
                      <Textarea
                        id={input.id}
                        name={input.name}
                        placeholder={input.placeholder || undefined}
                        required={input.required}
                        value={input.value}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                      />
                    ) : (
                      <Input
                        id={input.id}
                        name={input.name}
                        type={input.type.toLowerCase()}
                        placeholder={input.placeholder || undefined}
                        required={input.required}
                        value={input.value}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <CardFooter className="px-0 pt-4">
              <Button type="submit" className="w-full" disabled={submitting}>
                <SendIcon className="w-4 h-4 mr-2" />
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Submission</DialogTitle>
            <DialogDescription>
              Are you sure you want to submit this form? You won't be able to edit it after submission.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmation(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={confirmSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Confirm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}

export default function Page({ params }: PageProps) {
  return (
    <div className="container mx-auto py-10">
      <FormComponent id={params.id} />
    </div>
  )
}