"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login")
    } else if (!loading && isAuthenticated && allowedRole && user.role !== allowedRole) {
      router.push(user.role === "student" ? "/student/dashboard" : "/teacher/dashboard")
    }
  }, [loading, isAuthenticated, router, user, allowedRole])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return null
  }

  if (allowedRole && user.role !== allowedRole) {
    return null
  }

  return children
}
