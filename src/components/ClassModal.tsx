// components/ClassModal.tsx
import React, { useState, useEffect } from "react";

export interface ClassFormData {
  name: string;
  section?: string;
  description?: string;
}

interface ClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (classData: ClassFormData) => void;
  initialData?: ClassFormData;
}

const ClassModal: React.FC<ClassModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [classData, setClassData] = useState<ClassFormData>({
    name: "",
    section: "",
    description: "",
    ...initialData,
  });

  useEffect(() => {
    if (initialData) setClassData(initialData);
  }, [initialData]);

  const handleChange = (field: keyof ClassFormData, value: string) => {
    setClassData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(classData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 relative border border-gray-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition text-lg font-bold"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold text-gray-800 mb-5">
          {initialData ? "Edit Class" : "Add Class"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 font-medium">Class Name</label>
            <input
              type="text"
              placeholder="Enter class name"
              value={classData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 font-medium">Section (optional)</label>
            <input
              type="text"
              placeholder="Enter section"
              value={classData.section}
              onChange={(e) => handleChange("section", e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-gray-600 mb-1 font-medium">Description (optional)</label>
            <textarea
              placeholder="Enter description"
              value={classData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-md"
          >
            Save Class
          </button>
        </form>
      </div>
    </div>
  );
};

export default ClassModal;
