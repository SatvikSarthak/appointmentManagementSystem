"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { useAuth } from "@/context/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"
import LoadingSpinner from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Calendar, Clock, User, FileText, AlertCircle, Check, X, FileEdit } from "lucide-react"
import { motion } from "framer-motion"

export default function TeacherDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const [processingId, setProcessingId] = useState(null)
  const baseUrl = "http://localhost:5001/api"

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${baseUrl}/appointments/teacher`, {
        //  withCredentials: true,
        })
        console.log("Appointments:", response.data)
        setAppointments(response.data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching appointments",
          description: error.response?.data?.message || "Something went wrong",
        })
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchAppointments()
    }
  }, [user, toast])

  const handleUpdateStatus = async (id, status) => {
    try {
      setProcessingId(id)
      await axios.patch(`${baseUrl}/appointments/teacher/${id}`, { status })
      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id ? { ...appointment, status } : appointment,
        ),
      )
      toast({
        title: `Appointment ${status.toLowerCase()}`,
        description: `The appointment has been ${status.toLowerCase()} successfully`,
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating appointment",
        description: error.response?.data?.message || "Something went wrong",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleGenerateNotes = async (id) => {
    try {
      setProcessingId(id)
      const response = await axios.patch(`${baseUrl}/appointments/teacher/${id}`, {
        generateNotes: true,
      })

      setAppointments(
        appointments.map((appointment) =>
          appointment._id === id ? { ...appointment, notes: response.data.notes } : appointment,
        ),
      )
      toast({
        title: "Notes generated",
        description: "Meeting notes have been generated successfully",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating notes",
        description: error.response?.data?.message || "Something went wrong",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => timeString

  return (
    <ProtectedRoute allowedRole="teacher">
      <motion.div
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-sky-800">Teacher Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
        </div>

        <motion.div
          className="bg-gradient-to-br from-white to-blue-50 shadow-lg rounded-2xl p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold text-sky-700 mb-4">Appointment Requests</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12 opacity-80">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-800">No appointments found</h3>
              <p className="text-sm text-gray-500 mt-1">
                You don't have any appointment requests yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Topic
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {appointments.map((appointment) => (
                    <tr key={appointment._id} className="hover:bg-blue-50/30 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start gap-2">
                          <User className="h-5 w-5 text-gray-400 mt-1" />
                          <div>
                            <div className="text-sm font-semibold text-gray-800">
                              {appointment.student.name}
                            </div>
                            <div className="text-sm text-gray-800">{appointment.student.email}</div>
                            <div className="text-xs text-gray-800">
                              Reg: {appointment.student.registrationNo} 
                            </div>
                            <div className="text-xs text-gray-800">
                              Sem: {appointment.student.semester} 
                            </div>
                            <div className="text-xs text-gray-800">
                            Sec: {appointment.student.section} 
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex flex-col text-sm">
                          <div className="flex items-center text-gray-700">
                            <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                            {formatDate(appointment.date)}
                          </div>
                          <div className="flex items-center text-gray-500 mt-1">
                            <Clock className="h-4 w-4 mr-1 text-blue-400" />
                            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-700">{appointment.topic}</td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                            appointment.status,
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
                          {appointment.status === "Pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-500 hover:bg-green-600"
                                onClick={() => handleUpdateStatus(appointment._id, "Confirmed")}
                                disabled={processingId === appointment._id}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUpdateStatus(appointment._id, "Rejected")}
                                disabled={processingId === appointment._id}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}

                          {appointment.status === "Confirmed" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateStatus(appointment._id, "Completed")}
                              disabled={processingId === appointment._id}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Mark Completed
                            </Button>
                          )}

                          {appointment.status === "Completed" && !appointment.notes && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleGenerateNotes(appointment._id)}
                              disabled={processingId === appointment._id}
                            >
                              <FileEdit className="h-4 w-4 mr-1" />
                              Generate Notes
                            </Button>
                          )}

                          {appointment.notes && (
                            <div className="flex items-center text-green-600 font-medium text-sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Notes Generated
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>
    </ProtectedRoute>
  )
}
