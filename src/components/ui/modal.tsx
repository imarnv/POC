"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
    title?: string
    description?: string
    className?: string
}

export function Modal({
    isOpen,
    onClose,
    children,
    title,
    description,
    className,
}: ModalProps) {
    // Prevent scrolling when modal is open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = "unset"
        }
    }, [isOpen])

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className={cn(
                            "relative z-10 w-full max-w-lg overflow-hidden rounded-xl border bg-background p-6 shadow-lg",
                            className
                        )}
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="space-y-1">
                                {title && (
                                    <h2 className="text-lg font-semibold leading-none tracking-tight">
                                        {title}
                                    </h2>
                                )}
                                {description && (
                                    <p className="text-sm text-muted-foreground">{description}</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="rounded-full p-1 opacity-70 hover:opacity-100 hover:bg-secondary transition-colors"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </button>
                        </div>

                        <div>{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}
