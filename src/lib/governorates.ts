export const GOVERNORATES = [
  { id: "baghdad", name: "Baghdad", nameAr: "بغداد" },
  { id: "basra", name: "Basra", nameAr: "البصرة" },
  { id: "nineveh", name: "Nineveh", nameAr: "نينوى" },
  { id: "anbar", name: "Anbar", nameAr: "الأنبار" },
  { id: "kirkuk", name: "Kirkuk", nameAr: "كركوك" },
  { id: "salahdin", name: "Salah al-Din", nameAr: "صلاح الدين" },
  { id: "diyala", name: "Diyala", nameAr: "ديالى" },
  { id: "babil", name: "Babil", nameAr: "بابل" },
  { id: "karbala", name: "Karbala", nameAr: "كربلاء" },
  { id: "najaf", name: "Najaf", nameAr: "النجف" },
  { id: "wasit", name: "Wasit", nameAr: "واسط" },
  { id: "maysan", name: "Maysan", nameAr: "ميسان" },
  { id: "dhiqar", name: "Dhi Qar", nameAr: "ذي قار" },
  { id: "muthanna", name: "Al-Muthanna", nameAr: "المثنى" },
  { id: "qadisiyyah", name: "Al-Qadisiyyah", nameAr: "القادسية" },
  { id: "erbil", name: "Erbil", nameAr: "أربيل" },
  { id: "sulaymaniyah", name: "Sulaymaniyah", nameAr: "السليمانية" },
  { id: "duhok", name: "Duhok", nameAr: "دهوك" },
] as const;

export type GovernorateId = typeof GOVERNORATES[number]["id"];
