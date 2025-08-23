// pages/TeachersList.tsx
import React, { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiEye } from "react-icons/fi";
import API from "../../api/axios";
import TeacherModal from "../../components/TeacherModal";
import type{ TeacherFormData } from "../../components/TeacherModal";
import Modal from "../../components/Modal";

interface Teacher {
  _id?: string;
  name: string;
  photo?: string;
  dob?: string;
  gender?: string;
  email: string;
  mobileNumber?: string;
  address?: string;
  qualifications?: string;
  subjects?: { classId: string | { _id: string; name: string }; subjectName: string }[];
}

interface ClassItem {
  _id: string;
  name: string;
  section?: string;
}

const emptyTeacher: Teacher = {
  name: "",
  photo: "",
  dob: "",
  gender: "",
  email: "",
  mobileNumber: "",
  address: "",
  qualifications: "",
  subjects: [],
};

const TeachersList: React.FC = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  const [searchText, setSearchText] = useState("");

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Fetch teachers and classes on mount
  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await API.get("/api/classes");
      setClasses(res.data.classes || res.data); // fallback if API returns array directly
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingTeacher(emptyTeacher);
    setModalOpen(true);
  };

  const openEditModal = (teacher: Teacher) => {
    const normalizedTeacher = {
      ...teacher,
      dob: teacher.dob ? teacher.dob.split("T")[0] : "",
      subjects: teacher.subjects?.map((s) => ({
        classId:
          typeof s.classId === "object" && s.classId !== null ? s.classId._id : s.classId,
        subjectName: s.subjectName,
      })) || [],
    };
    setEditingTeacher(normalizedTeacher);
    setModalOpen(true);
  };

  const saveTeacher = async (teacher: TeacherFormData & { _id?: string }) => {
    try {
      if (teacher._id) {
        const res = await API.put(`/api/teachers/${teacher._id}`, teacher);
        setTeachers((prev) => prev.map((t) => (t._id === teacher._id ? res.data : t)));
      } else {
        const res = await API.post("/api/teachers", teacher);
        setTeachers((prev) => [res.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error saving teacher");
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await API.delete(`/api/teachers/${confirmDeleteId}`);
      setTeachers((prev) => prev.filter((t) => t._id !== confirmDeleteId));
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmDeleteId(null);
      setConfirmModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setConfirmDeleteId(null);
    setConfirmModalOpen(false);
  };

  const filteredTeachers = teachers.filter((t) =>
    t.name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading teachers...</p>;

  return (
    <div className="p-4 max-w-full mx-auto space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="relative flex-1">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-sm pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition text-sm"
        >
          <FiPlus /> Add
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
        <table className="min-w-[1200px] text-sm text-left text-gray-700 border border-gray-200 rounded-xl">
          <thead className="bg-gray-100 text-xs font-medium text-gray-600 uppercase">
            <tr>
              <th className="px-3 py-2">Photo</th>
              <th className="px-3 py-2">Name</th>
              <th className="px-3 py-2">DOB</th>
              <th className="px-3 py-2">Gender</th>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Mobile</th>
              <th className="px-3 py-2">Address</th>
              <th className="px-3 py-2">Qualifications</th>
              <th className="px-3 py-2">Subjects</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((t) => (
              <tr
                key={t._id}
                className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-3 py-2">
                  <img
                    src={
                      t.photo ||
                      "https://w7.pngwing.com/pngs/241/840/png-transparent-computer-icons-student-school-student-angle-people-logo-thumbnail.png"
                    }
                    alt={t.name}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                </td>
                <td className="px-3 py-2">{t.name || "-"}</td>
                <td className="px-3 py-2">{t.dob?.split("T")[0] || "-"}</td>
                <td className="px-3 py-2">{t.gender || "-"}</td>
                <td className="px-3 py-2">{t.email || "-"}</td>
                <td className="px-3 py-2">{t.mobileNumber || "-"}</td>
                <td className="px-3 py-2">{t.address || "-"}</td>
                <td className="px-3 py-2">{t.qualifications || "-"}</td>
                <td className="px-3 py-2">
                  {t.subjects && t.subjects.length > 0
                    ? t.subjects
                        .map((s) => {
                          const className =
                            typeof s.classId === "object" && s.classId !== null
                              ? s.classId.name
                              : classes.find((c) => c._id === s.classId)?.name ||
                                "Unknown Class";
                          return `${className} - ${s.subjectName}`;
                        })
                        .join(", ")
                    : "-"}
                </td>
                <td className="px-3 py-2 flex gap-2">
                  <button
                    onClick={() => openEditModal(t)}
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(t._id!)}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <FiTrash2 /> Delete
                  </button>
                  <button
                    onClick={() => console.log(`View Teacher: ${t.name}`)}
                    className="text-green-600 hover:text-green-800 flex items-center gap-1"
                  >
                    <FiEye /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Teacher Modal */}
      {editingTeacher && (
        <TeacherModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={saveTeacher}
          initialData={editingTeacher}
          classes={classes}
        />
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={confirmModalOpen}
        title="Delete Teacher"
        message="Are you sure you want to delete this teacher?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default TeachersList;
