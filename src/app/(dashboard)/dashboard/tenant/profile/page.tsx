"use client"

import * as React from "react"
import { User, Phone, Mail, MapPin, ShieldCheck, ShieldAlert, Edit2, Save, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Modal } from "@/components/ui/modal"

const defaultProfile = {
    name: "Jane Tenant",
    email: "jane.tenant@email.com",
    phone: "+91 98765 43210",
    address: "Flat 402, B Block, Greenfield Apartments, Electronic City Phase 1, Bengaluru – 560100",
}

export default function TenantProfilePage() {
    const [profile, setProfile] = React.useState(defaultProfile)
    const [draft, setDraft] = React.useState(defaultProfile)
    const [isEditOpen, setIsEditOpen] = React.useState(false)
    const [isUploading, setIsUploading] = React.useState(false)
    const [panFileName, setPanFileName] = React.useState<string | null>(null)
    const fileInputRef = React.useRef<HTMLInputElement>(null)

    function openEdit() {
        setDraft(profile)
        setIsEditOpen(true)
    }

    function saveEdit() {
        setProfile(draft)
        setIsEditOpen(false)
    }

    function handlePanUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploading(true)
        setTimeout(() => {
            setPanFileName(file.name)
            setIsUploading(false)
        }, 1200)
    }

    return (
        <div className="space-y-8 max-w-3xl">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">My Details</h2>
                <p className="text-muted-foreground">View and manage your personal information.</p>
            </div>

            {/* Profile Card */}
            <Card className="border-none shadow-lg">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">Personal Information</CardTitle>
                        <Button variant="outline" size="sm" onClick={openEdit}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center text-2xl font-bold text-primary">
                            {profile.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                            <p className="text-xl font-semibold">{profile.name}</p>
                            <p className="text-sm text-muted-foreground">Tenant since Jan 2026</p>
                        </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-xs text-muted-foreground">Email</p>
                                <p className="text-sm font-medium">{profile.email}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-xs text-muted-foreground">Phone</p>
                                <p className="text-sm font-medium">{profile.phone}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 sm:col-span-2">
                            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-xs text-muted-foreground">Current Address</p>
                                <p className="text-sm font-medium">{profile.address}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* KYC Status Card */}
            <Card className="border-none shadow-md">
                <CardHeader>
                    <CardTitle className="text-xl">KYC Verification</CardTitle>
                    <CardDescription>Your identity verification status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg bg-green-50 border border-green-100">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 text-green-600" />
                            <div>
                                <p className="font-medium text-green-900">Aadhaar Verified</p>
                                <p className="text-xs text-green-700">XXXX XXXX 3456 · Verified on 15 Jan 2026</p>
                            </div>
                        </div>
                        <Badge className="bg-green-600">Verified</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-orange-50 border border-orange-100">
                        <div className="flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-orange-600" />
                            <div>
                                <p className="font-medium text-orange-900">PAN Card</p>
                                <p className="text-xs text-orange-700">
                                    {panFileName ? `Uploaded: ${panFileName}` : "Not submitted yet"}
                                </p>
                            </div>
                        </div>
                        {panFileName ? (
                            <Badge className="bg-green-600">Uploaded</Badge>
                        ) : (
                            <Button
                                size="sm"
                                variant="outline"
                                className="border-orange-300 text-orange-700 hover:bg-orange-50"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                {isUploading ? "Uploading…" : "Upload"}
                            </Button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,image/*"
                            className="hidden"
                            onChange={handlePanUpload}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Edit Profile Modal */}
            <Modal
                isOpen={isEditOpen}
                onClose={() => setIsEditOpen(false)}
                title="Edit Profile"
                description="Update your personal information below."
            >
                <div className="space-y-4 mt-2">
                    <div className="space-y-1">
                        <Label htmlFor="edit-name">Full Name</Label>
                        <Input
                            id="edit-name"
                            value={draft.name}
                            onChange={e => setDraft(d => ({ ...d, name: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="edit-email">Email</Label>
                        <Input
                            id="edit-email"
                            type="email"
                            value={draft.email}
                            onChange={e => setDraft(d => ({ ...d, email: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="edit-phone">Phone</Label>
                        <Input
                            id="edit-phone"
                            value={draft.phone}
                            onChange={e => setDraft(d => ({ ...d, phone: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="edit-address">Address</Label>
                        <Input
                            id="edit-address"
                            value={draft.address}
                            onChange={e => setDraft(d => ({ ...d, address: e.target.value }))}
                        />
                    </div>
                    <div className="flex gap-2 pt-2">
                        <Button className="flex-1" onClick={saveEdit}>
                            <Save className="w-4 h-4 mr-2" /> Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                            <X className="w-4 h-4 mr-1" /> Cancel
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
