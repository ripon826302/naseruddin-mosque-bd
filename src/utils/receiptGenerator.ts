
export interface ReceiptData {
  receiptNumber: string;
  date: string;
  donorName?: string;
  amount: number;
  type: string;
  month?: string;
  mosqueInfo: {
    name: string;
    address: string;
    phone: string;
  };
}

export const generateReceiptNumber = (type: string = 'income'): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  const prefix = type === 'income' ? 'I' : 'E';
  return `${prefix}${year}${month}${day}${random}`;
};

export const generateReceipt = (data: ReceiptData): string => {
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>রসিদ - ${data.receiptNumber}</title>
    <style>
        body { font-family: 'SolaimanLipi', Arial, sans-serif; margin: 0; padding: 20px; }
        .receipt { max-width: 400px; margin: 0 auto; border: 2px solid #000; padding: 20px; }
        .header { text-align: center; border-bottom: 1px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
        .mosque-name { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
        .mosque-details { font-size: 12px; color: #666; }
        .receipt-title { font-size: 16px; font-weight: bold; text-align: center; margin: 15px 0; }
        .details { margin: 15px 0; }
        .detail-row { display: flex; justify-content: space-between; margin: 8px 0; }
        .amount { font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; }
        .footer { border-top: 1px solid #000; padding-top: 15px; margin-top: 20px; text-align: center; font-size: 12px; }
        @media print { body { margin: 0; } }
    </style>
</head>
<body>
    <div class="receipt">
        <div class="header">
            <div class="mosque-name">${data.mosqueInfo.name}</div>
            <div class="mosque-details">
                ${data.mosqueInfo.address}<br>
                ফোন: ${data.mosqueInfo.phone}
            </div>
        </div>
        
        <div class="receipt-title">আয়ের রসিদ</div>
        
        <div class="details">
            <div class="detail-row">
                <span>রসিদ নং:</span>
                <span>${data.receiptNumber}</span>
            </div>
            <div class="detail-row">
                <span>তারিখ:</span>
                <span>${new Date(data.date).toLocaleDateString('bn-BD')}</span>
            </div>
            ${data.donorName ? `
            <div class="detail-row">
                <span>দাতার নাম:</span>
                <span>${data.donorName}</span>
            </div>
            ` : ''}
            <div class="detail-row">
                <span>প্রকার:</span>
                <span>${data.type}</span>
            </div>
            ${data.month ? `
            <div class="detail-row">
                <span>মাস:</span>
                <span>${data.month}</span>
            </div>
            ` : ''}
        </div>
        
        <div class="amount">
            পরিমাণ: ৳${data.amount.toLocaleString('bn-BD')}
        </div>
        
        <div class="footer">
            <div>ধন্যবাদ</div>
            <div style="margin-top: 10px;">কোষাধ্যক্ষের স্বাক্ষর: ________________</div>
        </div>
    </div>
    
    <script>
        window.onload = function() {
            window.print();
        }
    </script>
</body>
</html>
  `.trim();
};

export const printReceipt = (data: ReceiptData): void => {
  const receiptHTML = generateReceipt(data);
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
  }
};
