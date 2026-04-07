import { useNavigate, useParams } from "react-router-dom";
import AddStudentPage from "./AddStudentPage";

function EditStudentPage({ students, onUpdateStudent }) {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const student = students.find((item) => item.id === studentId);

  if (!student) {
    return (
      <section className="max-w-2xl border border-slate-200 bg-white p-6">
        <p className="text-sm text-slate-600">Student not found.</p>
        <button
          type="button"
          onClick={() => navigate("/students")}
          className="mt-4 bg-[#003049] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
        >
          Back to Students
        </button>
      </section>
    );
  }

  return (
    <AddStudentPage
      onSaveStudent={(name, roll) => onUpdateStudent(student.id, name, roll)}
      initialName={student.name}
      initialRoll={student.indexNumber}
      title="Edit Student"
      description="Update student details and save."
      submitText="Update Student"
    />
  );
}

export default EditStudentPage;
