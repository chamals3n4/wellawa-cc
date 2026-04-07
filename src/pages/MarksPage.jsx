import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUBJECTS } from "../constants/subjects";

function MarksPage({
  students,
  handleArrowNavigation,
  onEditStudent,
  subjectNames,
}) {
  const navigate = useNavigate();
  const [saveNote, setSaveNote] = useState("");
  const [search, setSearch] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const filteredStudents = students.filter((student) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return (
      student.name.toLowerCase().includes(query) ||
      student.indexNumber.toLowerCase().includes(query)
    );
  });

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between md:-mx-16 md:px-16 lg:-mx-24 lg:px-24">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-slate-900">Marks Table</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by index number or name"
              className="w-full max-w-sm border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={() => {
                if (!hasChanges) return;
                setSaveNote("Bulk marks saved.");
                setHasChanges(false);
              }}
              className="w-full whitespace-nowrap bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
              disabled={!hasChanges}
            >
              Save Marks
            </button>
            {saveNote && <span className="text-sm text-slate-600">{saveNote}</span>}
          </div>
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
        </div>
      </div>

      <div className="overflow-x-auto border border-slate-200 bg-white md:-mx-16 lg:-mx-24">
        <table className="min-w-[820px] table-fixed border-collapse sm:w-full">
          <thead>
            <tr>
              <th className="w-24 border border-slate-200 bg-slate-100 px-2 py-2 text-left text-sm">
                Index Number
              </th>
              {SUBJECTS.map((subject) => (
                <th
                  key={subject}
                  className="border border-slate-200 bg-slate-100 px-1 py-2 text-[12px] uppercase"
                >
                  {subjectNames[subject] ?? subject}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, rowIndex) => (
              <tr key={student.id}>
                <td className="border border-slate-200 px-2 py-2 text-sm">{student.indexNumber}</td>
                {SUBJECTS.map((subject, colIndex) => (
                  <td key={subject} className="border border-slate-200 p-0.5">
                    <input
                      data-row={rowIndex}
                      data-col={colIndex}
                      value={student.marks[subject]}
                      onChange={(e) => {
                        setHasChanges(true);
                        onEditStudent(student.id, subject, e.target.value);
                      }}
                      onKeyDown={handleArrowNavigation}
                      className="w-full min-w-0 border border-slate-300 px-1 py-1.5 text-center text-sm outline-none focus:border-blue-500"
                      placeholder="-"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default MarksPage;
