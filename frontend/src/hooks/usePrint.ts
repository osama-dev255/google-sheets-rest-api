import { useRef, useState } from 'react';

interface PrintOptions {
  title?: string;
  styles?: string;
}

export function usePrint(options?: PrintOptions) {
  const componentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrint = () => {
    setIsPrinting(true);
    const printContent = componentRef.current;
    if (!printContent) {
      setIsPrinting(false);
      return;
    }

    // Check if we're on a mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
      // For mobile devices, use a different approach
      handleMobilePrint(printContent, options);
    } else {
      // For desktop, use the existing approach
      handleDesktopPrint(printContent, options);
    }
  };

  const handleDesktopPrint = (printContent: HTMLDivElement, options?: PrintOptions) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this site to enable printing');
      setIsPrinting(false);
      return;
    }

    const title = options?.title || 'Print';
    const styles = options?.styles || '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            @media print {
              @page {
                margin: 0.5in;
                size: auto;
              }
              body {
                margin: 0.5in;
                padding: 0;
                font-size: 12px;
                line-height: 1.4;
              }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              font-size: 12px;
              line-height: 1.4;
            }
            ${styles}
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <script>
            // Add a small delay to ensure content is fully loaded before printing
            setTimeout(function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }, 300);
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Reset printing state after a short delay
    setTimeout(() => {
      setIsPrinting(false);
    }, 2000);
  };

  const handleMobilePrint = (printContent: HTMLDivElement, options?: PrintOptions) => {
    // For mobile, create a print-friendly page in the same window
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow popups for this site to enable printing');
      setIsPrinting(false);
      return;
    }

    const title = options?.title || 'Print';
    const styles = options?.styles || '';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${title}</title>
          <style>
            @media print {
              @page {
                margin: 0.4in;
                size: auto;
              }
              body {
                margin: 0.4in;
                padding: 0;
                font-size: 12px;
                line-height: 1.4;
              }
              .print-button {
                display: none;
              }
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 20px;
              font-size: 12px;
              line-height: 1.4;
              width: 100%;
              max-width: 300px;
              margin: 0 auto;
            }
            ${styles}
            .print-button {
              display: block;
              width: 100%;
              padding: 15px;
              background-color: #007bff;
              color: white;
              border: none;
              font-size: 16px;
              margin: 20px 0;
              border-radius: 5px;
              cursor: pointer;
            }
            .print-button:hover {
              background-color: #0056b3;
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
          <button class="print-button" onclick="window.print()">Tap to Print Receipt</button>
          <script>
            // Auto-focus on the print button for better mobile experience
            setTimeout(function() {
              const printButton = document.querySelector('.print-button');
              if (printButton) {
                printButton.focus();
              }
            }, 500);
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
    
    // Reset printing state after a short delay
    setTimeout(() => {
      setIsPrinting(false);
    }, 2000);
  };

  return {
    componentRef,
    handlePrint,
    isPrinting
  };
}