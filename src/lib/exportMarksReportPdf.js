import { jsPDF } from "jspdf";
import { SUBJECTS } from "../constants/subjects";

function drawCell(doc, text, x, y, width, height, align = "center") {
  doc.rect(x, y, width, height);
  const value = text == null || text === "" ? "-" : String(text);
  const tx = align === "left" ? x + 2 : x + width / 2;
  doc.text(value, tx, y + height / 2 + 1, { align });
}

export function exportMarksReportPdf({
  rankedStudents,
  schoolName,
  gradeName,
  termName,
  teacherName,
  subjectNames,
}) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const rowHeight = 7;
  const bottomLimit = pageHeight - margin;

  const columns = [
    { key: "place", label: "Place", width: 10, align: "center" },
    { key: "name", label: "Student Name", width: 52, align: "left" },
    { key: "indexNumber", label: "Index", width: 20, align: "center" },
    ...SUBJECTS.map((subject) => ({
      key: subject,
      label: subjectNames?.[subject] ?? subject,
      width: 20,
      align: "center",
    })),
    { key: "total", label: "Total", width: 12, align: "center" },
  ];
  const tableWidth = columns.reduce((acc, column) => acc + column.width, 0);
  const tableStartX = (pageWidth - tableWidth) / 2;

  function drawHeaderBlock() {
    const titleY = margin + 6;
    const subtitleY = titleY + 8;
    const teacherY = subtitleY + 7;
    const headerBottomY = teacherY + 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(schoolName || "School Name", pageWidth / 2, titleY, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.text(
      `Grade ${gradeName || "Grade"} | ${termName || "Term"} Marks`,
      pageWidth / 2,
      subtitleY,
      { align: "center" }
    );
    doc.setFontSize(12);
    doc.text(`Teacher Name - ${teacherName || "Teacher"}`, pageWidth / 2, teacherY, {
      align: "center",
    });

    doc.setDrawColor(180);
    doc.setLineWidth(0.2);
    doc.line(margin, headerBottomY, pageWidth - margin, headerBottomY);

    return headerBottomY + 4;
  }

  function drawTableHeader(startY) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    let x = tableStartX;
    columns.forEach((column) => {
      drawCell(doc, column.label, x, startY, column.width, rowHeight, "center");
      x += column.width;
    });
    return startY + rowHeight;
  }

  let y = drawHeaderBlock();
  y = drawTableHeader(y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);

  const rows = rankedStudents.length > 0 ? rankedStudents : [{ name: "No students found." }];

  rows.forEach((student, rowIndex) => {
    if (y + rowHeight > bottomLimit) {
      doc.addPage();
      y = margin;
      y = drawTableHeader(y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
    }

    let x = margin;
    if (student.total == null) {
      drawCell(doc, student.name, tableStartX, y, tableWidth, rowHeight);
      y += rowHeight;
      return;
    }
    x = tableStartX;

    columns.forEach((column) => {
      let value = "";
      if (column.key === "place") value = student.place;
      else if (column.key === "name") value = student.name;
      else if (column.key === "indexNumber") value = student.indexNumber;
      else if (column.key === "total") value = student.total;
      else value = student.marks?.[column.key] ?? "";

      drawCell(doc, value, x, y, column.width, rowHeight, column.align);
      x += column.width;
    });

    y += rowHeight;
    if (rowIndex === rows.length - 1) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(8);
      doc.text(`Generated on ${new Date().toLocaleString()}`, margin, bottomLimit + 2);
    }
  });

  const cleanGrade = (gradeName || "grade").replace(/\s+/g, "-");
  const cleanTerm = (termName || "term").replace(/\s+/g, "-");
  doc.save(`marks-report-${cleanGrade}-${cleanTerm}.pdf`);
}
