"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function TeacherRegisterPage() {
  const { registerTeacher, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    teacherId: "",
    domain: "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.teacherId.trim()) {
      newErrors.teacherId = "Teacher ID is required"
    }

    if (!formData.domain.trim()) {
      newErrors.domain = "Domain is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      await registerTeacher(formData)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-4rem)] bg-gray-50 py-8">
      <div className="max-w-md w-full p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Teacher Registration</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
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
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="teacherId">Teacher ID</Label>
            <Input id="teacherId" name="teacherId" value={formData.teacherId} onChange={handleChange} required />
            {errors.teacherId && <p className="text-red-500 text-xs">{errors.teacherId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain/Specialization</Label>
            <Input
              id="domain"
              name="domain"
              value={formData.domain}
              onChange={handleChange}
              placeholder="e.g. Computer Science, Mathematics"
              required
            />
            {errors.domain && <p className="text-red-500 text-xs">{errors.domain}</p>}
          </div>

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}
