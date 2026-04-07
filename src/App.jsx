import { useEffect, useMemo, useState } from "react";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
  updateDoc,
} from "firebase/firestore";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import { SUBJECTS } from "./constants/subjects";
import { auth, db } from "./lib/firebase";
import AddStudentPage from "./pages/AddStudentPage";
import BulkAddStudentsPage from "./pages/BulkAddStudentsPage";
import EditStudentPage from "./pages/EditStudentPage";
import GeneralPage from "./pages/GeneralPage";
import LoginPage from "./pages/LoginPage";
import MarksOverviewPage from "./pages/MarksOverviewPage";
import MarksPage from "./pages/MarksPage";
import SingleMarksPage from "./pages/SingleMarksPage";
import StudentsPage from "./pages/StudentsPage";

function createEmptyMarks() {
  return SUBJECTS.reduce((acc, subject) => {
    acc[subject] = "";
    return acc;
  }, {});
}

function createDefaultSubjectNames() {
  return {
    subject1: "Subject 1",
    subject2: "Subject 2",
    subject3: "Subject 3",
    subject4: "Subject 4",
    subject5: "Subject 5",
    subject6: "Subject 6",
    bucket1: "Bucket 1",
    bucket2: "Bucket 2",
    bucket3: "Bucket 3",
  };
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [studentsBase, setStudentsBase] = useState([]);
  const [marksByStudentId, setMarksByStudentId] = useState({});
  const [activeStudentId, setActiveStudentId] = useState("");
  const [schoolName, setSchoolName] = useState("Wellawa Central COllorge");
  const [gradeName, setGradeName] = useState("11-B");
  const [subjectNames, setSubjectNames] = useState(createDefaultSubjectNames);

  const students = useMemo(
    () =>
      studentsBase.map((student) => ({
        ...student,
        marks: {
          ...createEmptyMarks(),
          ...(marksByStudentId[student.id] ?? {}),
        },
      })),
    [marksByStudentId, studentsBase]
  );

  const activeStudent = students.find((student) => student.id === activeStudentId);
  const userId = currentUser?.uid ?? "";

  const studentsCollectionRef = useMemo(() => collection(db, "students"), []);
  const marksCollectionRef = useMemo(() => collection(db, "marks"), []);
  const generalSettingsRef = useMemo(
    () => (userId ? doc(db, "general", userId) : null),
    [userId]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoggedIn(Boolean(user));
      setAuthReady(true);

      if (typeof window !== "undefined") {
        if (user) {
          if (window.location.pathname === "/login") {
            window.history.replaceState({}, "", "/students");
          }
        } else if (window.location.pathname !== "/login") {
          window.history.replaceState({}, "", "/login");
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!userId) {
      setStudentsBase([]);
      return undefined;
    }

    const studentsQuery = query(studentsCollectionRef, where("userId", "==", userId));
    const unsubscribe = onSnapshot(studentsQuery, (snapshot) => {
      const nextStudents = snapshot.docs.map((studentDoc) => {
        const data = studentDoc.data();
        return {
          id: studentDoc.id,
          name: data.name ?? "",
          indexNumber: data.indexNumber ?? data.roll ?? "",
        };
      });

      setStudentsBase(nextStudents);
      setActiveStudentId((current) =>
        current && nextStudents.some((student) => student.id === current)
          ? current
          : nextStudents[0]?.id ?? ""
      );
    });

    return () => unsubscribe();
  }, [studentsCollectionRef, userId]);

  useEffect(() => {
    if (!userId) {
      setMarksByStudentId({});
      return undefined;
    }

    const marksQuery = query(marksCollectionRef, where("userId", "==", userId));
    const unsubscribe = onSnapshot(marksQuery, (snapshot) => {
      const nextMarks = {};
      snapshot.docs.forEach((markDoc) => {
        const data = markDoc.data();
        nextMarks[markDoc.id] = data.marks ?? {};
      });
      setMarksByStudentId(nextMarks);
    });

    return () => unsubscribe();
  }, [marksCollectionRef, userId]);

  useEffect(() => {
    if (!generalSettingsRef) {
      setSchoolName("Wellawa Central COllorge");
      setGradeName("11-B");
      setSubjectNames(createDefaultSubjectNames());
      return undefined;
    }

    const unsubscribe = onSnapshot(generalSettingsRef, (snapshot) => {
      if (!snapshot.exists()) {
        setSchoolName("Wellawa Central COllorge");
        setGradeName("11-B");
        setSubjectNames(createDefaultSubjectNames());
        return;
      }

      const data = snapshot.data();
      setSchoolName(data.schoolName ?? "Wellawa Central COllorge");
      setGradeName(data.gradeName ?? "11-B");
      setSubjectNames({
        ...createDefaultSubjectNames(),
        ...(data.subjectNames ?? {}),
      });
    });

    return () => unsubscribe();
  }, [generalSettingsRef]);

  async function handleLogin(e) {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) return;
    setIsLoggingIn(true);
    setLoginError("");

    try {
      await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      setLoginPassword("");
      if (typeof window !== "undefined") {
        window.history.replaceState({}, "", "/students");
      }
    } catch (error) {
      setLoginError(error?.message ?? "Unable to login. Please check credentials.");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleLogout() {
    await signOut(auth);
    setLoginPassword("");
    setLoginError("");
    if (typeof window !== "undefined") {
      window.history.replaceState({}, "", "/login");
    }
  }

  async function addStudent(name, roll) {
    if (!userId) return;
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const studentDocRef = await addDoc(studentsCollectionRef, {
      userId,
      name: trimmedName,
      indexNumber: roll.trim() || `STU-${students.length + 1}`,
    });

    const marksDocRef = doc(db, "marks", studentDocRef.id);
    await setDoc(
      marksDocRef,
      { userId, studentId: studentDocRef.id, marks: createEmptyMarks() },
      { merge: true }
    );
  }

  async function updateStudentDetails(studentId, name, roll) {
    if (!userId) return;
    const trimmedName = name.trim();
    if (!trimmedName) return;
    const existingStudent = students.find((student) => student.id === studentId);

    const studentRef = doc(db, "students", studentId);
    await updateDoc(studentRef, {
      name: trimmedName,
      indexNumber: roll.trim() || existingStudent?.indexNumber || "STU",
    });
  }

  async function addBulkStudents(rawText) {
    if (!userId) return;
    const rows = rawText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (rows.length === 0) return;

    const writePromises = rows.map(async (row, rowIndex) => {
      const [name = "", roll = ""] = row.split(",").map((value) => value.trim());
      if (!name) return;

      const studentDocRef = await addDoc(studentsCollectionRef, {
        userId,
        name,
        indexNumber: roll || `STU-${students.length + rowIndex + 1}`,
      });

      const marksDocRef = doc(db, "marks", studentDocRef.id);
      await setDoc(
        marksDocRef,
        { userId, studentId: studentDocRef.id, marks: createEmptyMarks() },
        { merge: true }
      );
    });

    await Promise.all(writePromises);
  }

  async function updateStudentMark(studentId, subject, value) {
    if (!userId) return;
    const cleanValue = value.replace(/[^\d.]/g, "");

    // Optimistic UI update so inputs respond instantly.
    setMarksByStudentId((current) => ({
      ...current,
      [studentId]: {
        ...(current[studentId] ?? {}),
        [subject]: cleanValue,
      },
    }));

    const marksRef = doc(db, "marks", studentId);
    await setDoc(
      marksRef,
      { userId, studentId, marks: { [subject]: cleanValue } },
      { merge: true }
    );
  }

  function handleArrowNavigation(e) {
    if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) return;

    const row = Number(e.currentTarget.dataset.row);
    const col = Number(e.currentTarget.dataset.col);
    if (Number.isNaN(row) || Number.isNaN(col)) return;

    let targetRow = row;
    let targetCol = col;

    if (e.key === "ArrowUp") targetRow = Math.max(0, row - 1);
    if (e.key === "ArrowDown") targetRow = Math.min(students.length - 1, row + 1);
    if (e.key === "ArrowLeft") targetCol = Math.max(0, col - 1);
    if (e.key === "ArrowRight") targetCol = Math.min(SUBJECTS.length - 1, col + 1);

    const nextInput = document.querySelector(
      `[data-row="${targetRow}"][data-col="${targetCol}"]`
    );
    if (!nextInput) return;

    e.preventDefault();
    nextInput.focus();
    nextInput.select();
  }

  async function deleteStudent(studentId) {
    if (!userId) return;
    const studentRef = doc(db, "students", studentId);
    const marksRef = doc(db, "marks", studentId);
    await Promise.allSettled([deleteDoc(studentRef), deleteDoc(marksRef)]);
  }

  async function handleSaveGeneralSettings({
    schoolName: nextSchool,
    gradeName: nextGrade,
    subjectNames: nextSubjectNames,
  }) {
    if (!generalSettingsRef) return;
    await setDoc(
      generalSettingsRef,
      {
        schoolName: nextSchool,
        gradeName: nextGrade,
        subjectNames: nextSubjectNames,
      },
      { merge: true }
    );
  }

  function getStudentTotal(student) {
    return SUBJECTS.reduce((total, subject) => {
      const mark = Number(student.marks[subject]);
      return Number.isNaN(mark) ? total : total + mark;
    }, 0);
  }

  if (!authReady) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-10">
        <div className="mx-auto max-w-md border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Loading...
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <LoginPage
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        handleLogin={handleLogin}
        loginError={loginError}
        isLoggingIn={isLoggingIn}
      />
    );
  }

  return (
    <BrowserRouter>
      <AppLayout
        schoolName={schoolName}
        gradeName={gradeName}
        onLogout={handleLogout}
      >
        <Routes>
          <Route path="/" element={<Navigate to="/students" replace />} />
          <Route
            path="/students"
            element={
              <StudentsPage
                students={students}
                getStudentTotal={getStudentTotal}
                onSelectStudent={setActiveStudentId}
                onDeleteStudent={deleteStudent}
              />
            }
          />
          <Route path="/students/new" element={<AddStudentPage onSaveStudent={addStudent} />} />
          <Route
            path="/students/edit/:studentId"
            element={
              <EditStudentPage
                students={students}
                onUpdateStudent={updateStudentDetails}
              />
            }
          />
          <Route
            path="/students/bulk"
            element={<BulkAddStudentsPage onBulkAddStudents={addBulkStudents} />}
          />
          <Route
            path="/marks"
            element={
              <MarksOverviewPage
                students={students}
                getStudentTotal={getStudentTotal}
              />
            }
          />
          <Route
            path="/marks/bulk"
            element={
              <MarksPage
                students={students}
                handleArrowNavigation={handleArrowNavigation}
                onEditStudent={updateStudentMark}
                subjectNames={subjectNames}
              />
            }
          />
          <Route
            path="/marks/single"
            element={
              <SingleMarksPage
                students={students}
                activeStudent={activeStudent}
                activeStudentId={activeStudentId}
                onSelectStudent={setActiveStudentId}
                updateStudentMark={updateStudentMark}
                subjectNames={subjectNames}
              />
            }
          />
          <Route
            path="/general"
            element={
              <GeneralPage
                schoolName={schoolName}
                gradeName={gradeName}
                subjectNames={subjectNames}
                onSave={handleSaveGeneralSettings}
              />
            }
          />
          <Route path="*" element={<Navigate to="/students" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;
