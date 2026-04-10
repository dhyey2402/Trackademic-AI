"use client"

import { useAuth } from "@/hooks/AuthContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Mail, Shield, Calendar, Clock, Lock } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const { user } = useAuth()

  // For a hackathon, we can use some mock data for fields the DB doesn't have yet
  const profileDetails = [
    { label: "Email Address", value: user?.email || "admin@TrackAdemic AI.ai", icon: Mail },
    { label: "Account Role", value: "System Administrator", icon: Shield, badge: "Master Access" },
    { label: "Member Since", value: "April 2026", icon: Calendar },
    { label: "Last Active", value: new Date().toLocaleDateString(), icon: Clock },
  ]

  return (
    <div className="min-h-screen bg-slate-950 p-6 lg:p-12">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Navigation */}
        <Link href="/">
          <Button variant="ghost" className="mb-4 text-slate-400 hover:text-white">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Avatar & Summary */}
          <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl lg:col-span-1">
            <CardContent className="pt-8 text-center sm:pt-12">
              <Avatar className="mx-auto size-32 ring-4 ring-blue-500/20">
                <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-500 text-3xl text-white">
                  AD
                </AvatarFallback>
              </Avatar>
              <h2 className="mt-6 text-2xl font-bold text-white">Administrator</h2>
              <p className="text-sm text-slate-400">TrackAdemic AI Control Center</p>
              <div className="mt-6 flex justify-center">
                <Badge variant="outline" className="border-emerald-500/50 bg-emerald-500/10 text-emerald-400">
                  <div className="mr-1.5 h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live System Access
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Right Column: Details */}
          <Card className="border-white/10 bg-slate-900/50 backdrop-blur-xl lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-white">Profile Details</CardTitle>
              <CardDescription className="text-slate-400">
                Manage your administrative information and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {profileDetails.map((detail) => (
                  <div key={detail.label} className="space-y-1.5">
                    <div className="flex items-center text-xs font-medium uppercase tracking-wider text-slate-500">
                      <detail.icon className="mr-2 h-3.5 w-3.5" />
                      {detail.label}
                    </div>
                    <div className="flex items-center gap-2 text-slate-200">
                      {detail.value}
                      {detail.badge && (
                        <Badge variant="secondary" className="h-5 bg-blue-500/10 text-[10px] text-blue-400">
                          {detail.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-white/5" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white">Security Settings</h3>
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-200">Change Password</p>
                      <p className="text-xs text-slate-400">Ensure your account stays secure.</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
