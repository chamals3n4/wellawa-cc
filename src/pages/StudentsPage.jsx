import { useState } from "react";
import { useNavigate } from "react-router-dom";

function StudentsPage({
  students,
  getStudentTotal,
  onSelectStudent,
  onDeleteStudent,
}) {
  const navigate = useNavigate();
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [activeGenderTab, setActiveGenderTab] = useState("Male");
  const maleStudents = students.filter((student) => student.gender !== "Female");
  const femaleStudents = students.filter((student) => student.gender === "Female");

  function renderStudentTable(title, items) {
    return (
      <div className="overflow-x-auto border border-slate-200 bg-white">
        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700">
          {title} ({items.length})
        </div>
        <table className="min-w-[760px] border-collapse sm:min-w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="border-b border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                Full Name
              </th>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                Index Number
              </th>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                Gender
              </th>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                Marks
              </th>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-sm text-slate-500"
                >
                  No students in this group.
                </td>
              </tr>
            )}
            {items.map((student) => (
              <tr key={student.id}>
                <td className="border-b border-slate-200 px-3 py-3 text-sm font-medium text-slate-900">
                  {student.name}
                </td>
                <td className="border-b border-slate-200 px-3 py-3 text-sm text-slate-700">
                  {student.indexNumber}
                </td>
                <td className="border-b border-slate-200 px-3 py-3 text-sm text-slate-700">
                  {student.gender ?? "Male"}
                </td>
                <td className="border-b border-slate-200 px-3 py-3 text-sm text-slate-700">
                  {getStudentTotal(student)}/900
                </td>
                <td className="border-b border-slate-200 px-3 py-3 text-sm">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectStudent(student.id);
                        navigate("/marks/single");
                      }}
                      className="bg-[#003049] px-3 py-1.5 text-white hover:opacity-95"
                    >
                      Open Marks
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/students/edit/${student.id}`)}
                      className="border border-slate-300 px-3 py-1.5 text-slate-700 hover:border-blue-500 hover:text-blue-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setStudentToDelete(student)}
                      className="border border-slate-300 px-3 py-1.5 text-slate-700 hover:border-blue-500 hover:text-blue-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">
          Students ({students.length})
        </h2>
        <div className="grid grid-cols-1 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => navigate("/students/new")}
            className="bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Add New Student
          </button>
          <button
            type="button"
            onClick={() => navigate("/students/bulk")}
            className="bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Bulk Add Students
          </button>
        </div>
      </div>

      {students.length === 0 ? (
        <div className="border border-slate-200 bg-white px-3 py-8 text-center text-sm text-slate-500">
          No students yet. Add students to begin.
        </div>
      ) : null}

      {students.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveGenderTab("Male")}
            className={`px-4 py-2 text-sm font-semibold ${
              activeGenderTab === "Male"
                ? "bg-[#003049] text-white"
                : "border border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-500"
            }`}
          >
            Male ({maleStudents.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveGenderTab("Female")}
            className={`px-4 py-2 text-sm font-semibold ${
              activeGenderTab === "Female"
                ? "bg-[#003049] text-white"
                : "border border-slate-300 text-slate-700 hover:border-blue-500 hover:text-blue-500"
            }`}
          >
            Female ({femaleStudents.length})
          </button>
        </div>
      ) : null}

      {students.length > 0
        ? renderStudentTable(
            activeGenderTab === "Female" ? "Female Students" : "Male Students",
            activeGenderTab === "Female" ? femaleStudents : maleStudents
          )
        : null}

      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-md border border-slate-200 bg-white p-5">
            <h3 className="text-base font-semibold text-slate-900">
              Delete Student
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete{" "}
              <strong>{studentToDelete.name}</strong>?
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await onDeleteStudent(studentToDelete.id);
                  setStudentToDelete(null);
                }}
                className="bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default StudentsPage;
