"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";

export function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();

  return (
    <section className="relative min-h-screen py-40 overflow-hidden bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h1
            className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Protect Your Privacy,
            <br />
            Share What Matters
          </motion.h1>
          <motion.p
            className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Easily crop out sensitive information on your screen during work
            calls. Keep your focus on what you want to share while maintaining
            full control over your privacy.
          </motion.p>
          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {/* <Button
              variant="outline"
              className="gap-2 border-gray-200 hover:border-gray-400 transition-colors duration-300"
            >
              <Play className="w-4 h-4" />
              Watch Demo
            </Button> */}
            {isLoaded && isSignedIn ? (
              <Button className="bg-black text-white hover:bg-gray-800 transition-colors duration-300">
                Download Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button className="bg-black text-white hover:bg-gray-800 transition-colors duration-300">
                Sign in
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </motion.div>
        </div>

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
              alt="Background Gradient"
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
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Browser-HZNDOssbyLixIa4lABR27yelWXveQ0.png"
                  alt="Browser Preview"
                  width={800}
                  height={600}
                  className="w-1/2 h-full object-cover rounded-lg"
                  priority
                />
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Editor%20Window-sJ4sXlXpgDhv7gLvQylqH5VTb3L0rc.png"
                  alt="Code Editor"
                  width={800}
                  height={600}
                  className="w-1/2 h-full object-cover rounded-lg"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
