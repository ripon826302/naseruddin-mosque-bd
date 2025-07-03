
// Bengali numerals conversion
const toBengaliNumber = (num: number): string => {
  const bengaliNumerals = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().split('').map(digit => bengaliNumerals[parseInt(digit)]).join('');
};

export const getBengaliDate = (): string => {
  const now = new Date();
  const bengaliMonths = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  
  const date = toBengaliNumber(now.getDate());
  const month = bengaliMonths[now.getMonth()];
  const year = toBengaliNumber(now.getFullYear());
  
  return `${date} ${month}, ${year}`;
};

export const getBengaliBanglaDate = (): string => {
  // Simplified Bangla calendar - in real app use proper conversion
  const now = new Date();
  const bengaliMonths = [
    'বৈশাখ', 'জ্যৈষ্ঠ', 'আষাঢ়', 'শ্রাবণ', 'ভাদ্র', 'আশ্বিন',
    'কার্তিক', 'অগ্রহায়ণ', 'পৌষ', 'মাঘ', 'ফাল্গুন', 'চৈত্র'
  ];
  
  const date = toBengaliNumber(now.getDate());
  const month = bengaliMonths[now.getMonth()];
  const year = toBengaliNumber(now.getFullYear() - 593); // Approximate conversion
  
  return `${date} ${month}, ${year}`;
};

export const getArabicHijriDate = (): string => {
  // Simplified Hijri calendar - in real app use proper conversion
  const now = new Date();
  const hijriMonths = [
    'মহরম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি', 'জমাদিউল আউয়াল', 'জমাদিউস সানি',
    'রজব', 'শাবান', 'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ'
  ];
  
  const date = toBengaliNumber(now.getDate());
  const month = hijriMonths[now.getMonth()];
  const year = toBengaliNumber(now.getFullYear() - 579); // Approximate conversion
  
  return `${date} ${month}, ${year}`;
};

export const getEnglishDate = (): string => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const getArabicDate = (): string => {
  // This is a simplified Arabic date - in a real app you'd use a proper Hijri calendar library
  return new Date().toLocaleDateString('ar-SA', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0
  }).format(amount);
};
