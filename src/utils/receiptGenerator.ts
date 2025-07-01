
export const generateReceiptNumber = (type: 'income' | 'expense'): string => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const time = now.getTime().toString().slice(-6);
  
  const prefix = type === 'income' ? 'IN' : 'EX';
  return `${prefix}${year}${month}${day}${time}`;
};
