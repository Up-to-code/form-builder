"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight} from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <section className="relative min-h-screen py-40 overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* النص الرئيسي */}
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Effortless Form Creation
            <br />
            Starts Here
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Design, customize, and manage forms effortlessly—no coding needed.
            Start building in seconds!
          </motion.p>

          {/* الأزرار */}
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {isLoaded && isSignedIn ? (
              <Link
                href="/dashboard"
                className="bg-black text-white hover:bg-gray-800 transition-colors duration-300"
              >
                <Button className="bg-black text-white hover:bg-gray-800 transition-colors duration-300">
                  Download Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="bg-black text-white hover:bg-gray-800 transition-colors duration-300"
              >
                <Button className="bg-black text-white hover:bg-gray-800 transition-colors duration-300">
                  Get Started for Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>

        {/* الصورة والأنيميشن */}
        <motion.div
          className="relative mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Hero%20image.jpg-mE5vAT4d864MlVhdkcrk1Vn2WcNONq.jpeg"
              alt="Form Builder UI"
              width={1920}
              height={1080}
              className="w-full h-auto"
              priority
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl w-[80%] h-[60%] flex gap-4 shadow-lg">
                <Image
                  src="/home.png"
                  alt="Form Builder UI"
                  width={500}
                  height={500}
                  className="w-full h-full object-contain"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
