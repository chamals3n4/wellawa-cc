import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddStudentPage({
  onSaveStudent,
  initialName = "",
  initialRoll = "",
  title = "Add New Student",
  description = "Enter student details and save.",
  submitText = "Save Student",
}) {
  const navigate = useNavigate();
  const [name, setName] = useState(initialName);
  const [roll, setRoll] = useState(initialRoll);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const isDirty = name.trim() !== initialName.trim() || roll.trim() !== initialRoll.trim();

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    if (!isDirty) return;
    setFormError("");
    setIsSaving(true);

    try {
      await onSaveStudent(name, roll);
      navigate("/students");
    } catch (error) {
      setFormError(error?.message ?? "Failed to save student.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="max-w-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-600">{description}</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="mb-1 block text-sm text-slate-700">Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Chamal Senarathna"
            className="w-full border border-slate-300 px-3 py-2 text-base outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-slate-700">Index Number</label>
          <input
            type="text"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
            placeholder="9573"
            className="w-full border border-slate-300 px-3 py-2 text-base outline-none focus:border-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:flex">
          <button
            type="submit"
            className="bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSaving || !isDirty}
          >
            {isSaving ? "Saving..." : submitText}
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

export default AddStudentPage;
