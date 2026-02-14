"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Building2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function LoginForm() {
    const router = useRouter()
    const [role, setRole] = React.useState<"tenant" | "owner">("tenant")
    const [isLoading, setIsLoading] = React.useState(false)

    const handleCredentialsLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        const form = e.target as HTMLFormElement
        const formData = new FormData(form)
        formData.append("role", role)

        try {
            // We use a dynamic import or call the server action wrapper
            const { loginWithCredentials } = await import("@/app/actions/auth-actions")
            await loginWithCredentials(formData)
        } catch (error) {
            console.error("Login failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsLoading(true)
        try {
            const { loginWithGoogle } = await import("@/app/actions/auth-actions")
            await loginWithGoogle()
        } catch (error) {
            console.error("Google login failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md border-none shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 text-center pb-8">
                <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
                <CardDescription>
                    Enter your details to access your account
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                {/* Role Toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                    <button
                        type="button"
                        onClick={() => setRole("tenant")}
                        className={cn(
                            "flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all duration-200",
                            role === "tenant"
                                ? "bg-white text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                        )}
                    >
                        <User className="w-4 h-4" />
                        Tenant
                    </button>
                    <button
                        type="button"
                        onClick={() => setRole("owner")}
                        className={cn(
                            "flex items-center justify-center gap-2 rounded-md py-2.5 text-sm font-medium transition-all duration-200",
                            role === "owner"
                                ? "bg-white text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                        )}
                    >
                        <Building2 className="w-4 h-4" />
                        Owner
                    </button>
                </div>

                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                    <div className="space-y-2">
                        <div className="relative">
                            <Input
                                name="email"
                                type="email"
                                placeholder="name@example.com"
                                required
                                className="bg-white/50 h-11"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Input
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            className="bg-white/50 h-11"
                        />
                    </div>
                    <Button className="w-full h-11 text-base font-medium mt-2" type="submit" disabled={isLoading}>
                        {isLoading ? "Signing in..." : `Sign In as ${role === "owner" ? "Owner" : "Tenant"}`}
                    </Button>
                </form>

                <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" type="button" disabled={isLoading} className="h-10" onClick={handleGoogleLogin}>
                        Google
                    </Button>
                    <Button variant="outline" type="button" disabled={isLoading} className="h-10">
                        Apple
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
