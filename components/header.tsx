"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();
  const pathname = usePathname();
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navItems = [
    { name: "github", href: "https://github.com/ahmed-el-haddad/form-builder" },
    { name: "dev", href: "https://my-website-7.vercel.app/ " },

  ];

  return (
   <>
    <div className="h-[70px]"></div>
   <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo-kn1C5CDk5zUaYa4BHkG1FKUQupEsrm.png"
              alt="Form Builder"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </motion.div>
          <span className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
            Form Builder
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {isLoaded && isSignedIn ? (
            <Link
              href={
                pathname === "/dashboard"
                  ? "/dashboard/create-from"
                  : "/dashboard"
              }
              onClick={toggleMenu}
            >
              <Button
                variant="outline"
                className="text-gray-900 border-gray-300 hover:bg-gray-100"
              >
                {pathname === "/dashboard" ? (
                  "Create from"
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </>
                )}
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="text-gray-900 hover:bg-gray-100"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button
                  variant="default"
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden text-gray-900"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200"
          >
            <nav className="flex flex-col items-center py-4 gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={toggleMenu}
                >
                  {item.name}
                </Link>
              ))}
              {isLoaded && isSignedIn ? (
                <Link
                  href={
                    pathname === "/dashboard"
                      ? "/dashboard/create-from"
                      : "/dashboard"
                  }
                  onClick={toggleMenu}
                >
                  <Button
                    variant="outline"
                    className={`${
                      pathname === "/dashboard"
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "text-gray-900 hover:bg-gray-100"
                    } border-gray-300 w-full`}
                  >
                    {pathname === "/dashboard" ? (
                      "Create from"
                    ) : (
                      <>
                        <User className="w-4 h-4 mr-2" />
                        Dashboard
                      </>
                    )}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/sign-in" onClick={toggleMenu}>
                    <Button
                      variant="ghost"
                      className="text-gray-900 hover:bg-gray-100 w-full"
                    >
                      Sign in
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={toggleMenu}>
                    <Button
                      variant="default"
                      className="bg-gray-900 text-white hover:bg-gray-800 w-full"
                    >
                      Sign up
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
   </>
  );
}
