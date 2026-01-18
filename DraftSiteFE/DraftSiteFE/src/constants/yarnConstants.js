export const YARN_FIBRE_LABELS = {
    0: 'Ull',
    1: 'Bomull',
    2: 'Silke',
    3: 'Linne',
    4: 'Syntet',
    5: 'Blandning',
    6: 'Övrigt'
};

export const YARN_USAGE_LABELS = {
    0: 'Varp',
    1: 'Inslag',
    2: 'Supplementär',
    3: 'Övrigt'
}
export const defaultYarn = {
        id: "",
        usageType: 0,
        brand: "",
        color: "",
        colorCode: "",
        dyeLot: "",
        fibreType: 0,
        ply: "",
        thicknessNM: "",
        notes: "",
        weightPerSkeinGrams: null,
        lengthPerSkeinMeters: null,
        numberOfSkeins: null,
        pricePerSkein: null,
        totalWeightGrams: null,
        totalLengthMeters: null,
        totalPrice: null
    }

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