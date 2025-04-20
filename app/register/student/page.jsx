"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import LoadingSpinner from "@/components/LoadingSpinner"

export default function StudentRegisterPage() {
  const { registerStudent, loading } = useAuth()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    registrationNo: "",
    semester: "",
    section: "",
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

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
    } else if (!formData.email.endsWith("muj.manipal.edu")) {
      newErrors.email = "Email must end with muj.manipal.edu"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (!formData.registrationNo.trim()) {
      newErrors.registrationNo = "Registration number is required"
    }

    if (!formData.semester.trim()) {
      newErrors.semester = "Semester is required"
    }

    if (!formData.section.trim()) {
      newErrors.section = "Section is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (validateForm()) {
      await registerStudent(formData)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - background or image */}
      <div className="w-1/2 bg-gray-800 text-white flex justify-center items-center">
        <h1 className="text-4xl font-bold">Student Registration</h1>
      </div>

      {/* Right side - form */}
      <div className="w-1/2 p-8 bg-white">
        <h2 className="text-2xl font-bold text-center mb-6">Register as Student</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="student@muj.manipal.edu"
              required
            />
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
            <Label htmlFor="registrationNo">Registration Number</Label>
            <Input
              id="registrationNo"
              name="registrationNo"
              value={formData.registrationNo}
              onChange={handleChange}
              required
            />
            {errors.registrationNo && <p className="text-red-500 text-xs">{errors.registrationNo}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                required
              />
              {errors.semester && <p className="text-red-500 text-xs">{errors.semester}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Input
                id="section"
                name="section"
                value={formData.section}
                onChange={handleChange}
                required
              />
              {errors.section && <p className="text-red-500 text-xs">{errors.section}</p>}
            </div>
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
