import { Product, CropCategory, QualityGrade, ProductLocalizedInfo } from '../types';
import { LanguageCode } from '../context/LanguageContext';

export interface LocalizedDisplayProduct {
  title: string;
  cropName: string;
  variety: string;
  description: string;
  grade: string;
  category: string;
  location: string;
  shelfLife: string;
  organicBadge: string;
  unitPriceLabel: string;
  quantityAvailable: string;
  minimumOrder: string;
}

export const CROP_CATEGORY_LABELS: Record<LanguageCode, Record<string, string>> = {
  en: {
    all: 'All Produce',
    grains_cereals: 'Grains & Cereals',
    pulses: 'Pulses & Dals',
    vegetables: 'Fresh Vegetables',
    fruits: 'Fruits',
    spices: 'Spices',
    oilseeds: 'Oilseeds',
    cash_crops: 'Commercial Crops',
  },
  te: {
    all: 'అన్ని పంటలు',
    grains_cereals: 'ధాన్యాలు & తృణధాన్యాలు',
    pulses: 'పప్పుధాన్యాలు',
    vegetables: 'తాజా కూరగాయలు',
    fruits: 'తాజా పండ్లు',
    spices: 'మసాలా దినుసులు',
    oilseeds: 'నూనెగింజలు',
    cash_crops: 'వాణిజ్య పంటలు',
  },
  hi: {
    all: 'सभी फसलें',
    grains_cereals: 'अनाज और दालें',
    pulses: 'दालें व दलहन',
    vegetables: 'ताज़ी सब्ज़ियां',
    fruits: 'ताज़े फल',
    spices: 'मसाले',
    oilseeds: 'तिलहन',
    cash_crops: 'व्यापारिक फसलें',
  },
};

export const GRADE_LABELS: Record<LanguageCode, Record<string, string>> = {
  en: {
    'Grade A (Export)': 'Grade A (Export / Top Quality)',
    'Grade B (Premium)': 'Grade B (Standard Market)',
    'Grade C (Standard)': 'Grade C (Daily Kitchen)',
  },
  te: {
    'Grade A (Export)': 'గ్రేడ్ A (ఎగుమతి / ఉత్తమ నాణ్యత)',
    'Grade B (Premium)': 'గ్రేడ్ B (ప్రీమియం మార్కెట్)',
    'Grade C (Standard)': 'గ్రేడ్ C (సాధారణ నాణ్యత)',
  },
  hi: {
    'Grade A (Export)': 'ग्रेड A (निर्यात / सर्वोत्तम)',
    'Grade B (Premium)': 'ग्रेड B (प्रीमियम गुणवत्ता)',
    'Grade C (Standard)': 'ग्रेड C (मानक गुणवत्ता)',
  },
};

export const CROP_NAME_SYNONYMS: Record<string, { te: string; hi: string; en: string }> = {
  'Wheat': { en: 'Wheat', te: 'గోధుమలు', hi: 'गेहूं' },
  'Basmati Rice': { en: 'Basmati Rice', te: 'బాస్మతి బియ్యం', hi: 'बासमती चावल' },
  'Rice': { en: 'Paddy / Rice', te: 'వరి / బియ్యం', hi: 'धान / चावल' },
  'Onion': { en: 'Red Onion', te: 'ఉల్లిపాయలు', hi: 'प्याज' },
  'Tomato': { en: 'Tomato', te: 'టమాటా', hi: 'टमाटर' },
  'Gram / Chana': { en: 'Chickpeas / Chana', te: 'దేశీ శనగలు', hi: 'देसी चना' },
  'Potato': { en: 'Potato', te: 'బంగాళాదుంపలు', hi: 'आलू' },
  'Soybean': { en: 'Soybean', te: 'సోయాబీన్', hi: 'सोयाबीन' },
  'Mustard': { en: 'Mustard Seeds', te: 'ఆవాలు', hi: 'सरसों' },
  'Cotton': { en: 'Cotton', te: 'పత్తి', hi: 'कपास' },
};

/**
 * Returns clean, fully localized product representation for the given UI language
 */
export function getLocalizedProduct(product: Product, lang: LanguageCode): LocalizedDisplayProduct {
  const trans = product.translations?.[lang];
  const enTrans = product.translations?.en;

  const cropName = trans?.cropName || (lang === 'te' ? CROP_NAME_SYNONYMS[product.cropName]?.te : lang === 'hi' ? CROP_NAME_SYNONYMS[product.cropName]?.hi : undefined) || product.cropName;
  const title = trans?.title || product.title;
  const variety = trans?.variety || product.variety;
  const description = trans?.description || product.description;

  const grade = trans?.gradeLabel || GRADE_LABELS[lang]?.[product.grade] || product.grade;
  const category = trans?.categoryLabel || CROP_CATEGORY_LABELS[lang]?.[product.category] || product.category;

  const state = trans?.state || product.farmerLocation.state;
  const district = trans?.district || product.farmerLocation.district;
  const location = `${district}, ${state}`;

  let shelfLife = `Shelf Life: ${product.shelfLifeDays} Days`;
  if (lang === 'te') {
    shelfLife = `నిల్వ సమయం: ${product.shelfLifeDays} రోజులు`;
  } else if (lang === 'hi') {
    shelfLife = `टिकाऊ समय: ${product.shelfLifeDays} दिन`;
  }

  let organicBadge = 'Certified Organic';
  if (lang === 'te') {
    organicBadge = 'సేంద్రీయ ధృవీకరణ (సహజ సాగు)';
  } else if (lang === 'hi') {
    organicBadge = 'प्रमाणित जैविक (रसायन मुक्त)';
  }

  let unitPriceLabel = '/kg';
  if (lang === 'te') {
    unitPriceLabel = '/కిలో';
  } else if (lang === 'hi') {
    unitPriceLabel = '/किलो';
  }

  let quantityAvailable = `${product.availableQuantityKg.toLocaleString('en-IN')} kg`;
  let minimumOrder = `${product.minimumOrderQuantityKg.toLocaleString('en-IN')} kg`;
  if (lang === 'te') {
    quantityAvailable = `${product.availableQuantityKg.toLocaleString('en-IN')} కిలోలు`;
    minimumOrder = `${product.minimumOrderQuantityKg.toLocaleString('en-IN')} కిలోలు`;
  } else if (lang === 'hi') {
    quantityAvailable = `${product.availableQuantityKg.toLocaleString('en-IN')} किलो`;
    minimumOrder = `${product.minimumOrderQuantityKg.toLocaleString('en-IN')} किलो`;
  }

  return {
    title,
    cropName,
    variety,
    description,
    grade,
    category,
    location,
    shelfLife,
    organicBadge,
    unitPriceLabel,
    quantityAvailable,
    minimumOrder,
  };
}

/**
 * Multilingual search filter that matches English, Telugu, and Hindi keywords
 */
export function matchesMultilingualProductSearch(product: Product, query: string, lang: LanguageCode): boolean {
  if (!query || !query.trim()) return true;
  const cleanQ = query.toLowerCase().trim();

  // Check direct product fields
  if (
    product.title.toLowerCase().includes(cleanQ) ||
    product.cropName.toLowerCase().includes(cleanQ) ||
    product.variety.toLowerCase().includes(cleanQ) ||
    product.farmerName.toLowerCase().includes(cleanQ) ||
    product.farmerLocation.district.toLowerCase().includes(cleanQ) ||
    product.farmerLocation.state.toLowerCase().includes(cleanQ)
  ) {
    return true;
  }

  // Check Telugu translations
  const te = product.translations?.te;
  if (te) {
    if (
      te.title.toLowerCase().includes(cleanQ) ||
      te.cropName.toLowerCase().includes(cleanQ) ||
      te.variety.toLowerCase().includes(cleanQ) ||
      te.description.toLowerCase().includes(cleanQ) ||
      (te.district && te.district.toLowerCase().includes(cleanQ)) ||
      (te.state && te.state.toLowerCase().includes(cleanQ))
    ) {
      return true;
    }
  }

  // Check Hindi translations
  const hi = product.translations?.hi;
  if (hi) {
    if (
      hi.title.toLowerCase().includes(cleanQ) ||
      hi.cropName.toLowerCase().includes(cleanQ) ||
      hi.variety.toLowerCase().includes(cleanQ) ||
      hi.description.toLowerCase().includes(cleanQ) ||
      (hi.district && hi.district.toLowerCase().includes(cleanQ)) ||
      (hi.state && hi.state.toLowerCase().includes(cleanQ))
    ) {
      return true;
    }
  }

  // Check crop synonyms
  const syn = CROP_NAME_SYNONYMS[product.cropName];
  if (syn) {
    if (
      syn.te.toLowerCase().includes(cleanQ) ||
      syn.hi.toLowerCase().includes(cleanQ) ||
      syn.en.toLowerCase().includes(cleanQ)
    ) {
      return true;
    }
  }

  return false;
}
