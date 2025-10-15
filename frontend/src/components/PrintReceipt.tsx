import { usePrint } from '@/hooks/usePrint';
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { useReceiptSettings } from '@/contexts/ReceiptSettingsContext';

interface PrintReceiptProps {
  data: {
    id: string;
    date: string;
    items: Array<{
      name: string;
      price: number;
      quantity: number;
      discount?: number;
      notes?: string;
    }>;
    subtotal: number;
    tax: number;
    total: number;
    paymentMethod: string;
    amountReceived?: number;
    change?: number;
  };
  disabled?: boolean; // Add disabled prop
  onPrint?: () => void; // Add onPrint callback prop
}

export function PrintReceipt({ data, disabled = false, onPrint }: PrintReceiptProps) {
  const { settings } = useReceiptSettings();
  const { componentRef, handlePrint, isPrinting } = usePrint({
    title: 'Receipt',
    styles: `
      @media print {
        @page {
          margin: 0.4in;
          size: auto;
        }
        body {
          margin: 0.4in;
          padding: 0;
        }
      }
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 15px;
        font-size: 12px;
        line-height: 1.4;
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
      }
      .receipt {
        width: 100%;
        max-width: 300px;
        margin: 0 auto;
      }
      .receipt-header {
        text-align: center;
        border-bottom: 1px solid #000;
        padding-bottom: 10px;
        margin-bottom: 10px;
      }
      .receipt-header h2 {
        margin: 0 0 5px 0;
        font-size: 16px;
      }
      .receipt-header p {
        margin: 2px 0;
        font-size: 10px;
      }
      .receipt-info {
        margin-bottom: 10px;
      }
      .receipt-info div {
        display: flex;
        justify-content: space-between;
        font-size: 10px;
      }
      .receipt-items {
        border-top: 1px solid #000;
        border-bottom: 1px solid #000;
        padding: 10px 0;
        margin: 10px 0;
      }
      .receipt-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
        font-size: 10px;
      }
      .receipt-item-name {
        flex: 1;
        text-align: left;
      }
      .receipt-item-price {
        text-align: right;
      }
      .receipt-totals {
        font-size: 10px;
      }
      .receipt-totals div {
        display: flex;
        justify-content: space-between;
        margin-bottom: 3px;
      }
      .receipt-totals .total {
        font-weight: bold;
        border-top: 1px solid #000;
        padding-top: 5px;
        margin-top: 5px;
      }
      .receipt-footer {
        text-align: center;
        margin-top: 15px;
        font-size: 10px;
      }
    `
  });

  const handlePrintWithCallback = () => {
    handlePrint();
    // Call the onPrint callback after a delay to ensure printing is complete
    if (onPrint) {
      setTimeout(onPrint, 2000);
    }
  };

  return (
    <>
      <Button 
        onClick={handlePrintWithCallback} 
        className="flex items-center gap-2 w-full"
        disabled={disabled || isPrinting}
      >
        <Printer className="h-4 w-4" />
        {isPrinting ? 'Preparing Receipt...' : disabled ? 'Process Payment First' : 'Print Receipt'}
      </Button>

      {/* Hidden component for printing */}
      <div ref={componentRef} className="hidden">
        <div className="receipt">
          <div className="receipt-header">
            <h2>{settings.header}</h2>
            <p>{settings.addressLine1}</p>
            <p>{settings.addressLine2}</p>
          </div>
          
          <div className="receipt-info">
            <div><span>Receipt #:</span> <span>{data.id}</span></div>
            <div><span>Date:</span> <span>{data.date}</span></div>
          </div>
          
          <div className="receipt-items">
            {data.items.map((item, index) => (
              <div key={index} className="receipt-item">
                <div className="receipt-item-name">
                  {item.name}
                  <div>x{item.quantity} {item.discount && item.discount > 0 && settings.showDiscounts ? `(-${formatCurrency(item.discount)})` : ''}</div>
                  {item.notes && <div className="notes">{item.notes}</div>}
                </div>
                <div className="receipt-item-price">{formatCurrency(item.price * item.quantity - (item.discount || 0))}</div>
              </div>
            ))}
          </div>
          
          <div className="receipt-totals">
            <div><span>Subtotal:</span> <span>{formatCurrency(data.subtotal)}</span></div>
            {settings.showTax && (
              <div><span>Tax (18%):</span> <span>{formatCurrency(data.tax)}</span></div>
            )}
            <div className="total"><span>Total:</span> <span>{formatCurrency(data.total)}</span></div>
            {data.amountReceived !== undefined && (
              <>
                <div><span>Amount Received:</span> <span>{formatCurrency(data.amountReceived)}</span></div>
                <div className="total"><span>Change:</span> <span>{formatCurrency(data.change || 0)}</span></div>
              </>
            )}
          </div>
          
          <div className="receipt-footer">
            <p>Payment Method: {settings.paymentMethod}</p>
            <p>{settings.footer}</p>
          </div>
        </div>
      </div>
    </>
  );
}