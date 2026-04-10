"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, token: string) => void
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const PUBLIC_PATHS = ["/login"]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    const savedEmail = localStorage.getItem("user_email")
    
    if (token && savedEmail) {
      setUser({ email: savedEmail, role: "admin" })
    }
    
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      const isPublicPath = PUBLIC_PATHS.includes(pathname)
      
      if (!user && !isPublicPath) {
        router.replace("/login")
      } else if (user && isPublicPath) {
        router.replace("/select-module")
      }
    }
  }, [user, isLoading, pathname, router])

  const login = (email: string, token: string) => {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("user_email", email)
    setUser({ email, role: "admin" })
    router.push("/select-module")
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_email")
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
