"use client"

import { AuthProvider, useAuth } from "@/hooks/AuthContext"
import { LiveDataProvider } from "@/hooks/LiveDataContext"
import { Toaster } from "sonner"
import { Loader2 } from "lucide-react"

function AuthProtectedWrapper({ children }: { children: React.ReactNode }) {
  const { isLoading, isLoggedIn } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
      </div>
    )
  }

  // If not logged in, we only show children if we are on the login page
  // The AuthContext handles the routing logic, but this prevents flickering of dashboard content
  return <>{children}</>
}

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AuthProtectedWrapper>
        <LiveDataProvider>
          {children}
        </LiveDataProvider>
      </AuthProtectedWrapper>
      <Toaster position="top-right" theme="dark" richColors />
    </AuthProvider>
  )
}
