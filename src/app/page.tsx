"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LoginForm } from "@/components/auth/login-form"

export default function LandingPage() {
  const [showLogin, setShowLogin] = React.useState(false)

  React.useEffect(() => {
    // Show login after animation
    const timer = setTimeout(() => {
      setShowLogin(true)
    }, 2500) // 2.5s delay for intro (shorter is better for dev/ux testing)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background p-4 relative font-sans">
      {/* Background Decorations (Subtle) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-indigo-50/40 to-slate-50/40 blur-[100px] opacity-70" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tr from-blue-50/40 to-slate-100/40 blur-[120px] opacity-70" />
      </div>

      <AnimatePresence mode="wait">
        {!showLogin ? (
          <motion.div
            key="intro"
            className="text-center space-y-2 z-10"
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-4xl md:text-7xl font-bold tracking-tight text-foreground"
            >
              Rental Agreements.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="text-xl md:text-3xl font-light text-muted-foreground"
            >
              Simplified.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 30, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-md z-10"
          >
            <LoginForm />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
