"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, UserCheck, UserX, Target } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLiveDataContext } from "@/hooks/LiveDataContext"

export function StatsCards() {
  const { presentCount, absentCount, totalCount, accuracyLabel } = useLiveDataContext()

  const stats = [
    {
      label: "Total Detected",
      value: totalCount.toString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Present",
      value: presentCount.toString(),
      icon: UserCheck,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Absent",
      value: absentCount.toString(),
      icon: UserX,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      label: "Attendance Rate",
      value: accuracyLabel,
      icon: Target,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="group cursor-default border-border/50 py-4 transition-all duration-200 hover:border-border hover:shadow-md"
        >
          <CardContent className="flex items-center gap-4 px-4">
            <div
              className={cn(
                "flex size-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105",
                stat.bgColor
              )}
            >
              <stat.icon className={cn("size-6", stat.color)} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
