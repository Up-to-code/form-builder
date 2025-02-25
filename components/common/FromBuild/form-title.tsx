"use client"
import { useFormStore } from "@/store/form-store"
import { Input } from "@/components/ui/input"

export function FormTitle() {
  const { formTitle, setFormTitle } = useFormStore()

  return (
    <Input
      type="text"
      value={formTitle}
      onChange={(e) => setFormTitle(e.target.value)}
      className="text-2xl font-bold w-full md:w-2/3 border-none focus:ring-0 px-0"
      placeholder="Enter form title"
    />
  )
}

