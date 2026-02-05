"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { LayoutDashboard, FileText, Settings, LogOut, Menu, X, Building2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)
    const pathname = usePathname()
    const isOwner = pathname?.includes("/owner")

    // Navigation Items
    const navItems = isOwner
        ? [
            { name: "Overview", href: "/dashboard/owner", icon: LayoutDashboard },
            { name: "My Properties", href: "/dashboard/owner/properties", icon: Building2 },
            { name: "Agreements", href: "/dashboard/owner/agreements", icon: FileText },
            { name: "Settings", href: "/dashboard/owner/settings", icon: Settings },
        ]
        : [
            { name: "Overview", href: "/dashboard/tenant", icon: LayoutDashboard },
            { name: "My Details", href: "/dashboard/tenant/profile", icon: User },
            { name: "Agreements", href: "/dashboard/tenant/agreements", icon: FileText },
            { name: "Settings", href: "/dashboard/tenant/settings", icon: Settings },
        ]

    return (
        <div className="min-h-screen bg-muted/30 flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r shadow-sm transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="h-16 flex items-center px-6 border-b">
                        <span className="text-xl font-bold tracking-tight">Rental<span className="text-primary/70">App</span></span>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setIsSidebarOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-secondary text-primary"
                                            : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* User Profile / Logout */}
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-3 px-3 py-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                                <User className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="text-xs">
                                <p className="font-medium text-foreground">{isOwner ? "John Owner" : "Jane Tenant"}</p>
                                <p className="text-muted-foreground">{isOwner ? "Landlord" : "Tenant"}</p>
                            </div>
                        </div>
                        <Link href="/">
                            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive">
                                <LogOut className="w-4 h-4 mr-2" />
                                Log out
                            </Button>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Header */}
                <header className="h-16 bg-white border-b px-4 flex items-center justify-between lg:px-8 sticky top-0 z-30">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </Button>

                    <div className="flex items-center gap-4 ml-auto">
                        {isOwner && (
                            <Link href="/dashboard/owner/agreements/new">
                                <Button size="sm" className="hidden sm:flex">
                                    + New Agreement
                                </Button>
                            </Link>
                        )}
                        {!isOwner && (
                            <Button size="sm" variant="outline" className="hidden sm:flex">
                                Contact Owner
                            </Button>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    )
}
