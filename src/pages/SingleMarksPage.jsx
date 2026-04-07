import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SUBJECTS } from "../constants/subjects";

function SingleMarksPage({
  students,
  activeStudent,
  activeStudentId,
  onSelectStudent,
  updateStudentMark,
  subjectNames,
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [saveNote, setSaveNote] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return students;
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(query) ||
        student.indexNumber.toLowerCase().includes(query)
    );
  }, [search, students]);

  function handleSelectStudent(studentId, studentLabel) {
    onSelectStudent(studentId);
    setSearch(studentLabel);
    setIsSearchOpen(false);
  }

  function handleSingleArrowNavigation(e) {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;

    const row = Number(e.currentTarget.dataset.singleRow);
    const col = Number(e.currentTarget.dataset.singleCol);
    if (Number.isNaN(row) || Number.isNaN(col)) return;

    let targetRow = row;
    let targetCol = col;

    if (e.key === "ArrowUp") targetRow = Math.max(0, row - 1);
    if (e.key === "ArrowDown") targetRow = Math.min(2, row + 1);
    if (e.key === "ArrowLeft") targetCol = Math.max(0, col - 1);
    if (e.key === "ArrowRight") targetCol = Math.min(2, col + 1);

    const nextInput = document.querySelector(
      `[data-single-row="${targetRow}"][data-single-col="${targetCol}"]`
    );
    if (!nextInput) return;

    e.preventDefault();
    nextInput.focus();
    nextInput.select();
  }

  return (
    <section className="mx-auto max-w-4xl space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Single Student Marks</h2>
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

      <article className="border border-slate-200 bg-white p-5">
        <div className="max-w-xl">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Select Student (search by name or roll)
          </label>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search student..."
            className="w-full border border-slate-300 px-3 py-2 text-base outline-none focus:border-blue-500"
          />
          {isSearchOpen && (
            <div className="mt-2 max-h-56 overflow-auto border border-slate-200 bg-white">
              {filteredStudents.length === 0 && (
                <p className="px-3 py-2 text-sm text-slate-500">No students found.</p>
              )}
              {filteredStudents.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() =>
                    handleSelectStudent(student.id, `${student.name} (${student.indexNumber})`)
                  }
                  className={`block w-full border-b border-slate-100 px-3 py-2 text-left text-sm hover:bg-slate-50 ${
                    activeStudentId === student.id ? "bg-slate-50" : ""
                  }`}
                >
                  {student.name} ({student.indexNumber})
                </button>
              ))}
            </div>
          )}
        </div>
      </article>

      <article className="border border-slate-200 bg-white p-5">
        {!activeStudent && <p className="text-sm text-slate-500">Please select a student first.</p>}
        {activeStudent && (
          <>
            <div className="grid gap-3 md:grid-cols-3">
              {SUBJECTS.map((subject) => (
                <label key={subject} className="block">
                  <span className="mb-1 block text-xs uppercase text-slate-600">
                    {subjectNames[subject] ?? subject}
                  </span>
                  <input
                    data-single-row={Math.floor(SUBJECTS.indexOf(subject) / 3)}
                    data-single-col={SUBJECTS.indexOf(subject) % 3}
                    value={activeStudent.marks[subject]}
                    onChange={(e) => {
                      setHasChanges(true);
                      updateStudentMark(activeStudent.id, subject, e.target.value);
                    }}
                    onKeyDown={handleSingleArrowNavigation}
                    placeholder="0-100"
                    className="w-full border border-slate-300 px-3 py-2 text-base outline-none focus:border-blue-500"
                  />
                </label>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (!hasChanges) return;
                  setSaveNote("Marks saved.");
                  setHasChanges(false);
                }}
                className="bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={!hasChanges}
              >
                Save Marks
              </button>
              {saveNote && <span className="text-sm text-slate-600">{saveNote}</span>}
            </div>
          </>
        )}
      </article>
    </section>
  );
}

export default SingleMarksPage;
