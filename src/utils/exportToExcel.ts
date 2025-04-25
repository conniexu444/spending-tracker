import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import type { BorderStyle } from "exceljs";

export const exportCategoriesToExcelWithStyle = async (categories: any[]) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Budget");
  const thin: BorderStyle = "thin";

  const borderStyle = {
    top: { style: thin },
    bottom: { style: thin },
    left: { style: thin },
    right: { style: thin },
  };

  // Title
  const titleRow = sheet.addRow(["My Monthly Budget"]);
  titleRow.font = { bold: true, size: 18 };
  sheet.mergeCells("A1:B1");

  sheet.addRow([]); // spacer

  let totalSpent = 0;

  categories.forEach((cat: any) => {
    // Category Header
    const catRow = sheet.addRow([cat.title]);
    catRow.font = { bold: true };
    catRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "D0D7FF" },
    };
    sheet.mergeCells(`A${catRow.number}:B${catRow.number}`);

    // Apply border to the merged cell
    catRow.getCell(1).border = borderStyle;

    // Subcategories
    cat.subcategories.forEach((sub: any, idx: number) => {
      const amount = parseFloat(sub.value || "0") || 0;
      totalSpent += amount;

      const row = sheet.addRow([sub.label, amount]);
      row.getCell(2).numFmt = '"$"#,##0.00';

      // 🦓 Zebra striping
      if (idx % 2 === 0) {
        row.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "F2F2F2" },
        };
      }

      // ✍️ Apply grid borders to both cells
      row.getCell(1).border = borderStyle;
      row.getCell(2).border = borderStyle;
    });

    sheet.addRow([]); // spacer
  });

  // Total Row
  const totalRow = sheet.addRow(["Total Spent", totalSpent]);
  totalRow.font = { bold: true };
  totalRow.getCell(2).numFmt = '"$"#,##0.00';

  totalRow.getCell(1).border = borderStyle;
  totalRow.getCell(2).border = borderStyle;

  // Auto-width
  sheet.columns.forEach((col) => {
    if (!col) return;
    let maxLength = 0;
    col.eachCell?.({ includeEmpty: true }, (cell) => {
      const len = cell.value?.toString().length ?? 10;
      if (len > maxLength) maxLength = len;
    });
    col.width = maxLength + 4;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, "budget-export.xlsx");
};
