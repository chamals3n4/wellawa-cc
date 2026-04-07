import { useMemo, useState } from "react";
import { SUBJECTS } from "../constants/subjects";

function GeneralPage({ schoolName, gradeName, subjectNames, onSave }) {
  const [formSchoolName, setFormSchoolName] = useState(schoolName);
  const [formGradeName, setFormGradeName] = useState(gradeName);
  const [formSubjectNames, setFormSubjectNames] = useState(subjectNames);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const isDirty = useMemo(() => {
    const baseSchool = (schoolName ?? "").trim();
    const baseGrade = (gradeName ?? "").trim();
    const currentSchool = (formSchoolName ?? "").trim();
    const currentGrade = (formGradeName ?? "").trim();
    if (baseSchool !== currentSchool) return true;
    if (baseGrade !== currentGrade) return true;
    return SUBJECTS.some(
      (key) => (subjectNames?.[key] ?? "").trim() !== (formSubjectNames?.[key] ?? "").trim()
    );
  }, [formGradeName, formSchoolName, formSubjectNames, gradeName, schoolName, subjectNames]);

  function handleSubjectNameChange(subjectKey, value) {
    setFormSubjectNames((current) => ({
      ...current,
      [subjectKey]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!isDirty) return;
    setFormError("");
    setIsSaving(true);

    try {
      await onSave({
        schoolName: formSchoolName.trim() || "School Name",
        gradeName: formGradeName.trim() || "Grade",
        subjectNames: SUBJECTS.reduce((acc, subjectKey) => {
          acc[subjectKey] = formSubjectNames[subjectKey]?.trim() || subjectKey;
          return acc;
        }, {}),
      });
    } catch (error) {
      setFormError(error?.message ?? "Failed to save general settings.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">General Settings</h2>

      <form className="border border-slate-200 bg-white p-4 sm:p-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">School Name</span>
            <input
              value={formSchoolName}
              onChange={(e) => setFormSchoolName(e.target.value)}
              placeholder="Wellawa Central College"
              className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Grade</span>
            <input
              value={formGradeName}
              onChange={(e) => setFormGradeName(e.target.value)}
              placeholder="11-B"
              className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
            />
          </label>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold text-slate-900">Subject Display Names</h3>
          <p className="mt-1 text-xs text-slate-600">
            Update names shown in single marks and bulk marks screens.
          </p>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {SUBJECTS.map((subjectKey) => (
              <label key={subjectKey} className="block">
                <span className="mb-1 block text-xs uppercase text-slate-600">{subjectKey}</span>
                <input
                  value={formSubjectNames[subjectKey] ?? ""}
                  onChange={(e) => handleSubjectNameChange(subjectKey, e.target.value)}
                  className="w-full border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="mt-6 bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
          disabled={!isDirty || isSaving}
        >
          {isSaving ? "Saving..." : "Save General Settings"}
        </button>
        {formError && <p className="mt-3 text-sm text-red-600">{formError}</p>}
      </form>
    </section>
  );
}

export default GeneralPage;
