"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useSignUp } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from "lucide-react";

interface SignUpCredentials {
  emailAddress: string;
  password: string;
  firstName: string;
  lastName: string;
}

const SignUp = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const [verifying, setVerifying] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Form validation states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  });
  
  const [validationErrors, setValidationErrors] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
    };

    if (formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    if (formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    if (!formData.emailAddress.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.emailAddress = "Please enter a valid email address";
    }

    // Password validation
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasLowerCase = /[a-z]/.test(formData.password);
    const hasNumbers = /\d/.test(formData.password);
    
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      newErrors.password = "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }

    setValidationErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    setValidationErrors(prev => ({
      ...prev,
      [name]: ""
    }));
  };

  const signUpWithEmail = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded || loading) return;

    const isValid = validateForm();
    if (!isValid) return;

    setLoading(true);
    setError("");

    try {
      await signUp.create({
        ...formData
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setSuccess("Verification code sent to your email!");
      setVerifying(true);
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "An error occurred during sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    if (!isLoaded || loading) return;

    setLoading(true);
    setError("");

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === "complete") {
        await setActive({ session: completeSignUp.createdSessionId });
        setSuccess("Successfully verified! Redirecting...");
        setTimeout(() => router.push("/"), 1500);
      } else {
        setError("Verification failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Error verifying email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-100px)]">
      <Card className="w-full max-w-md mx-auto mt-8 bg-white shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-gray-900">
            {verifying ? "Verify Email" : "Create an Account"}
          </CardTitle>
          <CardDescription className="text-gray-500">
            {verifying 
              ? "Enter the verification code sent to your email" 
              : "Fill in your details to create your account"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!verifying ? (
            <form onSubmit={signUpWithEmail} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={`border ${validationErrors.firstName ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {validationErrors.firstName && (
                    <p className="text-sm text-red-500">{validationErrors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={`border ${validationErrors.lastName ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  {validationErrors.lastName && (
                    <p className="text-sm text-red-500">{validationErrors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Input
                  name="emailAddress"
                  type="email"
                  placeholder="Email"
                  value={formData.emailAddress}
                  onChange={handleInputChange}
                  className={`border ${validationErrors.emailAddress ? 'border-red-500' : 'border-gray-200'}`}
                />
                {validationErrors.emailAddress && (
                  <p className="text-sm text-red-500">{validationErrors.emailAddress}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`border ${validationErrors.password ? 'border-red-500' : 'border-gray-200'}`}
                  />
                                     {/* CAPTCHA Widget */}
        <div id="clerk-captcha"></div>

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="text-sm text-red-500">{validationErrors.password}</p>
                )}
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long and contain:
                  <ul className="list-disc ml-4 mt-1">
                    <li>One uppercase letter</li>
                    <li>One lowercase letter</li>
                    <li>One number</li>
                  </ul>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Enter verification code"
                  className="border border-gray-200"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mt-4 bg-green-50 text-green-700 border-green-200">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUp;