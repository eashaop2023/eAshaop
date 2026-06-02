import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Button, Box } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

const PdfReceiptDownloader = ({ receipt, children }) => {
  const pdfRef = useRef();

  const handleDownloadPdf = async () => {
    const element = pdfRef.current;

    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
    });

    // 👉 Use JPEG instead of PNG
    const imgData = canvas.toDataURL('image/jpeg', 1.0);

    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Receipt-${receipt?.appointmentNumber || 'file'}.pdf`);
  };

  return (
    <>
      <Box display='flex' justifyContent='flex-end' mb={2}>
        <Button variant='contained' startIcon={<DownloadIcon />} onClick={handleDownloadPdf}>
          Download PDF
        </Button>
      </Box>

      <div ref={pdfRef}>{children}</div>
    </>
  );
};

export default PdfReceiptDownloader;
