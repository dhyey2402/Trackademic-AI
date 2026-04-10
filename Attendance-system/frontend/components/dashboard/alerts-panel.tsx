"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, AlertTriangle, CheckCircle, Info, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLiveDataContext } from "@/hooks/LiveDataContext"

const alertConfig = {
  warning: {
    icon: AlertTriangle,
    bgColor: "bg-amber-500/10",
    borderColor: "border-l-amber-500",
    iconColor: "text-amber-500",
  },
  success: {
    icon: CheckCircle,
    bgColor: "bg-emerald-500/10",
    borderColor: "border-l-emerald-500",
    iconColor: "text-emerald-500",
  },
  info: {
    icon: Info,
    bgColor: "bg-blue-500/10",
    borderColor: "border-l-blue-500",
    iconColor: "text-blue-500",
  },
  error: {
    icon: Zap,
    bgColor: "bg-red-500/10",
    borderColor: "border-l-red-500",
    iconColor: "text-red-500",
  },
}

export function AlertsPanel() {
  const { alerts } = useLiveDataContext()

  return (
    <Card className="flex h-full flex-col border-border/50">
      <CardHeader className="flex-row items-center justify-between border-b border-border py-3">
        <div className="flex items-center gap-2">
          <Bell className="size-5 text-blue-500" />
          <CardTitle className="text-base">System Logs</CardTitle>
        </div>
        <div className="flex size-5 items-center justify-center rounded-full bg-blue-500 text-[10px] font-bold text-white">
          {Math.min(alerts.length, 99)}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[340px]">
          <div className="flex flex-col gap-1 p-3">
            {alerts.map((alert) => {
              const config = alertConfig[alert.type]
              const Icon = config.icon

              return (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start gap-3 rounded-lg border-l-2 px-3 py-2.5 transition-all duration-300",
                    config.bgColor,
                    config.borderColor,
                    alert.isNew && "animate-in slide-in-from-top-2 fade-in-0"
                  )}
                >
                  <Icon className={cn("mt-0.5 size-4 shrink-0", config.iconColor)} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-tight text-foreground">{alert.message}</p>
                    <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                      {alert.timestamp}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
