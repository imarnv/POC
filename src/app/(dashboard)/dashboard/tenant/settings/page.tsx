"use client"

import * as React from "react"
import { Bell, Lock, Smartphone, LogOut, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Modal } from "@/components/ui/modal"
import { logout } from "@/app/actions/auth-actions"

export default function TenantSettingsPage() {
    const [notifications, setNotifications] = React.useState({
        rentReminders: true,
        agreementAlerts: true,
        ownerMessages: true,
        smsAlerts: false,
    })
    const [isPasswordOpen, setIsPasswordOpen] = React.useState(false)
    const [is2FAOpen, setIs2FAOpen] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)
    const [passwordSaved, setPasswordSaved] = React.useState(false)
    const [passwords, setPasswords] = React.useState({ current: "", newPass: "", confirm: "" })
    const [pwError, setPwError] = React.useState("")

    function handlePasswordSave() {
        if (!passwords.current || !passwords.newPass || !passwords.confirm) {
            setPwError("Please fill in all fields.")
            return
        }
        if (passwords.newPass !== passwords.confirm) {
            setPwError("New passwords do not match.")
            return
        }
        if (passwords.newPass.length < 6) {
            setPwError("Password must be at least 6 characters.")
            return
        }
        setPwError("")
        setPasswordSaved(true)
        setTimeout(() => {
            setPasswordSaved(false)
            setIsPasswordOpen(false)
            setPasswords({ current: "", newPass: "", confirm: "" })
        }, 1500)
    }

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
                <p className="text-muted-foreground">Manage your account preferences.</p>
            </div>

            {/* Notifications */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Bell className="w-5 h-5 text-muted-foreground" />
                        <CardTitle className="text-lg">Notifications</CardTitle>
                    </div>
                    <CardDescription>Choose what you want to be notified about.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {[
                        { key: "rentReminders", label: "Rent Due Reminders", description: "Get reminders before your rent is due" },
                        { key: "agreementAlerts", label: "Agreement Alerts", description: "Notifications about agreement expiry and updates" },
                        { key: "ownerMessages", label: "Owner Messages", description: "Receive messages from your landlord" },
                        { key: "smsAlerts", label: "SMS Alerts", description: "Receive alerts via SMS on your phone" },
                    ].map(({ key, label, description }) => (
                        <div key={key} className="flex items-center justify-between">
                            <div>
                                <Label htmlFor={key} className="text-sm font-medium">{label}</Label>
                                <p className="text-xs text-muted-foreground">{description}</p>
                            </div>
                            <Switch
                                id={key}
                                checked={notifications[key as keyof typeof notifications]}
                                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [key]: checked }))}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Security */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-muted-foreground" />
                        <CardTitle className="text-lg">Security</CardTitle>
                    </div>
                    <CardDescription>Manage your account security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start" onClick={() => setIsPasswordOpen(true)}>
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setIs2FAOpen(true)}>
                        <Smartphone className="w-4 h-4 mr-2" />
                        Two-Factor Authentication
                    </Button>
                </CardContent>
            </Card>

            <Separator />

            <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Account</h3>
                <form action={logout}>
                    <Button type="submit" variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </form>
            </div>

            {/* Change Password Modal */}
            <Modal isOpen={isPasswordOpen} onClose={() => { setIsPasswordOpen(false); setPwError("") }} title="Change Password" description="Enter your current password to set a new one.">
                {passwordSaved ? (
                    <div className="flex flex-col items-center gap-3 py-6">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                        <p className="font-semibold text-green-700">Password updated successfully!</p>
                    </div>
                ) : (
                    <div className="space-y-4 mt-2">
                        <div className="space-y-1">
                            <Label>Current Password</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={passwords.current}
                                    onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                                    placeholder="Enter current password"
                                />
                                <button type="button" className="absolute right-3 top-2.5 text-muted-foreground" onClick={() => setShowPassword(s => !s)}>
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label>New Password</Label>
                            <Input
                                type="password"
                                value={passwords.newPass}
                                onChange={e => setPasswords(p => ({ ...p, newPass: e.target.value }))}
                                placeholder="Min. 6 characters"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>Confirm New Password</Label>
                            <Input
                                type="password"
                                value={passwords.confirm}
                                onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                                placeholder="Repeat new password"
                            />
                        </div>
                        {pwError && <p className="text-sm text-destructive">{pwError}</p>}
                        <div className="flex gap-2 pt-1">
                            <Button className="flex-1" onClick={handlePasswordSave}>Save Password</Button>
                            <Button variant="outline" onClick={() => { setIsPasswordOpen(false); setPwError("") }}>Cancel</Button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* 2FA Modal */}
            <Modal isOpen={is2FAOpen} onClose={() => setIs2FAOpen(false)} title="Two-Factor Authentication" description="Secure your account with an extra layer of protection.">
                <div className="space-y-4 mt-2">
                    <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 text-sm text-blue-800">
                        When enabled, you'll receive a one-time code on your registered phone number every time you sign in.
                    </div>
                    <Button className="w-full" onClick={() => setIs2FAOpen(false)}>
                        <Smartphone className="w-4 h-4 mr-2" />
                        Enable via SMS (Coming Soon)
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setIs2FAOpen(false)}>
                        Cancel
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
