import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BulkAddStudentsPage({ onBulkAddStudents }) {
  const navigate = useNavigate();
  const [bulkText, setBulkText] = useState("");
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const canSubmit = bulkText.trim().length > 0;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setFormError("");
    setIsSaving(true);
    try {
      await onBulkAddStudents(bulkText);
      navigate("/students");
    } catch (error) {
      setFormError(error?.message ?? "Failed to add bulk students.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="max-w-3xl border border-slate-200 bg-white p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-slate-900">Bulk Add Students</h2>
      <p className="mt-1 text-sm text-slate-600">
        Add one student per line with format: Name, Roll
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <textarea
          value={bulkText}
          onChange={(e) => setBulkText(e.target.value)}
          placeholder={"Chamal Senarathna, 9573\nNimal Perera, 9574"}
          className="h-60 w-full border border-slate-300 px-3 py-2 text-base outline-none focus:border-blue-500"
        />

        <div className="grid grid-cols-1 gap-2 sm:flex">
          <button
            type="submit"
            className="bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSaving || !canSubmit}
          >
            {isSaving ? "Adding..." : "Add Students"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/students")}
            className="border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-500 hover:text-blue-500"
          >
            Cancel
          </button>
        </div>
        {formError && <p className="text-sm text-red-600">{formError}</p>}
      </form>
    </section>
  );
}

export default BulkAddStudentsPage;
