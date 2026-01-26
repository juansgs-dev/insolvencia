"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { toast } from "sonner"

type User = {
  id: string
  fullName: string
  email: string
  role: string
  roleId: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      })

      if (!res.ok) {
        setUser(null)
        return
      }

      const data = await res.json()
      setUser(data.user)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])


  const logout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      if (!res.ok) {
        toast.error("No se pudo cerrar sesión")
        return
      }

      setUser(null)
      toast.success("Sesión cerrada correctamente")
    } catch (error) {
      toast.error("Error al cerrar sesión")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        logout,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
