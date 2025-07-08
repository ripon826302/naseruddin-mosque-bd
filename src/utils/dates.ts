
export const formatCurrency = (amount: number): string => {
  return `৳${amount.toLocaleString('bn-BD')}`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('bn-BD');
};

export const getCurrentMonth = (): string => {
  const months = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  
  return months[new Date().getMonth()];
};

export const getAllMonths = (): string[] => {
  return [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
};

export const generateReceiptNumber = (): string => {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  
  return `R${year}${month}${day}${random}`;
};

export const getBengaliDate = (): string => {
  const date = new Date();
  return date.toLocaleDateString('bn-BD', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getBengaliBanglaDate = (): string => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('bn-BD', options);
};

export const getArabicHijriDate = (): string => {
  const date = new Date();
  try {
    return date.toLocaleDateString('ar-SA-u-ca-islamic', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};
