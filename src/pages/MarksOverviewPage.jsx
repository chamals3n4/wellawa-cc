import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { exportMarksReportPdf } from "../lib/exportMarksReportPdf";

function placeClass(place) {
  if (place === 1) return "bg-amber-100 text-amber-800";
  if (place === 2) return "bg-slate-200 text-slate-800";
  if (place === 3) return "bg-orange-100 text-orange-800";
  return "bg-slate-100 text-slate-700";
}

function MarksOverviewPage({
  students,
  getStudentTotal,
  schoolName,
  gradeName,
  termName,
  teacherName,
  subjectNames,
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const rankedStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = students.filter((student) => {
      if (!query) return true;
      return (
        student.name.toLowerCase().includes(query) ||
        student.indexNumber.toLowerCase().includes(query)
      );
    });

    const sorted = [...filtered].sort((a, b) => {
      const totalA = getStudentTotal(a);
      const totalB = getStudentTotal(b);
      if (totalA !== totalB) return totalB - totalA;
      return a.name.localeCompare(b.name);
    });

    return sorted.map((student, index) => ({
      ...student,
      total: getStudentTotal(student),
      place: index + 1,
    }));
  }, [getStudentTotal, search, students]);

  function exportReport() {
    exportMarksReportPdf({
      rankedStudents,
      schoolName,
      gradeName,
      termName,
      teacherName,
      subjectNames,
    });
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Marks Table</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or index number"
            className="w-full max-w-sm border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div className="grid grid-cols-1 gap-2 sm:flex">
          <button
            type="button"
            onClick={() => navigate("/marks/single")}
            className="bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Single Marks
          </button>
          <button
            type="button"
            onClick={() => navigate("/marks/bulk")}
            className="bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Bulk Marks
          </button>
          <button
            type="button"
            onClick={exportReport}
            className="bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
          >
            Export Report
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 bg-white">
        <table className="min-w-[560px] w-full border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="border-b border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                Student Name
              </th>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                Index Number
              </th>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                Total Marks
              </th>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                Place
              </th>
            </tr>
          </thead>
          <tbody>
            {rankedStudents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-sm text-slate-500">
                  No students found.
                </td>
              </tr>
            )}
            {rankedStudents.map((student) => (
              <tr key={student.id}>
                <td className="border-b border-slate-200 px-3 py-3 text-sm font-medium text-slate-900">
                  {student.name}
                </td>
                <td className="border-b border-slate-200 px-3 py-3 text-sm text-slate-700">
                  {student.indexNumber}
                </td>
                <td className="border-b border-slate-200 px-3 py-3 text-sm text-slate-700">
                  {student.total}/900
                </td>
                <td className="border-b border-slate-200 px-3 py-3 text-sm">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold ${placeClass(student.place)}`}>
                    {student.place}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default MarksOverviewPage;
