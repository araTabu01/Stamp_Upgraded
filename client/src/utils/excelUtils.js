import * as XLSX from "xlsx";

// Function to export data to Excel
export const exportToExcel = (formDataList) => {
  // Create a new Excel workbook
  const workbook = XLSX.utils.book_new();

  // Convert formDataList to worksheet
  const worksheet = XLSX.utils.json_to_sheet(formDataList);

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Stamp Management Data");

  // Save the workbook as a file
  XLSX.writeFile(workbook, "stamp_management_data.xlsx");
};
