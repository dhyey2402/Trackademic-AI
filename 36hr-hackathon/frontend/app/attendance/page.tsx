"use client"

import { useMemo, useState } from "react"
import { DashboardSidebar, type DashboardPageKey } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import {
  AlertsPage,
  CameraPage,
  DashboardOverviewPage,
  ReportsPage,
  SettingsPage,
} from "@/components/dashboard/page-views"

const pageMeta: Record<DashboardPageKey, { title: string; description: string }> = {
  dashboard: {
    title: "AI Classroom Monitoring",
    description: "Real-time student tracking system",
  },
  "camera-feeds": {
    title: "Camera Feeds",
    description: "Monitor and control live classroom feeds",
  },
  alerts: {
    title: "Alerts",
    description: "Track critical and informational system events",
  },
  reports: {
    title: "Reports",
    description: "Review attendance trends and key summaries",
  },
  settings: {
    title: "Settings",
    description: "Configure notifications and system preferences",
  },
}

export default function AttendanceDashboardPage() {
  const [activePage, setActivePage] = useState<DashboardPageKey>("dashboard")
  const meta = pageMeta[activePage]

  const content = useMemo(() => {
    switch (activePage) {
      case "camera-feeds":
        return <CameraPage />
      case "alerts":
        return <AlertsPage />
      case "reports":
        return <ReportsPage />
      case "settings":
        return <SettingsPage />
      default:
        return <DashboardOverviewPage />
    }
  }, [activePage])

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar activePage={activePage} onPageChange={setActivePage} />

      <div className="pl-64">
        <DashboardHeader title={meta.title} description={meta.description} />

        <main className="p-6">
          <div
            key={activePage}
            className="page-transition"
          >
            {content}
          </div>
        </main>
      </div>
    </div>
  )
}
