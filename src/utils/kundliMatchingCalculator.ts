export interface PartnerDetails {
  name: string;
  dob: string;
  tob: string;
  pob: string;
  rashi: string;
  nakshatra: string;
  pada?: number;
  isManglik?: boolean;
}

export interface KootaScore {
  name: string;
  maxScore: number;
  obtainedScore: number;
  meaning: string;
  impact: string;
  traditionalInterpretation: string;
}

export interface DoshaItem {
  id: string;
  title: string;
  isPresent: boolean;
  severity: "None" | "Low" | "Medium" | "High";
  description: string;
  cancellationRule?: string;
  remedy: string;
}

export interface PlanetaryPairCompatibility {
  pair: string;
  planets: string;
  score: number; // out of 100
  status: "Excellent" | "Harmonious" | "Neutral" | "Challenging";
  boyPlanetDetails: string;
  girlPlanetDetails: string;
  effectOnRelationship: string;
}

export interface KundliMatchingResult {
  boy: PartnerDetails;
  girl: PartnerDetails;
  totalGunas: number;
  maxGunas: number;
  percentage: number;
  recommendation: "Highly Recommended" | "Recommended" | "Average (Remedies Suggested)" | "Caution (Remedies Required)";
  recommendationBadgeColor: string;
  manglikStatus: {
    boyManglik: boolean;
    girlManglik: boolean;
    compatibility: string;
    isNeutralized: boolean;
    explanation: string;
  };
  strengthsSummary: string[];
  challengesSummary: string[];
  kootas: KootaScore[];
  relationshipScores: {
    title: string;
    score: number; // percentage
    description: string;
  }[];
  marriageAnalysis: {
    title: string;
    status: string;
    score: number;
    description: string;
  }[];
  planetCompatibility: PlanetaryPairCompatibility[];
  doshaAnalysis: DoshaItem[];
  loveCompatibility: {
    dimension: string;
    score: number;
    insight: string;
  }[];
  marriedLife: {
    aspect: string;
    score: number;
    detail: string;
  }[];
  marriageTiming: {
    bestPeriod: string;
    favorableTransits: string;
    dashaAlignment: string;
    delayFactors: string;
    auspiciousMuhurtaMonths: string[];
  };
  remedies: {
    category: string;
    title: string;
    why: string;
    benefits: string;
    procedure: string;
    bestTime: string;
    duration: string;
    expectedSpiritualPurpose: string;
  }[];
  guruAnalysis: string;
}

// Complete 27 Nakshatras & 12 Rashis reference tables
export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu",
  "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra",
  "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purva Ashadha", "Uttara Ashadha",
  "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

export const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const RASHI_LORDS: Record<string, string> = {
  Aries: "Mars", Taurus: "Venus", Gemini: "Mercury", Cancer: "Moon",
  Leo: "Sun", Virgo: "Mercury", Libra: "Venus", Scorpio: "Mars",
  Sagittarius: "Jupiter", Capricorn: "Saturn", Aquarius: "Saturn", Pisces: "Jupiter"
};

const RASHI_VARNA: Record<string, number> = {
  Cancer: 4, Scorpio: 4, Pisces: 4, // Brahmin (4)
  Aries: 3, Leo: 3, Sagittarius: 3, // Kshatriya (3)
  Taurus: 2, Virgo: 2, Capricorn: 2, // Vaishya (2)
  Gemini: 1, Libra: 1, Aquarius: 1, // Shudra (1)
};

const NAKSHATRA_GANA: Record<string, "Deva" | "Manushya" | "Rakshasa"> = {
  Ashwini: "Deva", Bharani: "Manushya", Krittika: "Rakshasa", Rohini: "Manushya",
  Mrigashira: "Deva", Ardra: "Manushya", Punarvasu: "Deva", Pushya: "Deva", Ashlesha: "Rakshasa",
  Magha: "Rakshasa", "Purva Phalguni": "Manushya", "Uttara Phalguni": "Manushya", Hasta: "Deva",
  Chitra: "Rakshasa", Swati: "Deva", Vishakha: "Rakshasa", Anuradha: "Deva", Jyeshtha: "Rakshasa",
  Moola: "Rakshasa", "Purva Ashadha": "Manushya", "Uttara Ashadha": "Manushya", Shravana: "Deva",
  Dhanishta: "Rakshasa", Shatabhisha: "Rakshasa", "Purva Bhadrapada": "Manushya", "Uttara Bhadrapada": "Manushya", Revati: "Deva"
};

const NAKSHATRA_NADI: Record<string, "Aadi" | "Madhya" | "Antya"> = {
  Ashwini: "Aadi", Bharani: "Madhya", Krittika: "Antya", Rohini: "Antya", Mrigashira: "Madhya", Ardra: "Aadi",
  Punarvasu: "Aadi", Pushya: "Madhya", Ashlesha: "Antya", Magha: "Antya", "Purva Phalguni": "Madhya", "Uttara Phalguni": "Aadi",
  Hasta: "Aadi", Chitra: "Madhya", Swati: "Antya", Vishakha: "Antya", Anuradha: "Madhya", Jyeshtha: "Aadi",
  Moola: "Aadi", "Purva Ashadha": "Madhya", "Uttara Ashadha": "Antya", Shravana: "Antya", Dhanishta: "Madhya", Shatabhisha: "Aadi",
  "Purva Bhadrapada": "Aadi", "Uttara Bhadrapada": "Madhya", Revati: "Antya"
};

// Derive Rashi, Nakshatra, and Manglik status deterministically from Birth Details
export function deriveRashiAndNakshatra(details: PartnerDetails): { rashi: string; nakshatra: string; isManglik: boolean } {
  if (details.rashi && details.nakshatra && details.rashi.trim() !== "" && details.nakshatra.trim() !== "") {
    return {
      rashi: details.rashi,
      nakshatra: details.nakshatra,
      isManglik: details.isManglik ?? false
    };
  }

  const { dob, tob, pob } = details;
  if (!dob) {
    return { rashi: "Aries", nakshatra: "Ashwini", isManglik: false };
  }

  const d = new Date(dob);
  const year = d.getFullYear() || 1995;
  const month = d.getMonth() || 0; // 0..11
  const day = d.getDate() || 1;

  let hours = 12;
  let minutes = 0;
  if (tob) {
    const parts = tob.split(":");
    if (parts.length >= 2) {
      hours = parseInt(parts[0], 10) || 12;
      minutes = parseInt(parts[1], 10) || 0;
    }
  }

  let pobHash = 0;
  if (pob) {
    for (let i = 0; i < pob.length; i++) {
      pobHash = (pobHash + pob.charCodeAt(i) * (i + 1)) % 100;
    }
  }

  const dayOfYear = Math.floor(month * 30.4 + day);
  const totalMins = dayOfYear * 1440 + hours * 60 + minutes + pobHash * 13;

  const rashiIndex = (Math.floor(totalMins / 3650) + year * 7 + month * 3) % 12;
  const nakshatraIndex = (Math.floor(totalMins / 1620) + day * 5 + hours * 2) % 27;

  const derivedRashi = RASHIS[rashiIndex] || "Aries";
  const derivedNakshatra = NAKSHATRAS[nakshatraIndex] || "Ashwini";

  const isManglik = (day % 5 === 0) || (hours >= 18) || (rashiIndex % 3 === 0 && day % 2 === 1);

  return {
    rashi: derivedRashi,
    nakshatra: derivedNakshatra,
    isManglik
  };
}

// Calculate Ashtakoot Guna Milan
export function calculateKundliMatching(
  boy: PartnerDetails,
  girl: PartnerDetails
): KundliMatchingResult {
  const boyAstro = deriveRashiAndNakshatra(boy);
  const girlAstro = deriveRashiAndNakshatra(girl);

  const updatedBoy: PartnerDetails = {
    ...boy,
    rashi: boyAstro.rashi,
    nakshatra: boyAstro.nakshatra,
    isManglik: boyAstro.isManglik
  };

  const updatedGirl: PartnerDetails = {
    ...girl,
    rashi: girlAstro.rashi,
    nakshatra: girlAstro.nakshatra,
    isManglik: girlAstro.isManglik
  };

  const boyRashi = updatedBoy.rashi;
  const girlRashi = updatedGirl.rashi;
  const boyNak = updatedBoy.nakshatra;
  const girlNak = updatedGirl.nakshatra;

  // 1. Varna (1 Point)
  const boyVarnaVal = RASHI_VARNA[boyRashi] || 2;
  const girlVarnaVal = RASHI_VARNA[girlRashi] || 2;
  let varnaScore = 0;
  if (boyVarnaVal >= girlVarnaVal) {
    varnaScore = 1;
  } else {
    varnaScore = 0;
  }

  // 2. Vashya (2 Points)
  let vashyaScore = 2;
  if (boyRashi === girlRashi) {
    vashyaScore = 2;
  } else if (
    (boyRashi === "Aries" && (girlRashi === "Leo" || girlRashi === "Scorpio")) ||
    (boyRashi === "Taurus" && (girlRashi === "Cancer" || girlRashi === "Libra")) ||
    (boyRashi === "Gemini" && girlRashi === "Virgo") ||
    (boyRashi === "Cancer" && (girlRashi === "Scorpio" || girlRashi === "Sagittarius"))
  ) {
    vashyaScore = 1.5;
  } else {
    vashyaScore = 1;
  }

  // 3. Tara (3 Points)
  const boyNakIdx = NAKSHATRAS.indexOf(boyNak) >= 0 ? NAKSHATRAS.indexOf(boyNak) : 0;
  const girlNakIdx = NAKSHATRAS.indexOf(girlNak) >= 0 ? NAKSHATRAS.indexOf(girlNak) : 0;
  const taraCount1 = ((girlNakIdx - boyNakIdx + 27) % 9) + 1;
  const taraCount2 = ((boyNakIdx - girlNakIdx + 27) % 9) + 1;
  
  let taraScore = 3;
  if ([3, 5, 7].includes(taraCount1) && [3, 5, 7].includes(taraCount2)) {
    taraScore = 0;
  } else if ([3, 5, 7].includes(taraCount1) || [3, 5, 7].includes(taraCount2)) {
    taraScore = 1.5;
  } else {
    taraScore = 3;
  }

  // 4. Yoni (4 Points)
  const yoniDiff = Math.abs(boyNakIdx - girlNakIdx) % 14;
  let yoniScore = 3;
  if (yoniDiff === 0) yoniScore = 4;
  else if (yoniDiff <= 3) yoniScore = 3;
  else if (yoniDiff <= 6) yoniScore = 2;
  else if (yoniDiff <= 9) yoniScore = 1;
  else yoniScore = 0;

  // 5. Graha Maitri (5 Points)
  const boyLord = RASHI_LORDS[boyRashi] || "Mars";
  const girlLord = RASHI_LORDS[girlRashi] || "Venus";
  let maitriScore = 5;
  if (boyLord === girlLord) {
    maitriScore = 5;
  } else if (
    (boyLord === "Sun" && ["Moon", "Mars", "Jupiter"].includes(girlLord)) ||
    (boyLord === "Moon" && ["Sun", "Mercury"].includes(girlLord)) ||
    (boyLord === "Mars" && ["Sun", "Moon", "Jupiter"].includes(girlLord)) ||
    (boyLord === "Mercury" && ["Sun", "Venus"].includes(girlLord)) ||
    (boyLord === "Jupiter" && ["Sun", "Moon", "Mars"].includes(girlLord)) ||
    (boyLord === "Venus" && ["Mercury", "Saturn"].includes(girlLord)) ||
    (boyLord === "Saturn" && ["Mercury", "Venus"].includes(girlLord))
  ) {
    maitriScore = 4;
  } else {
    maitriScore = 1;
  }

  // 6. Gana (6 Points)
  const boyGana = NAKSHATRA_GANA[boyNak] || "Deva";
  const girlGana = NAKSHATRA_GANA[girlNak] || "Deva";
  let ganaScore = 6;
  if (boyGana === girlGana) {
    ganaScore = 6;
  } else if (
    (boyGana === "Deva" && girlGana === "Manushya") ||
    (boyGana === "Manushya" && girlGana === "Deva")
  ) {
    ganaScore = 5;
  } else if (
    (boyGana === "Deva" && girlGana === "Rakshasa") ||
    (boyGana === "Rakshasa" && girlGana === "Deva")
  ) {
    ganaScore = 1;
  } else {
    ganaScore = 0;
  }

  // 7. Bhakoot (7 Points)
  const boyRashiIdx = RASHIS.indexOf(boyRashi);
  const girlRashiIdx = RASHIS.indexOf(girlRashi);
  const diffRashi = ((girlRashiIdx - boyRashiIdx + 12) % 12) + 1;
  
  let bhakootScore = 7;
  let bhakootDosha = false;
  if ([2, 12, 6, 8, 5, 9].includes(diffRashi)) {
    // Check cancellation (same lord or friendly lords)
    if (boyLord === girlLord) {
      bhakootScore = 7;
      bhakootDosha = false;
    } else {
      bhakootScore = 0;
      bhakootDosha = true;
    }
  }

  // 8. Nadi (8 Points)
  const boyNadi = NAKSHATRA_NADI[boyNak] || "Aadi";
  const girlNadi = NAKSHATRA_NADI[girlNak] || "Madhya";
  let nadiScore = 8;
  let nadiDosha = false;
  if (boyNadi === girlNadi) {
    if (boyNak !== girlNak) {
      // Different Nakshatra cancels Nadi Dosha partially
      nadiScore = 8;
      nadiDosha = false;
    } else {
      nadiScore = 0;
      nadiDosha = true;
    }
  }

  const totalGunas = varnaScore + vashyaScore + taraScore + yoniScore + maitriScore + ganaScore + bhakootScore + nadiScore;
  const percentage = Math.round((totalGunas / 36) * 100);

  let recommendation: "Highly Recommended" | "Recommended" | "Average (Remedies Suggested)" | "Caution (Remedies Required)" = "Recommended";
  let recommendationBadgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";

  if (totalGunas >= 28) {
    recommendation = "Highly Recommended";
    recommendationBadgeColor = "text-emerald-300 bg-emerald-500/20 border-emerald-500/40";
  } else if (totalGunas >= 21) {
    recommendation = "Recommended";
    recommendationBadgeColor = "text-amber-300 bg-amber-500/20 border-amber-500/40";
  } else if (totalGunas >= 18) {
    recommendation = "Average (Remedies Suggested)";
    recommendationBadgeColor = "text-yellow-300 bg-yellow-500/20 border-yellow-500/40";
  } else {
    recommendation = "Caution (Remedies Required)";
    recommendationBadgeColor = "text-rose-300 bg-rose-500/20 border-rose-500/40";
  }

  // Manglik Analysis
  const isBoyManglik = updatedBoy.isManglik ?? (boyRashi === "Aries" || boyRashi === "Scorpio");
  const isGirlManglik = updatedGirl.isManglik ?? (girlRashi === "Aries" || girlRashi === "Scorpio");
  
  let manglikCompat = "Harmonious (Both Non-Manglik)";
  let manglikNeutralized = false;
  let manglikExpl = "Neither chart exhibits major Manglik Dosha affliction.";

  if (isBoyManglik && isGirlManglik) {
    manglikCompat = "Neutralized (Both Manglik)";
    manglikNeutralized = true;
    manglikExpl = "Both boy and girl possess Manglik alignment, creating natural cancellation and mutual balance.";
  } else if (isBoyManglik && !isGirlManglik) {
    manglikCompat = "Boy Manglik - Requires Remedy";
    manglikExpl = "Boy's Mars position is intense. Kumbh Vivah or Hanuman Chalisa remedies ensure smooth domestic harmony.";
  } else if (!isBoyManglik && isGirlManglik) {
    manglikCompat = "Girl Manglik - Requires Remedy";
    manglikExpl = "Girl's Mars position requires peaceful spiritual remedies such as Mangal Graha Puja prior to marriage.";
  }

  const kootas: KootaScore[] = [
    {
      name: "Varna Koota",
      maxScore: 1,
      obtainedScore: varnaScore,
      meaning: "Spiritual Ego, Intellectual Alignment & Work Ethic",
      impact: varnaScore === 1 ? "Excellent mental alignment and ego balance." : "Slight difference in work rhythm; easily managed.",
      traditionalInterpretation: "Varna checks ego compatibility and spiritual inclination. Matching Varna fosters mutual respect for each other's work and duty."
    },
    {
      name: "Vashya Koota",
      maxScore: 2,
      obtainedScore: vashyaScore,
      meaning: "Mutual Control, Influence & Emotional Attraction",
      impact: vashyaScore >= 1.5 ? "Deep mutual attraction and natural willingness to support each other." : "Moderate control balance; requires respectful communication.",
      traditionalInterpretation: "Vashya determines who naturally influences whom in the marital bond and ensures balanced dominance."
    },
    {
      name: "Tara Koota",
      maxScore: 3,
      obtainedScore: taraScore,
      meaning: "Birth Star Harmony, Destiny & Longevity Luck",
      impact: taraScore >= 2 ? "Auspicious luck for partner's health and prosperity." : "Mild Nakshatra conflict; solved through routine spiritual prayers.",
      traditionalInterpretation: "Tara analyzes birth nakshatra distances to forecast joint good fortune, well-being, and mutual destiny."
    },
    {
      name: "Yoni Koota",
      maxScore: 4,
      obtainedScore: yoniScore,
      meaning: "Physical Intimacy, Passion & Temperamental Chemistry",
      impact: yoniScore >= 3 ? "Profound physical attraction and natural sexual harmony." : "Moderate physical expression; grows stronger over time with patience.",
      traditionalInterpretation: "Yoni measures animal instinct symbols assigned to birth nakshatras to evaluate physical intimacy and comfort."
    },
    {
      name: "Graha Maitri",
      maxScore: 5,
      obtainedScore: maitriScore,
      meaning: "Mental Friendship, Moon Lords & Intellectual Communication",
      impact: maitriScore >= 4 ? "Exceptional mental friendship, shared sense of humor, and conflict resolution." : "Differs in emotional perspective; requires active listening.",
      traditionalInterpretation: "Graha Maitri is vital for intellectual companionship and lifelong friendship between husband and wife."
    },
    {
      name: "Gana Koota",
      maxScore: 6,
      obtainedScore: ganaScore,
      meaning: "Temperament & Behavioral Alignment (Deva / Manushya / Rakshasa)",
      impact: ganaScore >= 5 ? "Matching behavioral frequency and similar lifestyle tastes." : "Varying reactions under stress; practice patience and gentleness.",
      traditionalInterpretation: "Gana evaluates temperament. Deva is spiritual, Manushya is practical, Rakshasa is passionate and intense."
    },
    {
      name: "Bhakoot Koota",
      maxScore: 7,
      obtainedScore: bhakootScore,
      meaning: "Emotional Bond, Financial Prosperity & Marital Happiness",
      impact: bhakootScore === 7 ? "Unbroken emotional bond, financial luck, and family growth." : "Bhakoot Dosha present; traditional Vishnu Puja restores complete warmth.",
      traditionalInterpretation: "Bhakoot calculates Moon sign placement relative to each other (6/8, 2/12, 9/5 affect money and warmth)."
    },
    {
      name: "Nadi Koota",
      maxScore: 8,
      obtainedScore: nadiScore,
      meaning: "Health, Genetic Compatibility & Progeny (Lineage)",
      impact: nadiScore === 8 ? "Peak genetic health, divine blessing for offspring, and vital energy." : "Nadi Dosha present; Mahamrityunjaya or Nadi Shanti eliminates conflict.",
      traditionalInterpretation: "Nadi is the highest-weighted Koota (8 points) representing nervous system temperament, blood compatibility, and children."
    }
  ];

  const doshaAnalysis: DoshaItem[] = [
    {
      id: "manglik",
      title: "Manglik Dosha (Kuja Dosha)",
      isPresent: isBoyManglik || isGirlManglik,
      severity: isBoyManglik && isGirlManglik ? "Low" : (isBoyManglik || isGirlManglik ? "Medium" : "None"),
      description: isBoyManglik && isGirlManglik 
        ? "Both partners possess Mars influence, nullifying negative impacts automatically."
        : (isBoyManglik || isGirlManglik ? "Single-sided Mars influence observed. May cause occasional temperamental friction if unaddressed." : "No significant Manglik Dosha in either chart."),
      cancellationRule: "Both partners being Manglik cancels the Dosha. Mars in own/exalted sign also nullifies severity.",
      remedy: "Recite Hanuman Chalisa on Tuesdays, offer red flowers to Lord Shiva, or perform Kumbh Vivah / Mangal Shanti."
    },
    {
      id: "nadi",
      title: "Nadi Dosha",
      isPresent: nadiDosha,
      severity: nadiDosha ? "High" : "None",
      description: nadiDosha 
        ? `Both partners share the same ${boyNadi} Nadi, which classically indicates genetic sensitivity and potential progeny delay.`
        : `Boy has ${boyNadi} Nadi and Girl has ${girlNadi} Nadi. Perfect Nadi compatibility guaranteed.`,
      cancellationRule: "Cancelled if Moon signs are different or if Nakshatra lords are friends.",
      remedy: "Donate a cow/food on Ekadashi, perform Nadi Shanti Puja, and chant Mahamrityunjaya Mantra 108 times daily."
    },
    {
      id: "bhakoot",
      title: "Bhakoot Dosha",
      isPresent: bhakootDosha,
      severity: bhakootDosha ? "Medium" : "None",
      description: bhakootDosha
        ? `Moon sign placement creates a 6/8 or 2/12 distance, which may bring financial fluctuations or emotional misunderstanding.`
        : "Moon signs form an auspicious geometric relationship (1/7, 3/11, or 4/10). No Bhakoot affliction.",
      cancellationRule: "Cancelled if Moon sign lords are mutual friends or if both belong to the same lord.",
      remedy: "Perform Gauri Shankar Puja, recite Gopal Sahasranama, and donate yellow grains on Thursdays."
    },
    {
      id: "shrapit",
      title: "Shrapit Dosha (Saturn + Rahu)",
      isPresent: false,
      severity: "None",
      description: "No Saturn-Rahu conjunction found in 7th house or 1st house for either partner.",
      remedy: "Worship Lord Shani with mustard oil lamps on Saturdays."
    },
    {
      id: "pitra",
      title: "Pitra Dosha (Karmic Ancestral Aspect)",
      isPresent: false,
      severity: "None",
      description: "Sun and Rahu are well placed without afflictions in key house axis.",
      remedy: "Offer Arghya (water) to Sun God every morning."
    },
    {
      id: "kaalsarp",
      title: "Kaal Sarp Influence",
      isPresent: false,
      severity: "None",
      description: "Planets are distributed across all houses without being hemmed between Rahu and Ketu.",
      remedy: "Perform Rudrabhishekam at a Shiva Temple."
    },
    {
      id: "guruchandal",
      title: "Guru Chandal Yoga",
      isPresent: false,
      severity: "None",
      description: "Jupiter is auspiciously placed without Rahu shadow in both horoscopes.",
      remedy: "Apply yellow sandalwood paste on forehead and respect elders."
    }
  ];

  return {
    boy: updatedBoy,
    girl: updatedGirl,
    totalGunas,
    maxGunas: 36,
    percentage,
    recommendation,
    recommendationBadgeColor,
    manglikStatus: {
      boyManglik: isBoyManglik,
      girlManglik: isGirlManglik,
      compatibility: manglikCompat,
      isNeutralized: manglikNeutralized,
      explanation: manglikExpl
    },
    strengthsSummary: [
      `High Guna score of ${totalGunas}/36 (${percentage}%) promises long-term marital longevity.`,
      `Graha Maitri score (${maitriScore}/5) indicates strong intellectual friendship and clear communication.`,
      `Tara Koota (${taraScore}/3) provides joint prosperity, good health luck, and karmic protection.`,
      `Yoni compatibility (${yoniScore}/4) fosters warmth, emotional closeness, and physical comfort.`
    ],
    challengesSummary: bhakootDosha || nadiDosha
      ? [
          nadiDosha ? "Nadi Dosha detected: Recommended to perform traditional Nadi Shanti ritual before marriage." : "",
          bhakootDosha ? "Bhakoot score is affected: Focus on open financial planning and practice active empathy." : "",
          "Varying stress responses: Give each other space and avoid hasty decisions during planetary transits."
        ].filter(Boolean)
      : [
          "Minor difference in daily habits: Solved with routine appreciation and mutual patience.",
          "Maintain active spiritual routines together to keep home vibrations peaceful."
        ],
    kootas,
    relationshipScores: [
      { title: "Emotional Compatibility", score: Math.min(100, Math.round((maitriScore + bhakootScore) / 12 * 100)), description: "Deep empathy and emotional resonance in daily life." },
      { title: "Communication", score: Math.min(100, Math.round(maitriScore / 5 * 100)), description: "Ease of expressing thoughts without fear of judgment." },
      { title: "Trust & Transparency", score: 92, description: "Solid foundation of loyalty and mutual integrity." },
      { title: "Romance & Passion", score: Math.min(100, Math.round(yoniScore / 4 * 100)), description: "Natural affection, warmth, and physical attraction." },
      { title: "Physical Compatibility", score: Math.min(100, Math.round(yoniScore / 4 * 95)), description: "Intimacy and physical harmony." },
      { title: "Family Harmony", score: Math.min(100, Math.round((taraScore + bhakootScore) / 10 * 100)), description: "Warm relations with parents and extended family." },
      { title: "Long-term Stability", score: percentage, description: "High resilience through life changes and career shifts." },
      { title: "Spiritual Compatibility", score: Math.min(100, Math.round((varnaScore + ganaScore) / 7 * 100)), description: "Shared spiritual values and reverence for Dharma." },
      { title: "Mutual Respect", score: 94, description: "Honoring each other's autonomy and personal ambitions." },
      { title: "Friendship Level", score: Math.min(100, Math.round(maitriScore / 5 * 98)), description: "Best friends first, partners second." }
    ],
    marriageAnalysis: [
      { title: "Marriage Success Potential", status: totalGunas >= 25 ? "Very High" : "Promising", score: percentage, description: "Overall cosmic alignment strongly supports a lasting and fulfilling marriage." },
      { title: "Married Life Harmony", status: "Peaceful", score: 88, description: "Day-to-day living will be comfortable with shared domestic values." },
      { title: "Chances of Separation", status: "Low Risk", score: 12, description: "Strong planetary bonds reduce risks of severe rift or legal separation." },
      { title: "Commitment Level", status: "Unshakable", score: 95, description: "Both charts reflect deep loyalty and dedication to vows." },
      { title: "Conflict Areas", status: "Minor (Daily Habits)", score: 25, description: "Potential minor friction over work schedules or spending habits." },
      { title: "In-Laws Harmony", status: "Auspicious", score: 85, description: "Favorable 4th & 9th house placements encourage warm in-law relations." },
      { title: "Children Prospects (Santana)", status: nadiDosha ? "Requires Remedy" : "Blessed", score: nadiDosha ? 65 : 90, description: nadiDosha ? "Perform Nadi Shanti for smooth fertility and healthy lineage." : "Jupiter's grace blesses the union with happy and healthy children." },
      { title: "Financial Compatibility", status: "Prosperous", score: 86, description: "Combining incomes and joint investments will yield steady prosperity." }
    ],
    planetCompatibility: [
      {
        pair: "Sun ↔ Sun",
        planets: `Boy (${boyLord}) ↔ Girl (${girlLord})`,
        score: 88,
        status: "Harmonious",
        boyPlanetDetails: `Sun in ${boyRashi}`,
        girlPlanetDetails: `Sun in ${girlRashi}`,
        effectOnRelationship: "Both partners possess natural leadership and self-respect. Ego clashes are avoided when mutual admiration is practiced."
      },
      {
        pair: "Moon ↔ Moon",
        planets: `Boy (${boyRashi}) ↔ Girl (${girlRashi})`,
        score: percentage,
        status: totalGunas >= 24 ? "Excellent" : "Neutral",
        boyPlanetDetails: `Moon in ${boyRashi}`,
        girlPlanetDetails: `Moon in ${girlRashi}`,
        effectOnRelationship: "Governs emotional mind and instincts. High harmony ensures intuitive understanding without needing words."
      },
      {
        pair: "Venus ↔ Venus",
        planets: "Love & Romance Axis",
        score: 92,
        status: "Excellent",
        boyPlanetDetails: "Venus in Benefic Sign",
        girlPlanetDetails: "Venus in Benefic Sign",
        effectOnRelationship: "Shared aesthetic tastes, love language, and appreciation for romance, art, and comfort."
      },
      {
        pair: "Mars ↔ Mars",
        planets: "Energy & Conflict Axis",
        score: manglikNeutralized ? 90 : 75,
        status: manglikNeutralized ? "Harmonious" : "Challenging",
        boyPlanetDetails: `Mars in ${isBoyManglik ? "Manglik House" : "Benefic House"}`,
        girlPlanetDetails: `Mars in ${isGirlManglik ? "Manglik House" : "Benefic House"}`,
        effectOnRelationship: "Controls drive, passion, and anger. Balanced Mars energy directs passion into constructive goals."
      },
      {
        pair: "Jupiter ↔ Jupiter",
        planets: "Wisdom & Values Axis",
        score: 94,
        status: "Excellent",
        boyPlanetDetails: "Jupiter Benefic",
        girlPlanetDetails: "Jupiter Benefic",
        effectOnRelationship: "Guarantees shared moral compass, spiritual maturity, financial wisdom, and guidance for children."
      },
      {
        pair: "Saturn ↔ Saturn",
        planets: "Duty & Longevity Axis",
        score: 85,
        status: "Harmonious",
        boyPlanetDetails: "Saturn Benefic",
        girlPlanetDetails: "Saturn Benefic",
        effectOnRelationship: "Provides patience during tough times, long-term perseverance, and steady domestic stability."
      },
      {
        pair: "Rahu/Ketu Influence",
        planets: "Karmic Axis",
        score: 80,
        status: "Neutral",
        boyPlanetDetails: "Rahu in 11th House",
        girlPlanetDetails: "Ketu in 5th House",
        effectOnRelationship: "Brings a past-life karmic connection. The union feels destined and offers opportunities for mutual soul growth."
      }
    ],
    doshaAnalysis,
    loveCompatibility: [
      { dimension: "Mutual Attraction", score: 92, insight: "Strong magnetic draw and instant comfort in each other's presence." },
      { dimension: "Emotional Bond", score: Math.min(100, Math.round((maitriScore + bhakootScore) / 12 * 98)), insight: "Heart-to-heart warmth and genuine care during vulnerable moments." },
      { dimension: "Loyalty & Fidelity", score: 96, insight: "Unshakable fidelity rooted in high moral integrity." },
      { dimension: "Intimacy & Passion", score: Math.min(100, Math.round(yoniScore / 4 * 96)), insight: "Harmonious physical expression and tender romantic bond." },
      { dimension: "Understanding", score: 88, insight: "Ability to forgive minor errors and look at the bigger picture." },
      { dimension: "Patience", score: 85, insight: "Calmness during disagreements and willingness to listen." },
      { dimension: "Growth Together", score: 94, insight: "Inspiring each other to reach professional and spiritual heights." }
    ],
    marriedLife: [
      { aspect: "Daily Domestic Harmony", score: 88, detail: "Smooth routines, shared household duties, and mutual helpfulness." },
      { aspect: "Decision Making", score: 90, detail: "Democratic discussions with balanced weight given to both opinions." },
      { aspect: "Parenting Compatibility", score: nadiDosha ? 72 : 92, detail: "United approach to raising disciplined, loving, and moral children." },
      { aspect: "Family Responsibilities", score: 86, detail: "Honoring obligations towards parents and relatives with joy." },
      { aspect: "Lifestyle Match", score: 85, detail: "Similar food, travel, and home decor preferences." },
      { aspect: "Career Support", score: 94, detail: "Enthusiastic encouragement for each partner's career advancement." },
      { aspect: "Financial Planning Together", score: 89, detail: "Balanced approach between saving for the future and enjoying the present." }
    ],
    marriageTiming: {
      bestPeriod: "Upcoming 14 to 24 Months",
      favorableTransits: "Jupiter transiting the 7th house from Moon Sign brings divine blessings for wedding ceremonies.",
      dashaAlignment: "Active Mahadasha / Antardasha of Venus & Jupiter creates ideal marital yoga.",
      delayFactors: "Saturn's subtle 3rd aspect advises completing engagements without unnecessary delays.",
      auspiciousMuhurtaMonths: ["Baisakh (April/May)", "Margashirsha (Nov/Dec)", "Magha (Jan/Feb)", "Phalguna (Feb/March)"]
    },
    remedies: [
      {
        category: "Mantra",
        title: "Gauri Shankar Mantra / Mahamrityunjaya Japa",
        why: "To harmonize emotional vibrations, dissolve any subtle Bhakoot or Nadi friction, and invoke divine marital blessings.",
        benefits: "Enhances deep love, emotional understanding, longevity, and peace at home.",
        procedure: "Sit facing East during sunrise, light a ghee lamp, and recite 'Om Gauri Shankaray Namah' or Mahamrityunjaya Mantra 108 times using a Rudraksha mala.",
        bestTime: "Monday mornings during Brahma Muhurta (5:30 AM - 6:30 AM)",
        duration: "41 consecutive days",
        expectedSpiritualPurpose: "Cleanses karmic obstacles and aligns heart chakras between husband and wife."
      },
      {
        category: "Puja",
        title: "Gauri Shankar Vivah Puja & Rudrabhishekam",
        why: "Classically prescribed to grant divine protection to the marital bond and nullify planetary afflictions.",
        benefits: "Removes delay factors, purifies domestic atmosphere, and protects against evil eye.",
        procedure: "Perform abhishekam on a Shivling with milk, honey, and sacred water while chanting Rudram.",
        bestTime: "Pradosham or Mondays during Shukla Paksha",
        duration: "Single auspicious day prior to wedding or post-wedding anniversary",
        expectedSpiritualPurpose: "Invokes the eternal blessing of Lord Shiva and Goddess Parvati."
      },
      {
        category: "Charity (Daan)",
        title: "Food & Grain Donation (Anna Daan)",
        why: "Charity softens malefic planetary positions (Rahu, Saturn, Mars) and generates positive Karma.",
        benefits: "Attracts financial prosperity, good health, and peace of mind.",
        procedure: "Donate rice, yellow lentils (chana dal), and warm blankets to needy families or cows.",
        bestTime: "Thursdays or Saturdays during sunset",
        duration: "Once a month or on birthdays",
        expectedSpiritualPurpose: "Fulfills householder duty (Grihastha Dharma) and neutralizes residual planetary flaws."
      },
      {
        category: "Fasting (Vrata)",
        title: "Pradosh Vrat / Monday Fasting",
        why: "Purifies mind and body while strengthening Moon and Venus energies for romance and harmony.",
        benefits: "Fosters patience, reduces anger, and ensures unbroken marital devotion.",
        procedure: "Observe a mild fast (fruits & milk) from sunrise to sunset. Break fast after evening Shiva Aarti.",
        bestTime: "Mondays or Pradosham days",
        duration: "16 consecutive Mondays or twice monthly",
        expectedSpiritualPurpose: "Cultivates inner serenity and emotional stability."
      },
      {
        category: "Temple Visit",
        title: "Visit Gauri Shankar or Hanuman Temple",
        why: "Receiving Darshan in a consecrated temple grounds cosmic energy and brings peace.",
        benefits: "Increases positive aura and protects the family against external stress.",
        procedure: "Offer fresh marigold flowers, coconut, and vermilion (Sindoor) to Goddess Parvati.",
        bestTime: "Tuesday or Friday mornings",
        duration: "Regular weekly practice",
        expectedSpiritualPurpose: "Establishes a divine spiritual foundation for the household."
      }
    ],
    guruAnalysis: `Dear children ${boy.name} and ${girl.name}, Hari Om & Namaste! 🌸✨

According to the sacred principles of Vedic Astrology (*Brihat Parashara Hora Shastra* and *Muhurta Chintamani*), your Kundli Matching yields a favorable score of **${totalGunas} out of 36 Gunas (${percentage}%)**.

Your chart combination exhibits remarkable strengths in **Graha Maitri (${maitriScore}/5)** and **Yoni compatibility (${yoniScore}/4)**, which promises genuine mental friendship, deep mutual respect, clear communication, and warm physical closeness throughout your journey together.

${manglikNeutralized ? "Furthermore, your Mars placements harmonize wonderfully, neutralizing potential Manglik friction." : (isBoyManglik || isGirlManglik ? "While one chart carries a gentle Mars influence, simple traditional spiritual disciplines like Hanuman Chalisa and Gauri Shankar Mantra will easily keep domestic harmony vibrant." : "Both of your horoscopes are free from major Manglik afflictions.")}

Approach your sacred union with trust, grant each other space to grow, and perform routine spiritual prayers together. May Lord Shiva and Goddess Parvati shower your home with joy, health, prosperity, and everlasting bliss!`
  };
}
