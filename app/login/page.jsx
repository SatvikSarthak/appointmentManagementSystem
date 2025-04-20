"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function LoginPage() {
  const { loginStudent, loginTeacher, loading } = useAuth()
  const [role, setRole] = useState("student")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (role === "student") {
      await loginStudent(formData)
    } else {
      await loginTeacher(formData)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <div className="flex mb-6 border rounded-md overflow-hidden">
          <button
            className={`flex-1 py-2 text-center ${
              role === "student" ? "bg-gray-900 text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => setRole("student")}
          >
            Student
          </button>
          <button
            className={`flex-1 py-2 text-center ${
              role === "teacher" ? "bg-gray-900 text-white" : "bg-white text-gray-700"
            }`}
            onClick={() => setRole("teacher")}
          >
            Teacher
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder={role === "student" ? "student@muj.manipal.edu" : "teacher@example.com"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login as {role === "student" ? "Student" : "Teacher"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Don't have an account?{" "}
          <Link
            href={role === "student" ? "/register/student" : "/register/teacher"}
            className="text-blue-600 hover:underline"
          >
            Register as {role === "student" ? "Student" : "Teacher"}
          </Link>
        </div>
      </div>
    </div>
  )
}
