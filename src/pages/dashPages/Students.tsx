import React, { useEffect, useState, useRef } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiEye } from "react-icons/fi";
import API from "../../api/axios";
import type { StudentFormData } from "../../components/StudentModal";
import StudentModal from "../../components/StudentModal";
import Modal from "../../components/Modal";

interface Student {
  _id?: string;
  name: string;
  photo?: string;
  dob?: string;
  gender?: string;
  address?: string;
  class?: any;
  section?: string;
  rollNumber?: number;
  fatherName?: string;
  motherName?: string;
  mobileNumber?: string;
  whatsappNumber?: string;
  email?: string;
  attendance?: { date: string; status: string }[];
}

interface ClassItem {
  _id: string;
  name: string;
  section?: string;
}

const emptyStudent: Student = {
  name: "",
  photo:
    "https://w7.pngwing.com/pngs/241/840/png-transparent-computer-icons-student-school-student-angle-people-logo-thumbnail.png",
  dob: "",
  gender: "",
  address: "",
  class: "",
  section: "",
  rollNumber: undefined,
  fatherName: "",
  motherName: "",
  mobileNumber: "",
  whatsappNumber: "",
  email: "",
  attendance: [],
};

const StudentsList = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchText, setSearchText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  const csvInputRef = useRef<HTMLInputElement | null>(null); // CSV file input ref

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/students");
      setStudents(res.data.students);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const res = await API.get("/api/classes");
      setClasses(res.data.classes);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingStudent(emptyStudent);
    setModalOpen(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setModalOpen(true);
  };

  const saveStudent = async (student: StudentFormData & { _id?: string }) => {
    try {
      const payload: any = { ...student };
      if (!payload.photo) delete payload.photo;

      if (student._id) {
        const res = await API.put(`/api/students/${student._id}`, payload);
        setStudents((prev) =>
          prev.map((s) => (s._id === student._id ? res.data.student : s))
        );
      } else {
        const res = await API.post("/api/students", payload);
        setStudents((prev) => [res.data.student, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error saving student");
    }
  };

  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id);
    setConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteId) return;
    try {
      await API.delete(`/api/students/${confirmDeleteId}`);
      setStudents((prev) => prev.filter((s) => s._id !== confirmDeleteId));
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

  // --- CSV Import ---
  const handleCSVImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/api/students/import/csv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(`${res.data.count} students imported successfully!`);
      fetchStudents();
    } catch (err) {
      console.error(err);
      alert("Failed to import CSV");
    }
  };

  const filteredStudents = students.filter((s) => {
    const className =
      s.class && typeof s.class === "object" ? s.class.name : s.class;
    return (
      s.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (className &&
        className.toLowerCase().includes(searchText.toLowerCase())) ||
      (s.section && s.section.toLowerCase().includes(searchText.toLowerCase()))
    );
  });

  const groupedByClass = classes.map((cls) => ({
    class: cls,
    students: filteredStudents.filter(
      (s) =>
        s.class &&
        ((typeof s.class === "object" && s.class._id === cls._id) ||
          (typeof s.class === "string" && s.class === cls._id))
    ),
  }));

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading students...</p>;

  return (
    <div className="p-4 max-w-full mx-auto space-y-6">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="relative flex-1">
          <FiSearch className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, class or section"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-sm pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition text-sm"
          >
            <FiPlus /> Add
          </button>
          <button
            onClick={() => csvInputRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700 transition text-sm"
          >
            Import CSV
          </button>
          <input
            type="file"
            ref={csvInputRef}
            onChange={handleCSVImport}
            accept=".csv"
            className="hidden"
          />
        </div>
      </div>

      {/* Tables per Class */}
      {groupedByClass.map(({ class: cls, students: clsStudents }) => {
        if (clsStudents.length === 0) return null;

        return (
          <div key={cls._id} className="bg-white rounded-2xl shadow p-4">
            <h2 className="font-semibold text-gray-800 mb-2">{cls.name}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-[1200px] text-sm text-left text-gray-700 border border-gray-200 rounded-xl">
                <thead className="bg-gray-100 text-xs font-medium text-gray-600 uppercase">
                  <tr>
                    <th className="px-3 py-2">Photo</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">DOB</th>
                    <th className="px-3 py-2">Gender</th>
                    <th className="px-3 py-2">Class</th>
                    <th className="px-3 py-2">Roll No</th>
                    <th className="px-3 py-2">Father</th>
                    <th className="px-3 py-2">Mother</th>
                    <th className="px-3 py-2">Mobile</th>
                    <th className="px-3 py-2">WhatsApp</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Address</th>
                    <th className="px-3 py-2">Attendance</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {clsStudents.map((s) => (
                    <tr
                      key={s._id}
                      className="border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-3 py-2">
                        <img
                          src={
                            s.photo ||
                            "https://w7.pngwing.com/pngs/241/840/png-transparent-computer-icons-student-school-student-angle-people-logo-thumbnail.png"
                          }
                          alt={s.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      </td>
                      <td className="px-3 whitespace-nowrap py-2">
                        {s.name || "-"}
                      </td>
                      <td className="px-3 whitespace-nowrap py-2">
                        {s.dob?.split("T")[0] || "-"}
                      </td>
                      <td className="px-3 py-2">{s.gender || "-"}</td>
                      <td className="px-3 py-2">
                        {(() => {
                          if (!s.class) return "-";
                          if (typeof s.class === "object") return s.class.name;
                          const cls = classes.find((c) => c._id === s.class);
                          return cls ? cls.name : s.class;
                        })()}
                      </td>
                      <td className="px-3 py-2">{s.rollNumber ?? "-"}</td>
                      <td className="px-3 py-2">{s.fatherName || "-"}</td>
                      <td className="px-3 py-2">{s.motherName || "-"}</td>
                      <td className="px-3 py-2">{s.mobileNumber || "-"}</td>
                      <td className="px-3 py-2">{s.whatsappNumber || "-"}</td>
                      <td className="px-3 py-2">{s.email || "-"}</td>
                      <td className="px-3 py-2">{s.address || "-"}</td>
                      <td className="px-3 py-2">
                        {s.attendance && s.attendance.length > 0
                          ? s.attendance
                              .map((a) => `${a.date.split("T")[0]}:${a.status}`)
                              .join(", ")
                          : "-"}
                      </td>
                      <td className="px-3 py-2 flex gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <FiEdit2 /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(s._id!)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1"
                        >
                          <FiTrash2 /> Delete
                        </button>
                        <button
                          onClick={() => console.log(`View Student: ${s.name}`)}
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
          </div>
        );
      })}

      {/* Student Modal */}
      {editingStudent && (
        <StudentModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={saveStudent}
          initialData={editingStudent}
          classes={classes}
        />
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={confirmModalOpen}
        title="Delete Student"
        message="Are you sure you want to delete this student?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

export default StudentsList;
