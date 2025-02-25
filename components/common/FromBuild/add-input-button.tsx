"use client"
import type React from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useFormStore, type InputType } from "@/store/form-store"

const inputTypes: { value: InputType; label: string; icon: React.ReactNode }[] = [
  { value: "text", label: "Text", icon: "T" },
  { value: "number", label: "Number", icon: "#" },
  { value: "email", label: "Email", icon: "@" },
  { value: "password", label: "Password", icon: "***" },
  { value: "date", label: "Date", icon: "📅" },
  { value: "checkbox", label: "Checkbox", icon: "☑" },
  { value: "radio", label: "Radio", icon: "○" },
  { value: "textarea", label: "Textarea", icon: "¶" },
  { value: "select", label: "Select", icon: "▼" },
]

export function AddInputButton() {
  const { addInput } = useFormStore()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="px-6">
          <Plus className="mr-2 h-4 w-4" /> Add Field
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {inputTypes.map((type) => (
          <DropdownMenuItem key={type.value} onSelect={() => addInput(type.value)}>
            <span className="mr-2 text-lg">{type.icon}</span>
            {type.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

