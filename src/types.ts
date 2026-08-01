export type ActiveTab = "chat" | "kundli" | "horoscope" | "matching" | "learning";

export interface UserProfile {
  id?: string;
  email: string;
  name: string;
  dob: string; // YYYY-MM-DD
  tob: string; // HH:MM
  pob: string; // City, Country
  gender: string;
  rashi?: string; // Moon sign
  lagna?: string; // Ascendant sign
  isSubscribed?: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "guru";
  content: string;
  timestamp: string;
}

export interface HoroscopeData {
  sign: string;
  date: string;
  overallSummary: string;
  scores: {
    overall: number;
    love: number;
    career: number;
    health: number;
    finance: number;
  };
  sections: {
    love: string;
    career: string;
    health: string;
    finance: string;
  };
  luckyFactors: {
    number: string;
    color: string;
    time: string;
    direction: string;
  };
  dailyMantra: string;
  guruTip: string;
}

export interface PlanetaryPosition {
  planet: string;
  shortName?: string;
  sign: string;
  house: number;
  degree: string;
  dignity: string;
  isRetrograde?: boolean;
  isCombust?: boolean;
  rawDegree?: number;
}

export interface HouseAnalysis {
  house: number;
  title: string;
  sign: string;
  summary: string;
}

export interface YogaItem {
  name: string;
  type: string;
  description: string;
}

export interface DivisionalChart {
  code: string;
  name: string;
  title: string;
  lagnaSign: string;
  positions: { planet: string; sign: string; house: number; degree?: string }[];
}

export interface ShadbalaItem {
  planet: string;
  sthanabala: number;
  digbala: number;
  kaalabala: number;
  cheshtabala: number;
  naisargikabala: number;
  drikbala: number;
  totalVirupas: number;
  totalRupas: number;
  requiredRupas: number;
  status: "Strong" | "Average" | "Weak";
}

export interface AshtakavargaData {
  bav: { planet: string; points: number[] }[];
  sav: number[];
  totalPoints: number;
  signNames: string[];
}

export interface PratyantardashaItem {
  planet: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface AntardashaItem {
  planet: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
  pratyantardashas?: PratyantardashaItem[];
}

export interface DashaTimelineItem {
  planet: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  isCurrent?: boolean;
  antardashas: AntardashaItem[];
}

export interface YoginiItem {
  yogini: string;
  lord: string;
  startDate: string;
  endDate: string;
  durationYears: number;
  isCurrent?: boolean;
  effect: string;
}

export interface TransitItem {
  planet: string;
  natalSign: string;
  transitSign: string;
  transitHouseFromMoon: number;
  transitHouseFromLagna: number;
  effectType: "Favorable" | "Neutral" | "Unfavorable";
  analysis: string;
}

export interface CombustionItem {
  planet: string;
  sunDistance: number;
  isCombust: boolean;
  maxThreshold: number;
  description: string;
}

export interface RetrogradeItem {
  planet: string;
  isRetrograde: boolean;
  motion: string;
  effect: string;
}

export interface AspectItem {
  planet: string;
  grahaAspects: number[]; // house numbers aspected (e.g., [7] or [4, 7, 8])
  rasiAspects: string[];  // signs aspected via Rasi Drishti
  description: string;
}

export interface ArudhaInfo {
  arudhaLagnaSign: string;
  arudhaLagnaHouse: number;
  lagnaLord: string;
  lagnaLordHouse: number;
  description: string;
}

export interface CharaKarakaItem {
  karaka: string;
  code: string;
  planet: string;
  degreeInSign: string;
  significatorOf: string;
}

export interface DoshaItem {
  name: string;
  isPresent: boolean;
  severity: "None" | "Low" | "Moderate" | "High";
  explanation: string;
  remedy: string;
}

export interface StrengthMeterData {
  overallScore: number;
  rating: string;
  breakdown: {
    shadbalaPower: number;
    yogaPower: number;
    savPower: number;
    lagnaStrength: number;
  };
  summary: string;
}

export interface StructuredRemedySection {
  category:
    | "Mantra"
    | "Yantra"
    | "Temple"
    | "Puja"
    | "Havan"
    | "Charity"
    | "Fasting"
    | "Gemstone Guidance"
    | "Rudraksha Recommendation"
    | "Daily Sadhana"
    | "Meditation"
    | "Lifestyle Advice";
  title: string;
  why: string;
  benefits: string[];
  procedure: string[];
  bestTime: string;
  duration: string;
  expectedSpiritualPurpose: string;
}

export interface KundliData {
  basics: {
    rashi: string;
    lagna: string;
    nakshatra: string;
    sunSign: string;
    gan: string;
    yoni: string;
    nadi: string;
  };
  planetaryPositions: PlanetaryPosition[];
  housesAnalysis: HouseAnalysis[];
  yogas: YogaItem[];
  dashaPeriod: {
    currentMahadasha: string;
    currentAntardasha: string;
    currentPratyantardasha?: string;
    endsOn: string;
    activeAntardashaEndsOn?: string;
    activePratyantardashaEndsOn?: string;
    effectSummary: string;
  };
  manglikStatus: {
    isManglik: boolean;
    degree: string;
    explanation: string;
  };
  // NEW VEDIC ADVANCED FIELDS
  divisionalCharts?: DivisionalChart[];
  shadbala?: ShadbalaItem[];
  ashtakavarga?: AshtakavargaData;
  vimshottariTimeline?: DashaTimelineItem[];
  yoginiTimeline?: YoginiItem[];
  transitGochar?: TransitItem[];
  combustion?: CombustionItem[];
  retrogrades?: RetrogradeItem[];
  aspects?: AspectItem[];
  arudhaLagna?: ArudhaInfo;
  charaKarakas?: CharaKarakaItem[];
  doshas?: DoshaItem[];
  strengthMeter?: StrengthMeterData;
  remedies?: string[];
  structuredRemedies?: StructuredRemedySection[];
}
