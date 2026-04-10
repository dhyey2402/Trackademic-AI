"use client"

import { useAuth } from "@/hooks/AuthContext"
import { useRouter } from "next/navigation"
import { LogOut, Monitor, BookOpen, ArrowRight, Layers, User } from "lucide-react"
import { useEffect } from "react"

const modules = [
  {
    id: "attendance",
    title: "Attendance System",
    subtitle: "VisionTrack AI",
    description:
      "Real-time AI-powered classroom monitoring. Track student presence with live camera feeds, CV-based face recognition, and instant alerts.",
    icon: Monitor,
    href: "/attendance",
    gradient: "from-blue-600 via-cyan-500 to-teal-400",
    glowColor: "rgba(37,99,235,0.35)",
    accentColor: "blue",
    features: ["Live Camera Feeds", "Face Recognition", "Attendance Reports", "Real-time Alerts"],
    badge: "Live",
  },
  {
    id: "curriculum",
    title: "Curriculum Section",
    subtitle: "EduCore AI",
    description:
      "AI-powered B.Tech curriculum generator. Design full 8-semester plans with AICTE-compliant subjects, industry scores, and emerging tech flags.",
    icon: BookOpen,
    href: "/curriculum",
    gradient: "from-violet-600 via-purple-500 to-fuchsia-400",
    glowColor: "rgba(124,58,237,0.35)",
    accentColor: "violet",
    features: ["AI Curriculum Generation", "Syllabus Deep-Dive", "Industry Insights", "12 Branches"],
    badge: "AI",
  },
]

export default function SelectModulePage() {
  const { user, logout, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login")
  }, [user, isLoading, router])

  if (isLoading || !user) return null

  return (
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/8 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-violet-600/8 blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-cyan-600/5 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Top Nav */}
      <header className="flex items-center justify-between px-8 py-5 border-b border-white/5 backdrop-blur-sm bg-slate-950/60 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 shadow-lg shadow-blue-500/20">
            <Layers className="size-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-white tracking-tight">EduTrack</span>
            <span className="ml-2 text-xs text-slate-500 font-medium">Platform</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5">
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-300 font-medium">{user.email}</span>
          </div>
          <button
            id="logout-button"
            onClick={logout}
            className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-1.5 text-sm text-red-400 transition-all hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-300"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-16 sm:py-24">
        {/* Welcome */}
        <div className="mb-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-400 mb-2">
            <User className="size-3" />
            Welcome back, Administrator
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Select a{" "}
            <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
              Module
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-md">
            Choose a system to access. Both modules share your current session.
          </p>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full max-w-5xl">
          {modules.map((mod) => {
            const Icon = mod.icon
            return (
              <button
                key={mod.id}
                id={`module-card-${mod.id}`}
                onClick={() => router.push(mod.href)}
                className="group relative flex flex-col text-left rounded-2xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:scale-[1.02] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white/20"
                style={{
                  boxShadow: `0 0 0 0 ${mod.glowColor}`,
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 60px -10px ${mod.glowColor}, 0 0 0 1px ${mod.glowColor}`
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 0 ${mod.glowColor}`
                }}
              >
                {/* Gradient shimmer on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${mod.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

                {/* Badge */}
                <div className="mb-6 flex items-start justify-between">
                  <div className={`flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br ${mod.gradient} shadow-lg`}>
                    <Icon className="size-7 text-white" />
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${
                    mod.accentColor === "blue"
                      ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                      : "border-violet-500/30 bg-violet-500/10 text-violet-400"
                  }`}>
                    {mod.badge}
                  </span>
                </div>

                {/* Title */}
                <div className="mb-1">
                  <p className="text-xs font-medium uppercase tracking-widest text-slate-500 mb-1">{mod.subtitle}</p>
                  <h2 className="text-2xl font-bold text-white">{mod.title}</h2>
                </div>

                {/* Description */}
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{mod.description}</p>

                {/* Feature Tags */}
                <div className="mt-6 flex flex-wrap gap-2">
                  {mod.features.map((f) => (
                    <span
                      key={f}
                      className="rounded-lg border border-white/8 bg-white/5 px-3 py-1 text-xs text-slate-400"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className={`mt-8 flex items-center gap-2 text-sm font-semibold ${
                  mod.accentColor === "blue" ? "text-blue-400" : "text-violet-400"
                } group-hover:gap-3 transition-all duration-300`}>
                  Launch Module
                  <ArrowRight className="size-4" />
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer note */}
        <p className="mt-12 text-xs text-slate-600 text-center">
          Session is active across all modules · Role: Administrator
        </p>
      </main>
    </div>
  )
}
