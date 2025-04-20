"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Clock, User, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();
  const baseUrl = "http://localhost:5001/api";
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`${baseUrl}/appointments/student`);
        setAppointments(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching appointments",
          description: error.response?.data?.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAppointments();
    }
  }, [user, toast]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Confirmed":
        return "bg-green-100 text-green-700";
      case "Rejected":
        return "bg-red-100 text-red-700";
      case "Completed":
        return "bg-indigo-100 text-indigo-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus = statusFilter ? appt.status === statusFilter : true;
    const matchesSearch =
      appt.teacher?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      appt.topic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <ProtectedRoute allowedRole="student">
      <div className="bg-[#f7f9fc] min-h-screen transition-all duration-300">
        <div className="container mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-indigo-800">
                Student Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, <span className="font-medium">{user?.name}</span>
              </p>
            </div>
            <Link href="/student/book">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                + New Appointment
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <motion.aside
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full lg:w-1/4 p-6 bg-white rounded-2xl shadow-md"
            >
              <div className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold mb-2 text-indigo-700">
                  Filters
                </h2>
                <div>
                  <label className="text-sm font-medium block mb-1 text-gray-700">
                    Status
                  </label>
                  <select
                    className="w-full border bg-white border-gray-300 rounded-lg p-2"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    value={statusFilter}
                  >
                    <option value="">All</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="mt-6 bg-white">
                  <label className="block text-sm bg-white font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search by teacher or topic"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-gray-300 bg-white rounded-lg p-2 focus:outline-indigo-600"
                  />
                </div>
              </div>
            </motion.aside>

            {/* Appointments Table */}
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg p-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-indigo-800">
                    Your Appointments
                  </h2>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <LoadingSpinner />
                  </div>
                ) : filteredAppointments.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-3 text-lg font-semibold text-gray-700">
                      No appointments found
                    </h3>
                    <p className="text-sm text-gray-500">
                      Try booking your first meeting.
                    </p>
                    <div className="mt-6">
                      <Link href="/student/book">
                        <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-indigo-50">
                        <tr>
                          {[
                            "Teacher",
                            "Date & Time",
                            "Topic",
                            "Status",
                            "Notes",
                          ].map((head) => (
                            <th
                              key={head}
                              className="px-6 py-3 text-left text-xs font-semibold text-indigo-700 uppercase tracking-wider"
                            >
                              {head}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {filteredAppointments.map((appointment) => (
                          <motion.tr
                            key={appointment._id}
                            whileHover={{ scale: 1.01 }}
                            className="transition duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <User className="h-5 w-5 text-gray-400 mr-2" />
                                <div>
                                  {appointment.teacher ? (
                                    <>
                                      <div className="text-sm font-medium text-gray-800">
                                        {appointment.teacher.name}
                                      </div>
                                      <div className="text-sm text-gray-500">
                                        {appointment.teacher.email}
                                      </div>
                                    </>
                                  ) : (
                                    <div className="text-sm text-gray-500">
                                      Not Assigned
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm flex flex-col text-gray-700">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {formatDate(appointment.date)}
                                </div>
                                <div className="flex items-center text-gray-500">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {appointment.startTime}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                              {appointment.topic}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                              {appointment.notes ? (
                                <Link
                                  href={`/student/notes/${appointment._id}`}
                                  className="flex items-center text-xs text-indigo-600 hover:underline"
                                >
                                  <FileText className="h-4 w-4 mr-1" />
                                  <span>View Note</span>
                                </Link>
                              ) : (
                                "None"
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
