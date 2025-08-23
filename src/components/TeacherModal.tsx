// components/TeacherModal.tsx
import React, { useEffect, useState } from "react";
import API from "../api/axios";

export interface TeacherFormData {
  name: string;
  photo?: string;
  dob?: string;
  gender?: string;
  email: string;
  mobileNumber?: string;
  address?: string;
  qualifications?: string;
  subjects?: { classId: string; subjectName: string }[];
}

interface ClassItem {
  _id: string;
  name: string;
  section?: string;
}

interface TeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: TeacherFormData) => void;
  initialData?: TeacherFormData;
  classes: ClassItem[];
}

const TeacherModal: React.FC<TeacherModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  classes,
}) => {
  const [teacher, setTeacher] = useState<TeacherFormData>({
    name: "",
    photo: "",
    dob: "",
    gender: "",
    email: "",
    mobileNumber: "",
    address: "",
    qualifications: "",
    subjects: [],
    ...initialData,
  });

  const [newSubject, setNewSubject] = useState<{ classId: string; subjectName: string }>({
    classId: "",
    subjectName: "",
  });

  useEffect(() => {
    if (initialData) setTeacher(initialData);
  }, [initialData]);

  const handleChange = (field: keyof TeacherFormData, value: string | undefined) => {
    setTeacher((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddSubject = () => {
    if (newSubject.classId && newSubject.subjectName) {
      setTeacher((prev) => ({
        ...prev,
        subjects: [...(prev.subjects || []), newSubject],
      }));
      setNewSubject({ classId: "", subjectName: "" });
    }
  };

  const handleRemoveSubject = (index: number) => {
    setTeacher((prev) => ({
      ...prev,
      subjects: prev.subjects?.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(teacher);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative border border-gray-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {teacher.name ? "Edit Teacher" : "Add Teacher"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={teacher.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="email"
              placeholder="Email"
              value={teacher.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="text"
              placeholder="Photo URL"
              value={teacher.photo}
              onChange={(e) => handleChange("photo", e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="date"
              placeholder="DOB"
              value={teacher.dob || ""}
              onChange={(e) => handleChange("dob", e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <select
              value={teacher.gender || ""}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="text"
              placeholder="Mobile Number"
              value={teacher.mobileNumber || ""}
              onChange={(e) => handleChange("mobileNumber", e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="text"
              placeholder="Address"
              value={teacher.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <input
              type="text"
              placeholder="Qualifications"
              value={teacher.qualifications || ""}
              onChange={(e) => handleChange("qualifications", e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Subjects */}
          <div className="mt-4">
            <h3 className="font-medium text-gray-700 mb-2">Subjects</h3>
            <div className="flex gap-2 mb-2">
              <select
                value={newSubject.classId}
                onChange={(e) => setNewSubject({ ...newSubject, classId: e.target.value })}
                className="border border-gray-200 rounded-xl p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Subject Name"
                value={newSubject.subjectName}
                onChange={(e) =>
                  setNewSubject({ ...newSubject, subjectName: e.target.value })
                }
                className="border border-gray-200 rounded-xl p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <button
                type="button"
                onClick={handleAddSubject}
                className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition"
              >
                Add
              </button>
            </div>

            {teacher.subjects && teacher.subjects.length > 0 && (
              <ul className="space-y-1">
                {teacher.subjects.map((subj, idx) => (
                  <li
                    key={idx}
                    className="flex justify-between items-center bg-gray-100 px-3 py-1 rounded-xl"
                  >
                    <span>
                      {classes.find((c) => c._id === subj.classId)?.name || subj.classId} -{" "}
                      {subj.subjectName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(idx)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-md mt-4"
          >
            Save Teacher
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherModal;
