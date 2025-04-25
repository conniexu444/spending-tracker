import * as XLSX from "xlsx";

export const exportCategoriesToExcel = (categories: any[]) => {
  const rows: any[] = [];

  rows.push(["My Monthly Budget", "", ""]);
  rows.push(["", "", ""]);

  categories.forEach((cat) => {
    rows.push([cat.title, "", ""]);

    cat.subcategories.forEach((sub: any) => {
      rows.push([
        "",
        sub.label,
        parseFloat(sub.value || "0"),
      ]);
    });

    rows.push(["", "", ""]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
  ];

  worksheet["A1"].s = {
    font: { bold: true, sz: 16 },
    alignment: { horizontal: "center", vertical: "center" },
  };

  let rowIndex = 3;

  categories.forEach((cat) => {
    const headerCell = `A${rowIndex}`;
    if (worksheet[headerCell]) {
      worksheet[headerCell].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "D9E1F2" } }, // Light blue
        alignment: { horizontal: "center" },
        border: {
          bottom: { style: "thin", color: { rgb: "000000" } },
        },
      };
    }

    cat.subcategories.forEach((sub: any, idx: number) => {
      const subRow = rowIndex + idx + 1;

      if (subRow % 2 === 0) { 
        const subLabelCell = `B${subRow}`;
        const amountCell = `C${subRow}`;

        if (worksheet[subLabelCell]) {
          worksheet[subLabelCell].s = {
            fill: { fgColor: { rgb: "F2F2F2" } },
          };
        }
        if (worksheet[amountCell]) {
          worksheet[amountCell].s = {
            fill: { fgColor: { rgb: "F2F2F2" } },
          };
        }
      }
    });

    rowIndex += cat.subcategories.length + 2;
  });

  const amountCol = "C";
  let totalRows = rows.length;
  for (let i = 3; i <= totalRows; i++) {
    const cellRef = `${amountCol}${i}`;
    if (worksheet[cellRef] && typeof worksheet[cellRef].v === "number") {
      worksheet[cellRef].z = "$#,##0.00"; 
  }

  const colWidths = [
    { wch: 30 }, // A: Category
    { wch: 25 }, // B: Subcategory
    { wch: 15 }, // C: Amount
  ];
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Budget");

  XLSX.writeFile(workbook, "budget-export.xlsx", { cellStyles: true });
}};
