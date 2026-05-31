'use client';

import { useState } from 'react';
import { FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface ExportColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => string | number | null | undefined);
}

interface ExportOptionsProps<T> {
  columns: ExportColumn<T>[];
  data: T[];
  fileName: string;
  title: string;
}

export function ExportOptions<T>({
  columns,
  data,
  fileName,
  title,
}: ExportOptionsProps<T>) {
  const [exporting, setExporting] = useState<'xlsx' | 'pdf' | null>(null);

  const getValue = (row: T, column: ExportColumn<T>) => {
    const value =
      typeof column.accessor === 'function'
        ? column.accessor(row)
        : row[column.accessor];

    return value ?? '';
  };

  const buildRows = () =>
    data.map((row) =>
      columns.reduce<Record<string, string | number>>((acc, column) => {
        const value = getValue(row, column);
        acc[column.header] =
          typeof value === 'number' ? value : String(value);
        return acc;
      }, {})
    );

  const handleExportXLSX = async () => {
    setExporting('xlsx');
    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const worksheet = XLSX.utils.json_to_sheet(buildRows());
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, title.slice(0, 31));
      XLSX.writeFile(workbook, `${fileName}.xlsx`);
    } finally {
      setExporting(null);
    }
  };

  const handleExportPDF = async () => {
    setExporting('pdf');
    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const doc = new jsPDF({ orientation: 'landscape' });
      doc.setFontSize(16);
      doc.text(title, 14, 18);
      doc.setFontSize(9);
      doc.text(`Generated ${new Date().toLocaleString()}`, 14, 25);

      autoTable(doc, {
        startY: 32,
        head: [columns.map((column) => column.header)],
        body: data.map((row) =>
          columns.map((column) => String(getValue(row, column)))
        ),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [30, 64, 175], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });

      doc.save(`${fileName}.pdf`);
    } finally {
      setExporting(null);
    }
  };

  const disabled = data.length === 0 || exporting !== null;

  return (
    <div
      className="inline-flex overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
      aria-label="Export options"
    >
      <button
        type="button"
        onClick={handleExportXLSX}
        disabled={disabled}
        title="Download Excel (XLSX)"
        className="inline-flex h-10 items-center gap-2 border-r border-gray-200 px-3 text-sm font-semibold text-gray-700 transition hover:bg-green-50 hover:text-[#107C41] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {exporting === 'xlsx' ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <FileSpreadsheet size={16} className="text-[#107C41]" />
        )}
        <span className="hidden sm:inline">Excel</span>
      </button>
      <button
        type="button"
        onClick={handleExportPDF}
        disabled={disabled}
        title="Download PDF"
        className="inline-flex h-10 items-center gap-2 px-3 text-sm font-semibold text-gray-700 transition hover:bg-red-50 hover:text-[#D32F2F] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {exporting === 'pdf' ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <FileText size={16} className="text-[#D32F2F]" />
        )}
        <span className="hidden sm:inline">PDF</span>
      </button>
    </div>
  );
}
