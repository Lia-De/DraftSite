export const USAGE_TYPES = [
  { value: 0, label: "Varp" },
  { value: 1, label: "Inslag" },
  { value: 2, label: "Supplementär" },
  { value: 3, label: "Övrigt" }
];

export const FIBRE_TYPES = [
  { value: 0, label: "Ull" },
  { value: 1, label: "Bomull" },
  { value: 2, label: "Siden" },
  { value: 3, label: "Linne" },
  { value: 4, label: "Syntetisk" },
  { value: 5, label: "Blandad" },
  { value: 6, label: "Övrigt" }
];
export const defaultYarn = {
        usageType: 0,
        brand: "",
        color: "",
        colorCode: "",
        dyeLot: "",
        fibreType: 0,
        ply: "",
        thicknessNM: "",
        notes: "",
        weightPerSkeinGrams: 100,
        lengthPerSkeinMeters: null,
        numberOfSkeins: 1,
        pricePerSkein: null,
    }
