"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push(user.role === "student" ? "/student/dashboard" : "/teacher/dashboard")
    }
  }, [isAuthenticated, router, user])

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-md w-full px-6 py-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-center mb-6">Appointment Management System</h1>
        <p className="text-gray-600 text-center mb-8">
          A platform for students and teachers to schedule and manage appointments
        </p>
        <div className="space-y-4">
          <Link href="/login" className="w-full block">
            <Button className="w-full">Login</Button>
          </Link>
          <div className="flex gap-4">
            <Link href="/register/student" className="w-1/2 block">
              <Button variant="outline" className="w-full">
                Student Register
              </Button>
            </Link>
            <Link href="/register/teacher" className="w-1/2 block">
              <Button variant="outline" className="w-full">
                Teacher Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
