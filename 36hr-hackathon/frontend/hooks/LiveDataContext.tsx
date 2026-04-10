"use client"

import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from "react"
import { toast } from "sonner"

export interface LiveStudent {
  name: string
  status: "Present" | "Absent"
  last_seen: number
  box?: [number, number, number, number]
}

interface ChartPoint {
  time: string
  present: number
  total: number
}

interface AlertEntry {
  id: string
  type: "warning" | "success" | "info" | "error"
  message: string
  timestamp: string
  isNew?: boolean
}

interface LiveDataContextValue {
  students: LiveStudent[]
  presentCount: number
  absentCount: number
  totalCount: number
  accuracyLabel: string
  chartData: ChartPoint[]
  alerts: AlertEntry[]
  isPolling: boolean
  startPolling: () => void
  stopPolling: () => void
  resetSession: () => Promise<void>
}

const LiveDataContext = createContext<LiveDataContextValue | null>(null)

const EVENT_TYPE_MAP: Record<string, AlertEntry["type"]> = {
  "DETECTED": "info",
  "RETURNED": "success",
  "ABSENT": "error"
}

export function LiveDataProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<LiveStudent[]>([])
  const [presentCount, setPresentCount] = useState(0)
  const [absentCount, setAbsentCount] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [accuracyLabel, setAccuracyLabel] = useState("0%")
  const [chartData, setChartData] = useState<ChartPoint[]>([])
  const [alerts, setAlerts] = useState<AlertEntry[]>([])
  const [isPolling, setIsPolling] = useState(true)

  const prevEventsCountRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchBackendData = useCallback(async () => {
    try {
      // 1. Fetch Students
      const liveRes = await fetch("http://127.0.0.1:8000/live-data")
      if (liveRes.ok) {
        const liveData = await liveRes.json()
        setStudents(liveData.students || [])
        
        // Update Chart
        const now = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
        const presentNow = (liveData.students || []).filter((s: any) => s.status === "Present").length
        setChartData(prev => {
          const next = [...prev, { time: now, present: presentNow, total: (liveData.students || []).length }]
          return next.slice(-12)
        })
      }

      // 2. Fetch Summary
      const summaryRes = await fetch("http://127.0.0.1:8000/summary")
      if (summaryRes.ok) {
        const summary = await summaryRes.json()
        setPresentCount(summary.present)
        setAbsentCount(summary.absent)
        setTotalCount(summary.total)
        setAccuracyLabel(`${summary.attendance_rate}%`)
      }

      // 3. Fetch Events (System Logs)
      const eventsRes = await fetch("http://127.0.0.1:8000/events")
      if (eventsRes.ok) {
        const data = await eventsRes.json()
        const backendEvents = data.events || []
        
        // Map backend events to frontend AlertEntry
        const mappedAlerts: AlertEntry[] = backendEvents.map((ev: any, idx: number) => ({
          id: `ev-${idx}-${ev.timestamp}`,
          type: EVENT_TYPE_MAP[ev.event_type] || "info",
          message: `${ev.student_name}: ${ev.event_type.toLowerCase()}`,
          timestamp: ev.time,
        }))
        
        setAlerts(mappedAlerts)

        // Trigger toast for new events
        if (backendEvents.length > prevEventsCountRef.current && prevEventsCountRef.current > 0) {
          const latest = backendEvents[0]
          if (latest.event_type === "ABSENT") {
            toast.error(`${latest.student_name} marked Absent`)
          } else if (latest.event_type === "RETURNED") {
            toast.success(`${latest.student_name} returned`)
          }
        }
        prevEventsCountRef.current = backendEvents.length
      }
    } catch (err) {
      console.error("Polling error:", err)
    }
  }, [])

  const startPolling = useCallback(async () => {
    setIsPolling(true)
    toast.info("Monitoring resumed")
  }, [])

  const stopPolling = useCallback(async () => {
    setIsPolling(false)
    toast.warning("Monitoring paused")
  }, [])

  const resetSession = useCallback(async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/session/reset", { method: "POST" })
      if (res.ok) {
        setChartData([])
        setAlerts([])
        prevEventsCountRef.current = 0
        toast.success("New session started")
        fetchBackendData()
      }
    } catch (err) {
      toast.error("Failed to reset session")
    }
  }, [fetchBackendData])

  useEffect(() => {
    if (!isPolling) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      return
    }
    fetchBackendData()
    intervalRef.current = setInterval(fetchBackendData, 2000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPolling, fetchBackendData])

  return (
    <LiveDataContext.Provider value={{
      students, presentCount, absentCount, totalCount, accuracyLabel,
      chartData, alerts, isPolling, startPolling, stopPolling, resetSession
    }}>
      {children}
    </LiveDataContext.Provider>
  )
}

export function useLiveDataContext() {
  const ctx = useContext(LiveDataContext)
  if (!ctx) throw new Error("useLiveDataContext must be used inside <LiveDataProvider>")
  return ctx
}
