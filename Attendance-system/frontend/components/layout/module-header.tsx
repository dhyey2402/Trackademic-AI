"use client"

import Link from "next/link"
import { useAuth } from "@/hooks/AuthContext"
import { LogOut, ChevronRight, LayoutGrid } from "lucide-react"

interface ModuleHeaderProps {
  moduleName: string
  moduleHref: string
}

export function ModuleHeader({ moduleName, moduleHref }: ModuleHeaderProps) {
  const { user, logout } = useAuth()

  return (
    <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-slate-950/80 backdrop-blur-sm text-sm sticky top-0 z-50">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-slate-500">
        <Link
          href="/select-module"
          id="breadcrumb-home"
          className="flex items-center gap-1.5 hover:text-slate-300 transition-colors"
        >
          <LayoutGrid className="size-3.5" />
          <span>Modules</span>
        </Link>
        <ChevronRight className="size-3.5" />
        <Link
          href={moduleHref}
          className="text-slate-200 font-medium hover:text-white transition-colors"
        >
          {moduleName}
        </Link>
      </nav>

      {/* Right: user + logout */}
      <div className="flex items-center gap-3">
        <span className="hidden sm:block text-slate-500">{user?.email}</span>
        <button
          id="module-header-logout"
          onClick={logout}
          className="flex items-center gap-1.5 text-red-400/70 hover:text-red-400 transition-colors"
        >
          <LogOut className="size-3.5" />
          <span className="text-xs">Logout</span>
        </button>
      </div>
    </div>
  )
}
