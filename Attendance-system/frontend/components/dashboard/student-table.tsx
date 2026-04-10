"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useLiveDataContext } from "@/hooks/LiveDataContext"

export function StudentTable() {
  const { students } = useLiveDataContext()

  return (
    <Card className="border-border/50">
      <CardHeader className="flex-row items-center justify-between border-b border-border py-3">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-blue-500" />
          <CardTitle className="text-base">Live Student Status</CardTitle>
        </div>
        <span className="text-xs text-muted-foreground">
          {students.length === 0 ? "Waiting for data..." : `${students.length} tracked`}
        </span>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[200px]">
          {students.length === 0 ? (
            <div className="flex h-full items-center justify-center py-10 text-sm text-muted-foreground">
              No students detected yet
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="h-10 text-xs">Name</TableHead>
                  <TableHead className="h-10 text-xs">Status</TableHead>
                  <TableHead className="h-10 text-xs text-right">Last Seen</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.name} className="group">
                    <TableCell className="py-2 font-medium">{student.name}</TableCell>
                    <TableCell className="py-2">
                      <Badge
                        className={cn(
                          "text-xs font-normal",
                          student.status === "Present"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                            : "border-red-500/30 bg-red-500/10 text-red-600"
                        )}
                        variant="outline"
                      >
                        {student.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 text-right font-mono text-sm text-muted-foreground">
                      {new Date(student.last_seen * 1000).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: false,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
