"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import {
  LayoutDashboard,
  Video,
  Bell,
  FileBarChart,
  Settings,
  Eye,
  LayoutGrid,
} from "lucide-react"

export type DashboardPageKey =
  | "dashboard"
  | "camera-feeds"
  | "alerts"
  | "reports"
  | "settings"

const menuItems: Array<{
  key: DashboardPageKey
  icon: React.ComponentType<{ className?: string }>
  label: string
}> = [
  { key: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { key: "camera-feeds", icon: Video, label: "Camera Feeds" },
  { key: "alerts", icon: Bell, label: "Alerts" },
  { key: "reports", icon: FileBarChart, label: "Reports" },
  { key: "settings", icon: Settings, label: "Settings" },
]

interface DashboardSidebarProps {
  activePage: DashboardPageKey
  onPageChange: (page: DashboardPageKey) => void
}

export function DashboardSidebar({
  activePage,
  onPageChange,
}: DashboardSidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
          <Eye className="size-4 text-white" />
        </div>
        <span className="text-lg font-semibold text-sidebar-foreground">
          VisionTrack AI
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => onPageChange(item.key)}
                aria-current={activePage === item.key ? "page" : undefined}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300",
                  activePage === item.key
                    ? "bg-gradient-to-r from-blue-500/15 to-cyan-500/10 text-sidebar-primary shadow-sm ring-1 ring-blue-500/20"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                <span
                  className={cn(
                    "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full transition-all duration-300",
                    activePage === item.key
                      ? "bg-blue-500 opacity-100"
                      : "bg-transparent opacity-0 group-hover:opacity-60"
                  )}
                />
                <span
                  className={cn(
                    "flex size-8 items-center justify-center rounded-md transition-colors duration-300",
                    activePage === item.key
                      ? "bg-blue-500/15 text-blue-600"
                      : "text-sidebar-foreground/70 group-hover:bg-sidebar-accent"
                  )}
                >
                  <item.icon className="size-4" />
                </span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer — Back to Modules */}
      <div className="border-t border-sidebar-border p-4 space-y-3">
        <Link
          href="/select-module"
          id="back-to-modules-link"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-all duration-200"
        >
          <LayoutGrid className="size-4" />
          Back to Modules
        </Link>
        <p className="text-xs text-sidebar-foreground/30 px-3">
          VisionTrack v2.1.0
        </p>
      </div>
    </aside>
  )
}
