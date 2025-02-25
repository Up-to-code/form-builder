import type React from "react"
import { FormEvent } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"

interface VerifyFormProps extends React.ComponentProps<"div"> {
  handleVerify: (e: FormEvent) => void
  code: string
  setCode: (value: string) => void
}

export default function TwitterLikeVerifyForm({ className, handleVerify, code, setCode, ...props }: VerifyFormProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900", className)} {...props}>
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <div className="flex justify-center mb-8">
            <Icons.twitter className="w-8 h-8 text-blue-400" />
          </div>
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white text-center">
            Verification Code
          </h1>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code" className="text-sm font-medium text-gray-700 dark:text-gray-300">Enter your verification code</Label>
              <Input
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter verification code"
                required
                
              />
            </div>
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-200">
              Complete sign up
            </Button>
          </form>
          <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
            Didn't receive a code? <button className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300">Resend</button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
