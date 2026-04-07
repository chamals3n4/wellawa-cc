import { jsPDF } from "jspdf";
import { SUBJECTS } from "../constants/subjects";

function drawCell(doc, text, x, y, width, height, align = "center") {
  doc.rect(x, y, width, height);
  const value = text == null || text === "" ? "-" : String(text);
  const tx = align === "left" ? x + 2 : x + width / 2;
  doc.text(value, tx, y + height / 2 + 1, { align });
}

export function exportSingleStudentReportPdf({
  student,
  totalMarks,
  place,
  schoolName,
  gradeName,
  termName,
  teacherName,
  subjectNames,
}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(schoolName || "School Name", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Grade ${gradeName || "Grade"} | ${termName || "Term"} Marks`, pageWidth / 2, 27, {
    align: "center",
  });
  doc.setFont("helvetica", "normal");
  doc.text(`Teacher Name - ${teacherName || "Teacher"}`, pageWidth / 2, 33, { align: "center" });

  let y = 42;
  doc.setDrawColor(90);
  doc.setLineWidth(0.25);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Student Name: ${student.name}`, margin + 4, y + 8);
  doc.text(`Index Number: ${student.indexNumber}`, margin + 4, y + 15);

  doc.text(`Total Marks: ${totalMarks}/900`, margin + contentWidth - 4, y + 8, { align: "right" });
  doc.text(`Class Place: ${place}`, margin + contentWidth - 4, y + 15, { align: "right" });

  y += 34;
  const headerHeight = 8;
  const rowHeight = 10;
  const subjectColWidth = 110;
  const marksColWidth = contentWidth - subjectColWidth;

  doc.setFont("helvetica", "bold");
  drawCell(doc, "Subject", margin, y, subjectColWidth, headerHeight, "left");
  drawCell(doc, "Marks", margin + subjectColWidth, y, marksColWidth, headerHeight);
  y += headerHeight;

  doc.setFont("helvetica", "normal");
  SUBJECTS.forEach((subjectKey) => {
    const label = subjectNames?.[subjectKey] ?? subjectKey;
    const mark = student.marks?.[subjectKey] ?? "";
    drawCell(doc, label, margin, y, subjectColWidth, rowHeight, "left");
    drawCell(doc, mark, margin + subjectColWidth, y, marksColWidth, rowHeight, "center");
    y += rowHeight;
  });

  const safeName = (student.name || "student").replace(/\s+/g, "-");
  const safeIndex = (student.indexNumber || "index").replace(/\s+/g, "-");
  doc.save(`student-report-${safeName}-${safeIndex}.pdf`);
}
