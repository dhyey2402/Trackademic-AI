"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, Wifi } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLiveDataContext } from "@/hooks/LiveDataContext"

export function CameraFeed() {
  const { students, isPolling } = useLiveDataContext()

  const [currentTime, setCurrentTime] = useState("")
  const [fps, setFps] = useState(30)
  const [frameCount, setFrameCount] = useState(0)

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      )
    }, 1000)

    const fpsInterval = setInterval(() => {
      setFps(28 + Math.floor(Math.random() * 4))
      setFrameCount((prev) => prev + 1)
    }, 100)

    return () => {
      clearInterval(timeInterval)
      clearInterval(fpsInterval)
    }
  }, [])

  return (
    <Card className="flex flex-col border-border/50">
      <CardHeader className="flex-row items-center justify-between border-b border-border py-3">
        <div className="flex items-center gap-2">
          <Video className="size-5 text-blue-500" />
          <CardTitle className="text-base">Live Classroom Feed</CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className={cn("absolute inline-flex size-full rounded-full opacity-75", isPolling ? "animate-ping bg-red-400" : "bg-muted-foreground")}></span>
            <span className={cn("relative inline-flex size-2 rounded-full", isPolling ? "bg-red-500" : "bg-muted-foreground")}></span>
          </span>
          <Badge variant="secondary" className="text-xs font-normal">
            {isPolling ? "REC" : "PAUSED"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative flex-1 p-0">
        {/* Camera Feed */}
        <div className="relative aspect-video w-full overflow-hidden rounded-b-xl bg-slate-900">
          {/* Live Camera Stream */}
          <img
            src="http://127.0.0.1:8000/stream"
            alt="Live Classroom Feed"
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          />

          {/* Subtle overlay grid */}
          <div className="absolute inset-0 bg-transparent">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Detection Bounding Boxes */}
          {students.filter(s => s.box).map((student, index) => {
            const [bx, by, bw, bh] = student.box!
            const x = (bx / 1280) * 100
            const y = (by / 720) * 100
            const width = (bw / 1280) * 100
            const height = (bh / 720) * 100

            return (
              <div
                key={student.name}
                className={cn(
                  "absolute transition-all duration-300",
                  "animate-in fade-in zoom-in-95"
                )}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  width: `${width}%`,
                  height: `${height}%`,
                  animationDelay: `${index * 100}ms`,
                }}
              >
                <div
                  className={cn(
                    "absolute inset-0 rounded-sm border-2",
                    student.status === "Present"
                      ? "border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      : "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]"
                  )}
                >
                  <div className={cn("absolute -left-0.5 -top-0.5 h-3 w-3 border-l-2 border-t-2", student.status === "Present" ? "border-emerald-400" : "border-red-400")} />
                  <div className={cn("absolute -right-0.5 -top-0.5 h-3 w-3 border-r-2 border-t-2", student.status === "Present" ? "border-emerald-400" : "border-red-400")} />
                  <div className={cn("absolute -bottom-0.5 -left-0.5 h-3 w-3 border-b-2 border-l-2", student.status === "Present" ? "border-emerald-400" : "border-red-400")} />
                  <div className={cn("absolute -bottom-0.5 -right-0.5 h-3 w-3 border-b-2 border-r-2", student.status === "Present" ? "border-emerald-400" : "border-red-400")} />
                </div>

                <div
                  className={cn(
                    "absolute -top-7 left-0 flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs font-medium text-white",
                    student.status === "Present" ? "bg-emerald-500/90" : "bg-red-500/90"
                  )}
                >
                  <span className="max-w-20 truncate">{student.name}</span>
                </div>

                <div
                  className={cn(
                    "absolute left-1/2 top-2 size-1.5 -translate-x-1/2 rounded-full",
                    student.status === "Present" ? "bg-emerald-400 animate-pulse" : "bg-red-400 animate-pulse"
                  )}
                />
              </div>
            )
          })}

          {/* Top-left overlay info */}
          <div className="absolute left-3 top-3 flex flex-col gap-1">
            <div className="flex items-center gap-2 rounded bg-black/60 px-2 py-1 backdrop-blur-sm">
              <Wifi className="size-3 text-emerald-400" />
              <span className="font-mono text-xs text-white">CAM-01</span>
            </div>
            <div className="rounded bg-black/60 px-2 py-1 backdrop-blur-sm">
              <span className="font-mono text-xs text-emerald-400">ROOM 101-A</span>
            </div>
          </div>

          {/* Top-right AI indicator */}
          <div className="absolute right-3 top-3 flex items-center gap-2 rounded bg-black/60 px-2 py-1 backdrop-blur-sm">
            <div className="flex size-4 items-center justify-center rounded bg-blue-500">
              <span className="text-[8px] font-bold text-white">AI</span>
            </div>
            <span className="font-mono text-xs text-blue-400">{isPolling ? "ACTIVE" : "PAUSED"}</span>
          </div>

          {/* Bottom overlay bar */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/80 via-black/60 to-transparent px-4 py-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className={cn("size-2 rounded-full", isPolling ? "animate-pulse bg-red-500" : "bg-muted-foreground")} />
                <span className="font-mono text-xs text-white/90">{isPolling ? "LIVE" : "PAUSED"}</span>
              </div>
              <span className="font-mono text-xs text-white/70">{currentTime}</span>
            </div>

            <div className="flex items-center gap-4 font-mono text-xs text-white/70">
              <span>1920x1080</span>
              <span className="text-emerald-400">{fps} FPS</span>
              <span>H.264</span>
              <span className="tabular-nums">F{String(frameCount).padStart(6, "0")}</span>
            </div>
          </div>

          {/* Detection count overlay */}
          <div className="absolute bottom-12 right-3 rounded bg-black/60 px-2 py-1 backdrop-blur-sm">
            <span className="font-mono text-xs text-white">
              <span className="text-emerald-400">{students.filter(s => s.status === "Present").length}</span>
              <span className="text-white/50"> / </span>
              <span className="text-white/70">{students.length}</span>
              <span className="ml-1 text-white/50">detected</span>
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
