"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { toast } from "sonner"
import { Lock, Mail, Loader2, ShieldCheck } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        login(data.user.email, data.token)
        toast.success("Welcome back, Administrator")
      } else {
        const err = await response.json()
        toast.error(err.detail || "Invalid credentials")
      }
    } catch (error) {
      toast.error("Unable to connect to security server")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12">
      {/* Background blobs for depth */}
      <div className="absolute left-1/4 top-1/4 -z-10 h-64 w-64 rounded-full bg-blue-600/10 blur-[100px]" />
      <div className="absolute bottom-1/4 right-1/4 -z-10 h-64 w-64 rounded-full bg-indigo-600/10 blur-[100px]" />

      <Card className="w-full max-w-md border-white/10 bg-slate-900/50 shadow-2xl backdrop-blur-xl">
        <CardHeader className="space-y-1 pt-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">TrackAdemic AI AI</CardTitle>
          <CardDescription className="text-slate-400">
            Secure Administrator Access
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-8 pt-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="email"
                  placeholder="admin@TrackAdemic AI.ai"
                  className="border-white/10 bg-slate-950/50 pl-10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="border-white/10 bg-slate-950/50 pl-10 text-white placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="mt-2 w-full bg-blue-600 font-semibold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)] disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
          <div className="mt-8 rounded-lg border border-white/5 bg-white/5 p-4">
            <p className="text-center text-[10px] uppercase tracking-widest text-slate-500">
              System Security Information
            </p>
            <p className="mt-2 text-center text-xs text-slate-400">
              This terminal is monitored. Unauthorized access attempts are logged and reported.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
