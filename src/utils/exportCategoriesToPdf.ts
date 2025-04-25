import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportCategoriesToPDF = (categories: any[]) => {
  const doc = new jsPDF("p", "pt", "a4"); // A4 size, points unit
  const pageWidth = doc.internal.pageSize.getWidth();

  // 🏷️ Add a Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Monthly Budget Summary", pageWidth / 2, 60, { align: "center" });

  let currentY = 100; // Start position for content
  let totalSpent = 0;

  categories.forEach((cat: any) => {
    // 🟦 Draw category header
    doc.setFillColor(240, 240, 240); // Light gray box
    doc.rect(40, currentY, pageWidth - 80, 30, "F"); // x, y, width, height, F=fill
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.text(cat.title, 50, currentY + 20);

    currentY += 45;

    cat.subcategories.forEach((sub: any) => {
      const amount = parseFloat(sub.value || "0") || 0;
      totalSpent += amount;

      doc.setFontSize(12);
      doc.setTextColor(80, 80, 80);

      // Subcategory Label
      doc.text(sub.label, 60, currentY);

      // Amount (right aligned)
      doc.text(`$${amount.toFixed(2)}`, pageWidth - 80, currentY, { align: "right" });

      currentY += 25;

      // If near bottom, create new page
      if (currentY > 750) {
        doc.addPage();
        currentY = 50;
      }
    });

    currentY += 20; // Gap after each category
  });

  // 🧾 Add Total Spent at bottom
  currentY += 10;
  doc.setDrawColor(200, 200, 200);
  doc.line(40, currentY, pageWidth - 40, currentY); // horizontal line
  currentY += 20;

  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(`Total Spent: $${totalSpent.toFixed(2)}`, pageWidth / 2, currentY, { align: "center" });

  doc.save("budget-summary.pdf");
};
