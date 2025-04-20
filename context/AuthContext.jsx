"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const baseUrl = "http://localhost:5001/api"
  axios.defaults.withCredentials = true;
  useEffect(() => {
    axios.defaults.baseURL = baseUrl
    axios.defaults.headers.post["Content-Type"] = "application/json"
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    

    if (token && userData) {
      setUser(JSON.parse(userData))
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    }

    setLoading(false)
  }, [])

  const registerStudent = async (studentData) => {
    try {
      setLoading(true)
      const response = await axios.post(`${baseUrl}/auth/student/register`, studentData)

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      setUser(response.data.user)
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

      toast({
        title: "Registration successful",
        description: "Welcome to the appointment system!",
      })

      router.push("/student/dashboard")
    } catch (error) {
        console.log(error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.message || "Something went wrong",
      })
    } finally {
      setLoading(false)
    }
  }

  const registerTeacher = async (teacherData) => {
    try {
      setLoading(true)
      const response = await axios.post(`${baseUrl}/auth/teacher/register`, teacherData)

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify(response.data.user))

      setUser(response.data.user)
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`

      toast({
        title: "Registration successful",
        description: "Welcome to the appointment system!",
      })

      router.push("/teacher/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.response?.data?.message || "Something went wrong",
      })
    } finally {
      setLoading(false)
    }
  }

  const loginStudent = async (credentials) => {
    try {
      setLoading(true)
      const response = await axios.post(`${baseUrl}/auth/student/login`, credentials)

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify({ ...response.data.user, role: "student" }))
     
      setUser({ ...response.data.user, role: "student" })
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = 
      'Bearer ' + token;
      // axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}` 

      toast({
        title: "Login successful",
        description: "Welcome back!",
      })

      router.push("/student/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
      })
    } finally {
      setLoading(false)
    }
  }

  const loginTeacher = async (credentials) => {
    try {
      setLoading(true)
      const response = await axios.post(`${baseUrl}/auth/teacher/login`, credentials)

      localStorage.setItem("token", response.data.token)
      localStorage.setItem("user", JSON.stringify({ ...response.data.user, role: "teacher" }))

      setUser({ ...response.data.user, role: "teacher" })
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = 
      'Bearer ' + token;
      toast({
        title: "Login successful",
        description: "Welcome back!",
      })

      router.push("/teacher/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
      })
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    delete axios.defaults.headers.common["Authorization"]
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        registerStudent,
        registerTeacher,
        loginStudent,
        loginTeacher,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
