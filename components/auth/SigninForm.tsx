import type React from "react"
import Link from "next/link"
import type { FormEvent } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/ui/icons"

interface SignUpFormProps extends React.ComponentProps<"div"> {
  signUpWithEmail: ({
    emailAddress,
    password,
  }: {
    emailAddress: string
    password: string
  }) => void
  clerkError: string
}

export default function TwitterLikeSignUpForm({ 
  className, 
  signUpWithEmail, 
  clerkError, 
  ...props 
}: SignUpFormProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const target = e.target as typeof e.target & {
      email: { value: string }
      password: { value: string }
    }
    const email = target.email.value
    const password = target.password.value
    signUpWithEmail({ emailAddress: email, password: password })
  }

  return (
    <div 
      className={cn(
        "flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900",
        className
      )} 
      {...props}
    >
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-2xl">
        <CardContent className="p-8">
          <div className="flex justify-center mb-8">
            <Icons.twitter className="w-8 h-8 text-blue-400" />
          </div>
          
          <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white text-center">
            Create your account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label 
                htmlFor="email" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter your email"
                type="email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label 
                htmlFor="password" 
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                className="text-black w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter your password"
                type="password"
                required
              />
            </div>

            {clerkError && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">
                  {clerkError}
                </p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-200"
            >
              Sign up
            </Button>
          </form>



          <p className="mt-6 text-sm text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link 
              className="font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300" 
              href="/sign-in"
            >
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}