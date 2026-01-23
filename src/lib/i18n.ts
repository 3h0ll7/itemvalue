export type Language = 'ar' | 'en';

export const translations = {
  ar: {
    // Header
    appName: 'بلّه',
    priceEstimator: 'مُقدّر الأسعار',
    
    // Hero
    heroTitle: 'شكد تسوه؟',
    heroDescription: 'الأسماء الزينة ما تشرح نفسها، تخلي المستخدم يجرّب. وهذا واحد منها.',
    
    // Governorate Selection
    selectGovernorate: 'اختر المحافظة',
    
    // Upload Screen
    uploadTitle: 'رفع صورة',
    takePhoto: 'التقط صورة',
    uploadFile: 'اختر من الملفات',
    orText: 'أو',
    analyzeButton: 'حلّل السعر',
    retakePhoto: 'صورة جديدة',
    changeLocation: 'غيّر الموقع',
    uploadHint: 'صوّر الشي اللي تبيعه',
    
    // Analyzing Screen
    analyzingTitle: 'جاري التحليل',
    identifyingItem: 'التعرف على الشي',
    searchingMarket: 'البحث بالسوق',
    calculatingPrice: 'حساب السعر',
    analyzingHint: 'هذا عادةً ياخذ ثواني',
    
    // Results Screen
    resultsTitle: 'النتيجة',
    condition: 'الحالة',
    suggestedPrice: 'السعر المقترح',
    priceRange: 'نطاق الأسعار',
    lowest: 'الأقل',
    average: 'المتوسط',
    highest: 'الأعلى',
    sellingStrategy: 'استراتيجية البيع',
    similarListings: 'إعلانات مشابهة',
    priceAnother: 'سعّر شي ثاني',
    startOver: 'ابدأ من جديد',
    
    // Footer
    poweredBy: 'مدعوم بالذكاء الاصطناعي',
    pricesIn: 'الأسعار بالدينار العراقي',
    
    // Errors
    errorTitle: 'صار خطأ',
    tryAgain: 'حاول مرة ثانية',
  },
  en: {
    // Header
    appName: 'BALLA',
    priceEstimator: 'price estimator',
    
    // Hero
    heroTitle: 'What\'s it worth?',
    heroDescription: 'The good names don\'t explain themselves, they let the user try. And this is one of them.',
    
    // Governorate Selection
    selectGovernorate: 'Select Governorate',
    
    // Upload Screen
    uploadTitle: 'Upload Photo',
    takePhoto: 'Take Photo',
    uploadFile: 'Choose from Files',
    orText: 'or',
    analyzeButton: 'Analyze Price',
    retakePhoto: 'Retake Photo',
    changeLocation: 'Change Location',
    uploadHint: 'Photograph the item you want to sell',
    
    // Analyzing Screen
    analyzingTitle: 'Analyzing',
    identifyingItem: 'Identifying item',
    searchingMarket: 'Searching market data',
    calculatingPrice: 'Calculating price',
    analyzingHint: 'This usually takes a few seconds',
    
    // Results Screen
    resultsTitle: 'Results',
    condition: 'Condition',
    suggestedPrice: 'Suggested Price',
    priceRange: 'Price Range',
    lowest: 'Lowest',
    average: 'Average',
    highest: 'Highest',
    sellingStrategy: 'Selling Strategy',
    similarListings: 'Similar Listings',
    priceAnother: 'Price Another Item',
    startOver: 'Start Over',
    
    // Footer
    poweredBy: 'Powered by AI',
    pricesIn: 'Prices in IQD',
    
    // Errors
    errorTitle: 'Error Occurred',
    tryAgain: 'Try Again',
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key];
}

export function isRTL(lang: Language): boolean {
  return lang === 'ar';
}
