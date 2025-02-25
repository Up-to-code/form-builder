"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, GripVertical } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { InputField, useFormStore } from "@/store/form-store"

interface InputFieldEditorProps {
  input: InputField
  index: number
}

export function InputFieldEditor({ input, index }: InputFieldEditorProps) {
  const { updateInput, deleteInput } = useFormStore()

  const handleChange = (field: keyof InputField, value: string | boolean | string[]) => {
    updateInput(input.id, { [field]: value })
  }

  return (
    <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <GripVertical className="cursor-move mr-2 text-gray-400" />
            <span className="font-medium capitalize text-lg">{input.type} Input</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteInput(input.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-100"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor={`label-${input.id}`} className="text-sm font-medium text-gray-700">
              Label
            </Label>
            <Input
              id={`label-${input.id}`}
              value={input.label}
              onChange={(e) => handleChange("label", e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor={`placeholder-${input.id}`} className="text-sm font-medium text-gray-700">
              Placeholder
            </Label>
            <Input
              id={`placeholder-${input.id}`}
              value={input.placeholder}
              onChange={(e) => handleChange("placeholder", e.target.value)}
              className="mt-1"
            />
          </div>
          {(input.type === "select" || input.type === "radio") && (
            <div>
              <Label htmlFor={`options-${input.id}`} className="text-sm font-medium text-gray-700">
                Options (comma-separated)
              </Label>
              <Input
                id={`options-${input.id}`}
                value={input.options?.join(", ")}
                onChange={(e) =>
                  handleChange(
                    "options",
                    e.target.value.split(",").map((s) => s.trim())
                  )
                }
                className="mt-1"
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`required-${input.id}`}
              checked={input.required}
              onCheckedChange={(checked) => handleChange("required", checked === true)}
            />
            <Label htmlFor={`required-${input.id}`} className="text-sm font-medium text-gray-700">
              Required
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
