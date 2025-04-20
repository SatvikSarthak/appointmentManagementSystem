"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Calendar, Clock } from "lucide-react";
import DatePicker from "react-datepicker";
export default function BookAppointment() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const baseUrl = "http://localhost:5001/api";

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    teacherId: "",
    date: "",
    startTime: "",

    topic: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/teachers`);
        setTeachers(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching teachers",
          description: error.response?.data?.message || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, [toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.teacherId) {
      newErrors.teacherId = "Please select a teacher";
    }

    if (!formData.date) {
      newErrors.date = "Please select a date";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    if (!formData.startTime) {
      newErrors.startTime = "Please select a start time";
    }

    if (!formData.topic.trim()) {
      newErrors.topic = "Please enter a topic for discussion";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        setSubmitting(true);
        await axios.post(`${baseUrl}/appointments/student/book`, formData, {
          withCredentials: true,
        });

        toast({
          title: "Appointment booked",
          description:
            "Your appointment request has been submitted successfully",
        });

        router.push("/student/dashboard");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error booking appointment",

          description: error.response?.data?.message || "Something went wrong",
        });
      } finally {
        setSubmitting(false);
      }
    }
  };

  if (loading) {
    return (
      <ProtectedRoute allowedRole="student">
        <LoadingSpinner />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRole="student">
      <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Book an Appointment</h1>

          <div className="bg-white shadow-md rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="teacherId">Select Teacher</Label>
                <select
                  id="teacherId"
                  name="teacherId"
                  value={formData.teacherId}
                  onChange={handleChange}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher._id} value={teacher._id}>
                      {teacher.name} - {teacher.domain}
                    </option>
                  ))}
                </select>
                {errors.teacherId && (
                  <p className="text-red-500 text-xs">{errors.teacherId}</p>
                )}
              </div>
              {/* 
              <div className="space-y-2">
                <Label htmlFor="date" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> Date
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
              </div> */}
             <div className="space-y-2 ">

                <Label htmlFor="date" className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-white bg-white" /> Date
                </Label>
                <div className="relative">
                  <DatePicker
                    id="date"
                    
                    selected={formData.date ? new Date(formData.date) : null}
                    onChange={(date) => {
                      const isoDate = date.toISOString().split("T")[0];
                      setFormData((prev) => ({
                        ...prev,
                        date: isoDate,
                      }));
                      if (errors.date) {
                        setErrors((prev) => ({
                          ...prev,
                          date: "",
                        }));
                      }
                    }}
                    minDate={new Date()}
                    placeholderText="select(yyyy-mm-dd)"
                    className="w-full px-4 py-2 border bg-white border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-300 focus:outline-none text-sm"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-xs">{errors.date}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime" className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> Start Time
                  </Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                  {errors.startTime && (
                    <p className="text-red-500 text-xs">{errors.startTime}</p>
                  )}
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="endTime" className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> End Time
                  </Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                  {errors.endTime && <p className="text-red-500 text-xs">{errors.endTime}</p>}
                </div> */}
              </div>

              <div className="space-y-2">
                <Label htmlFor="topic">Topic of Discussion</Label>
                <Input
                  id="topic"
                  name="topic"
                  value={formData.topic}
                  onChange={handleChange}
                  placeholder="Brief description of what you want to discuss"
                  required
                />
                {errors.topic && (
                  <p className="text-red-500 text-xs">{errors.topic}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/student/dashboard")}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Booking..." : "Book Appointment"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}
