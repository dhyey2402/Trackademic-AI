"use client"

import { useState } from "react"
import { CameraFeed } from "@/components/dashboard/camera-feed"
import { AlertsPanel } from "@/components/dashboard/alerts-panel"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { StudentTable } from "@/components/dashboard/student-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useLiveDataContext } from "@/hooks/LiveDataContext"

type AlertFilter = "all" | "critical" | "info"

export function DashboardOverviewPage() {
  return (
    <>
      <StatsCards />
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CameraFeed />
        </div>
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AttendanceChart />
        <StudentTable />
      </div>
    </>
  )
}

export function CameraPage() {
  const { isPolling, startPolling, stopPolling, resetSession } = useLiveDataContext()
  return (
    <div className="space-y-4">
      <Card className="border-border/50">
        <CardHeader className="flex-row items-center justify-between border-b border-border py-3">
          <CardTitle className="text-base">Camera Controls</CardTitle>
          <Badge variant="outline" className={isPolling ? "text-emerald-600" : "text-muted-foreground"}>
            {isPolling ? "Streaming" : "Paused"}
          </Badge>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3 pt-4">
          <Button onClick={startPolling}>Resume Feed</Button>
          <Button variant="outline" onClick={stopPolling}>
            Pause Feed
          </Button>
          <Button variant="destructive" className="ml-auto" onClick={resetSession}>
            Reset Session
          </Button>
        </CardContent>
      </Card>
      <div className={cn("transition-opacity duration-300", isPolling ? "opacity-100" : "opacity-70")}>
        <CameraFeed />
      </div>
    </div>
  )
}

export function AlertsPage() {
  const { alerts } = useLiveDataContext()
  const [filter, setFilter] = useState<AlertFilter>("all")

  const typeMap: Record<AlertFilter, string[]> = {
    all: ["warning", "success", "info", "error"],
    critical: ["error", "warning"],
    info: ["info", "success"],
  }

  const visibleAlerts = alerts.filter(a => typeMap[filter].includes(a.type))

  return (
    <Card className="border-border/50">
      <CardHeader className="space-y-3 border-b border-border py-3">
        <CardTitle className="text-base">Alerts Center</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>
            All
          </Button>
          <Button size="sm" variant={filter === "critical" ? "default" : "outline"} onClick={() => setFilter("critical")}>
            Critical
          </Button>
          <Button size="sm" variant={filter === "info" ? "default" : "outline"} onClick={() => setFilter("info")}>
            Info
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pt-4">
        {visibleAlerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              "rounded-lg border px-4 py-3",
              alert.type === "error" || alert.type === "warning"
                ? "border-red-500/30 bg-red-500/10"
                : "border-blue-500/20 bg-blue-500/10"
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-medium">{alert.message}</p>
              <Badge variant="outline">{alert.type}</Badge>
            </div>
            <p className="mt-1 font-mono text-xs text-muted-foreground">{alert.timestamp}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <AttendanceChart />
    </div>
  )
}

export function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [autoCameraTuning, setAutoCameraTuning] = useState(true)

  return (
    <Card className="border-border/50">
      <CardHeader className="border-b border-border py-3">
        <CardTitle className="text-base">System Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="mb-3 text-sm font-medium">Notifications</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Realtime alerts</span>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="mb-3 text-sm font-medium">Camera Settings</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Auto exposure tuning</span>
              <Switch checked={autoCameraTuning} onCheckedChange={setAutoCameraTuning} />
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">Language</p>
            <Select defaultValue="en">
              <SelectTrigger>
                <SelectValue placeholder="Choose language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">System Preference</p>
            <Select defaultValue="balanced">
              <SelectTrigger>
                <SelectValue placeholder="Choose mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="performance">High Performance</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="power-save">Power Save</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button>Save Settings</Button>
      </CardContent>
    </Card>
  )
}
