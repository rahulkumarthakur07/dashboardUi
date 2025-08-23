import React, { useEffect, useState } from "react";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiChevronDown,
  FiChevronUp,
  FiSearch,
} from "react-icons/fi";
import API from "../../api/axios";
import type { ClassFormData } from "../../components/ClassModal";
import ClassModal from "../../components/ClassModal";

interface Student {
  _id: string;
  name: string;
  gender?: string;
  photo?: string;
  dob?: string;
  address?: string;
  rollNumber?: number;
  fatherName?: string;
  motherName?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  email?: string;
  class?: string;
}

interface SubjectTeacher {
  subjectName: string;
  teacherId?: { _id: string; name: string } | string;
}

interface ClassItem {
  _id: string;
  name: string;
  section?: string;
  description?: string;
  students?: Student[];
  subjectTeachers?: SubjectTeacher[];
}

const ClassPage: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/classes");
      setClasses(res.data.classes);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    const filtered = classes.filter(
      (cls) =>
        cls.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (cls.section &&
          cls.section.toLowerCase().includes(searchText.toLowerCase()))
    );
    setFilteredClasses(filtered);
  }, [searchText, classes]);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  const openAddModal = () => {
    setEditingClass(null);
    setModalOpen(true);
  };

  const openEditModal = (classItem: ClassItem) => {
    setEditingClass(classItem);
    setModalOpen(true);
  };

  const saveClass = async (classData: ClassFormData) => {
    try {
      if (editingClass?._id) {
        const res = await API.put(`/api/classes/${editingClass._id}`, classData);
        setClasses((prev) =>
          prev.map((c) => (c._id === editingClass._id ? res.data.class : c))
        );
      } else {
        const res = await API.post("/api/classes", classData);
        setClasses((prev) => [res.data.class, ...prev]);
      }
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Error saving class");
    }
  };

  const deleteClass = async (_id: string) => {
    if (!window.confirm("Are you sure you want to delete this class?")) return;
    try {
      await API.delete(`/api/classes/${_id}`);
      setClasses((prev) => prev.filter((c) => c._id !== _id));
    } catch (error) {
      console.error(error);
    }
  };

  const countGender = (students: Student[], gender: string) =>
    students.filter((s) => s.gender === gender).length;

  return (
    <div className="p-4 max-w-full mx-auto space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="relative flex-1">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or section"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-sm pl-10 pr-4 py-1.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition text-sm"
        >
          <FiPlus /> Add
        </button>
      </div>

      {/* Classes List */}
      {loading ? (
        <div className="space-y-2">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="animate-pulse h-28 bg-gray-200 rounded-lg shadow-sm"
              />
            ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <p className="text-gray-500 text-center mt-6">No classes found.</p>
      ) : (
        <div className="space-y-4">
          {filteredClasses.map((cls) => (
            <div
              key={cls._id}
              className="bg-white border border-gray-200 rounded-2xl shadow hover:shadow-md transition overflow-hidden"
            >
              <div
                className="flex justify-between items-start p-4 cursor-pointer"
                onClick={() => toggleExpand(cls._id)}
              >
                <div>
                  <h2 className="text-md font-semibold text-gray-800">{cls.name}</h2>
                  {cls.section && (
                    <p className="text-gray-500 text-xs">Section: {cls.section}</p>
                  )}
                  {cls.students && (
                    <p className="text-gray-600 text-xs mt-1">
                      Total: {cls.students.length}, Boys: {countGender(cls.students, "Male")}, Girls:{" "}
                      {countGender(cls.students, "Female")}
                    </p>
                  )}

                  {/* Subjects with Teacher */}
                  {cls.subjectTeachers && cls.subjectTeachers.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                      {cls.subjectTeachers.map((subj, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-800 px-2 py-1 rounded-full font-medium flex items-center gap-1"
                        >
                          {subj.subjectName}{" "}
                          <span className="text-gray-600 text-[10px]">
                            (
                            {subj.teacherId && typeof subj.teacherId === "object"
                              ? subj.teacherId.name
                              : "Not assigned"}
                            )
                          </span>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(cls);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteClass(cls._id);
                    }}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    <FiTrash2 size={16} />
                  </button>
                  <div className="ml-1">
                    {expanded === cls._id ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                </div>
              </div>

              {/* Expanded modern table */}
              {expanded === cls._id && cls.students && cls.students.length > 0 && (
                <div className="overflow-x-auto border-t border-gray-100 bg-gray-50 p-3">
                  <table className="min-w-full table-auto border-collapse text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-2 py-1 text-left text-gray-700">#</th>
                        <th className="px-2 py-1 text-left text-gray-700">Name</th>
                        <th className="px-2 py-1 text-left text-gray-700">Gender</th>
                        <th className="px-2 py-1 text-left text-gray-700">DOB</th>
                        <th className="px-2 py-1 text-left text-gray-700">Address</th>
                        <th className="px-2 py-1 text-left text-gray-700">Roll No.</th>
                        <th className="px-2 py-1 text-left text-gray-700">Father</th>
                        <th className="px-2 py-1 text-left text-gray-700">Mother</th>
                        <th className="px-2 py-1 text-left text-gray-700">Mobile</th>
                        <th className="px-2 py-1 text-left text-gray-700">Whatsapp</th>
                        <th className="px-2 py-1 text-left text-gray-700">Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cls.students.map((s, idx) => (
                        <tr
                          key={s._id}
                          className="cursor-pointer hover:bg-gray-100 transition"
                          onClick={() => console.log(`Clicked student: ${s.name}`)}
                        >
                          <td className="px-2 py-1">{idx + 1}</td>
                          <td className="px-2 py-1 flex items-center gap-2">
                            {s.photo && (
                              <img
                                src={s.photo}
                                alt={s.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            )}
                            {s.name}
                          </td>
                          <td className="px-2 py-1">{s.gender || "-"}</td>
                          <td className="px-2 py-1">
                            {s.dob ? s.dob.split("T")[0] : "-"}
                          </td>
                          <td className="px-2 py-1">{s.address || "-"}</td>
                          <td className="px-2 py-1">{s.rollNumber || "-"}</td>
                          <td className="px-2 py-1">{s.fatherName || "-"}</td>
                          <td className="px-2 py-1">{s.motherName || "-"}</td>
                          <td className="px-2 py-1">{s.mobileNumber || "-"}</td>
                          <td className="px-2 py-1">{s.whatsappNumber || "-"}</td>
                          <td className="px-2 py-1">{s.email || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ClassModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={saveClass}
        initialData={editingClass || undefined}
      />
    </div>
  );
};

export default ClassPage;
