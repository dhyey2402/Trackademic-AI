"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner" // Assuming sonner is used for toasts, or we can just use simple state

export interface LiveStudent {
  name: string
  status: "Present" | "Absent"
  last_seen: number
  box?: [number, number, number, number]
}

export function useLiveData() {
  const [students, setStudents] = useState<LiveStudent[]>([])
  const [previousStudents, setPreviousStudents] = useState<LiveStudent[]>([])

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/live-data")
        if (response.ok) {
          const data = await response.json()
          
          setStudents((prev) => {
            // Check for new absentees to trigger alert
            const currentAbsentees = data.students.filter((s: LiveStudent) => s.status === "Absent")
            const prevAbsentees = prev.filter((s: LiveStudent) => s.status === "Absent")
            
            const newlyAbsent = currentAbsentees.filter(
              (curr: LiveStudent) => !prevAbsentees.find((p: LiveStudent) => p.name === curr.name)
            )

            newlyAbsent.forEach((student: LiveStudent) => {
              toast.error(`${student.name} is now Absent!`, {
                description: `Student missing for more than 15 minutes.`,
              })
            })

            return data.students || []
          })
        }
      } catch (error) {
        console.error("Error fetching live data:", error)
      }
    }

    fetchLiveData()
    const interval = setInterval(fetchLiveData, 2000)
    return () => clearInterval(interval)
  }, [])

  return { students }
}
