// import React, { useEffect, useState, useRef } from 'react';
// import { Document, Page, pdfjs } from 'react-pdf';

// //import { pdfjs } from 'react-pdf';

// // pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.269/build/pdf.worker.min.mjs';
// pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.269/build/pdf.worker.min.mjs';

// //pdfjs.GlobalWorkerOptions.workerSrc = '/pdf-worker/pdf.worker.min.mjs';

// const PDFViewer = ({ file, onTextExtracted, currentPage, }) => {
//   const [numPages, setNumPages] = useState(null);
//   const pageRefs = useRef([]); // To store page elements references

//   useEffect(() => {
//     const extractTextFromPDF = async () => {
//       let pdfData;

//       if (file instanceof File) {
//         const arrayBuffer = await file.arrayBuffer();
//         pdfData = { data: arrayBuffer };
//       } else {
//         pdfData = { url: file };
//       }

//       const pdf = await pdfjs.getDocument(pdfData).promise;
//       setNumPages(pdf.numPages);

//       let fullText = '';
//       const pageTexts = [];

//       for (let i = 1; i <= pdf.numPages; i++) {
//         const page = await pdf.getPage(i);
//         const content = await page.getTextContent();
//         const text = content.items.map(item => item.str).join(' ');
//         fullText += text + '\n';
//         pageTexts.push(text);
//       }

//       onTextExtracted(fullText, pageTexts);
//     };

//     if (file) extractTextFromPDF();
//   }, [file, onTextExtracted]);

//   useEffect(() => {
//     // Highlighting the current page while reading
//     if (currentPage !== null && pageRefs.current[currentPage - 1]) {
//       const pageElement = pageRefs.current[currentPage - 1];
//       pageElement.scrollIntoView({
//         behavior: 'smooth',
//         block: 'center',
//       });
//     }
//   }, [currentPage]);

//   return (
//     <div>
//       <Document file={file}>
//         {Array.from(new Array(numPages), (_, index) => (
//           <div
//             key={`page_${index + 1}`}
//             ref={(el) => (pageRefs.current[index] = el)} // Store page reference
//             style={{
//               position: 'relative',
//               marginBottom: '20px',
//               border: currentPage === index + 1 ? '2px solid blue' : 'none', // Highlight the current page
//             }}
//           >
//             <Page key={`page_${index + 1}`} pageNumber={index + 1} width={600} />
//             {currentPage === index + 1 && (
//               <div
//                 style={{
//                   position: 'absolute',
//                   top: '10px',
//                   left: '10px',
//                   color: 'blue',
//                   fontWeight: 'bold',
//                   zIndex: 10,
//                 }}
//               >
//                 Reading...
//               </div>
//             )}
//           </div>
//         ))}
//       </Document>
//     </div>
//   );
// };
//pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
// export default PDFViewer;

import React, { useEffect, useState, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set the correct worker path for pdfjs-dist v2.x (compatible with react-pdf v7.x)
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PDFViewer = ({ file, onTextExtracted, currentPage }) => {
  const [numPages, setNumPages] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const pageRefs = useRef([]);

  useEffect(() => {
    const extractTextFromPDF = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        let pdfData;
        if (file instanceof File) {
          const arrayBuffer = await file.arrayBuffer();
          pdfData = { data: arrayBuffer };
        } else {
          pdfData = { url: file };
        }

        const pdf = await pdfjs.getDocument(pdfData).promise;
        setNumPages(pdf.numPages);

        let fullText = '';
        const pageTexts = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const text = content.items.map(item => item.str).join(' ');
          fullText += text + '\n';
          pageTexts.push(text);
        }

        onTextExtracted(fullText, pageTexts);
      } catch (err) {
        console.error('Error processing PDF:', err);
        setError('Failed to load PDF. Please try another file.');
      } finally {
        setIsLoading(false);
      }
    };

    if (file) extractTextFromPDF();
  }, [file, onTextExtracted]);

  useEffect(() => {
    if (currentPage !== null && pageRefs.current[currentPage - 1]) {
      const pageElement = pageRefs.current[currentPage - 1];
      pageElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentPage]);

  if (error) {
    return <div className="pdf-error">{error}</div>;
  }

  if (isLoading) {
    return <div className="pdf-loading">Loading PDF...</div>;
  }

  return (
    <div className="pdf-viewer">
      <Document 
        file={file}
        loading={<div>Loading document...</div>}
        error={<div>Failed to load document.</div>}
      >
        {Array.from(new Array(numPages), (_, index) => (
          <div
            key={`page_${index + 1}`}
            ref={(el) => (pageRefs.current[index] = el)}
            className={`pdf-page ${currentPage === index + 1 ? 'active-page' : ''}`}
          >
            <Page 
              key={`page_${index + 1}`} 
              pageNumber={index + 1} 
              width={600}
              loading={<div>Loading page {index + 1}...</div>}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
            {currentPage === index + 1 && (
              <div className="reading-indicator">Reading...</div>
            )}
          </div>
        ))}
      </Document>
    </div>
  );
};

export default PDFViewer;