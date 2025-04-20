// app/student/notes/[id].jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import { toast } from "@/components/ui/use-toast"; // assuming shadcn/toast

export default function NoteDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const baseUrl = "http://localhost:5001/api";

  useEffect(() => {
    async function fetchNote() {
      try {
        const res = await axios.get(`${baseUrl}/students/notes/${id}`, {
          withCredentials: true, // if using cookies
        });

        setNote(res.data);
      } catch (err) {
        console.error(err);
        toast({
          variant: "destructive",
          title: "Error fetching note",
          description:
            err.response?.data?.error || "Something went wrong",
        });
      } finally {
        setLoading(false);
      }
    }

    if (id) fetchNote();
  }, [id]);

  if (loading) {
    return <div className="p-10 text-gray-500">Loading note...</div>;
  }

  if (!note) {
    return <div className="p-10 text-red-500">Note not found or access denied.</div>;
  }

  return (
    <div className="bg-white h-full">
    <div className="max-w-4xl bg-white mx-auto px-6 py-10">
      <button
        onClick={() => router.push("/student/dashboard")}
        className="mb-6 flex items-center text-indigo-600 hover:underline"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-2xl shadow p-6 space-y-4 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Meeting Notes</h2>
        <p className="text-gray-600">
          <strong>Topic:</strong> {note.topic}
        </p>
        <p className="text-gray-600">
          <strong>Date:</strong> {new Date(note.date).toLocaleString()}
        </p>
        <p className="text-gray-600">
          <strong>Teacher:</strong> {note.teacher.name} ({note.teacher.email})
        </p>
        <div className="mt-4 bg-gray-50 border border-gray-200 p-4 rounded-lg text-gray-800 whitespace-pre-line">
          {note.notes || "No notes available yet."}
        </div>
      </div>
    </div>
    </div>
  );
}
