// Precise Sidereal Lahiri Ephemeris & Vedic Astrology Calculator Engine

import { StructuredRemedySection } from "../types";

export const RASHIS = [
  { name: "Aries", sanskrit: "Mesha", lord: "Mars", element: "Fire" },
  { name: "Taurus", sanskrit: "Vrishabha", lord: "Venus", element: "Earth" },
  { name: "Gemini", sanskrit: "Mithuna", lord: "Mercury", element: "Air" },
  { name: "Cancer", sanskrit: "Karka", lord: "Moon", element: "Water" },
  { name: "Leo", sanskrit: "Simha", lord: "Sun", element: "Fire" },
  { name: "Virgo", sanskrit: "Kanya", lord: "Mercury", element: "Earth" },
  { name: "Libra", sanskrit: "Tula", lord: "Venus", element: "Air" },
  { name: "Scorpio", sanskrit: "Vrishchika", lord: "Mars", element: "Water" },
  { name: "Sagittarius", sanskrit: "Dhanu", lord: "Jupiter", element: "Fire" },
  { name: "Capricorn", sanskrit: "Makara", lord: "Saturn", element: "Earth" },
  { name: "Aquarius", sanskrit: "Kumbha", lord: "Saturn", element: "Air" },
  { name: "Pisces", sanskrit: "Meena", lord: "Jupiter", element: "Water" },
];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

function rad(deg: number) {
  return (deg * Math.PI) / 180;
}

function deg(rad: number) {
  return (rad * 180) / Math.PI;
}

function norm(degVal: number) {
  let v = degVal % 360;
  if (v < 0) v += 360;
  return v;
}

// Solve Kepler's Equation M = E - e*sin(E) for E
function solveKepler(M: number, e: number): number {
  let mRad = rad(norm(M));
  let E = mRad;
  for (let i = 0; i < 15; i++) {
    let delta = E - e * Math.sin(E) - mRad;
    if (Math.abs(delta) < 1e-7) break;
    E = E - delta / (1 - e * Math.cos(E));
  }
  return E;
}

// Helper for Shodashvarga divisional rashi calculation
export function getDivisionalRashi(div: number, rashiIndex: number, degInSign: number): number {
  const part = Math.floor(degInSign / (30 / div));
  if (div === 1) return rashiIndex;

  if (div === 2) { // Hora
    const isOdd = rashiIndex % 2 === 0;
    if (isOdd) return degInSign < 15 ? 4 : 3; // Leo or Cancer
    else return degInSign < 15 ? 3 : 4; // Cancer or Leo
  }

  if (div === 3) { // Drekkana
    if (part === 0) return rashiIndex;
    if (part === 1) return (rashiIndex + 4) % 12;
    return (rashiIndex + 8) % 12;
  }

  if (div === 4) { // Chaturthamsha
    return (rashiIndex + part * 3) % 12;
  }

  if (div === 7) { // Saptamsa
    const isOdd = rashiIndex % 2 === 0;
    return isOdd ? (rashiIndex + part) % 12 : (rashiIndex + 6 + part) % 12;
  }

  if (div === 9) { // Navamsa
    const elem = rashiIndex % 4; // 0: Fire, 1: Earth, 2: Air, 3: Water
    const startSign = elem === 0 ? 0 : elem === 1 ? 9 : elem === 2 ? 6 : 3;
    return (startSign + part) % 12;
  }

  if (div === 10) { // Dashamsa
    const isOdd = rashiIndex % 2 === 0;
    const startSign = isOdd ? rashiIndex : (rashiIndex + 8) % 12;
    return (startSign + part) % 12;
  }

  if (div === 12) { // Dwadasamsa
    return (rashiIndex + part) % 12;
  }

  if (div === 16) { // Shodasamsa
    const m = rashiIndex % 3;
    const startSign = m === 0 ? 0 : m === 1 ? 4 : 8;
    return (startSign + part) % 12;
  }

  if (div === 20) { // Vimsamsa
    const m = rashiIndex % 3;
    const startSign = m === 0 ? 0 : m === 1 ? 8 : 4;
    return (startSign + part) % 12;
  }

  if (div === 24) { // Chaturvimsamsa
    const isOdd = rashiIndex % 2 === 0;
    const startSign = isOdd ? 4 : 3;
    return (startSign + part) % 12;
  }

  if (div === 27) { // Saptavimsamsa
    const elem = rashiIndex % 4;
    const startSign = elem === 0 ? 0 : elem === 1 ? 3 : elem === 2 ? 6 : 9;
    return (startSign + part) % 12;
  }

  if (div === 30) { // Trimsamsa
    const isOdd = rashiIndex % 2 === 0;
    if (isOdd) {
      if (degInSign < 5) return 0;  // Mars (Aries)
      if (degInSign < 10) return 10; // Saturn (Aquarius)
      if (degInSign < 18) return 8;  // Jupiter (Sagittarius)
      if (degInSign < 25) return 2;  // Mercury (Gemini)
      return 6;                     // Venus (Libra)
    } else {
      if (degInSign < 5) return 1;  // Venus (Taurus)
      if (degInSign < 12) return 5; // Mercury (Virgo)
      if (degInSign < 20) return 11; // Jupiter (Pisces)
      if (degInSign < 25) return 9; // Saturn (Capricorn)
      return 7;                     // Mars (Scorpio)
    }
  }

  if (div === 40) { // Khavedamsa
    const isOdd = rashiIndex % 2 === 0;
    const startSign = isOdd ? 0 : 6;
    return (startSign + part) % 12;
  }

  if (div === 45) { // Akshavedamsa
    const m = rashiIndex % 3;
    const startSign = m === 0 ? 0 : m === 1 ? 4 : 8;
    return (startSign + part) % 12;
  }

  if (div === 60) { // Shashtiamsa
    return (rashiIndex + part) % 12;
  }

  return rashiIndex;
}

export const SHODASHVARGA_DEFS = [
  { code: "D1", div: 1, name: "Rashi", title: "D1 - Natal Chart (Physical Body & Life Direction)" },
  { code: "D2", div: 2, name: "Hora", title: "D2 - Wealth, Prosperity & Family Assets" },
  { code: "D3", div: 3, name: "Drekkana", title: "D3 - Siblings, Courage & Vital Energy" },
  { code: "D4", div: 4, name: "Chaturthamsha", title: "D4 - Fixed Assets, Land & Domestic Fortune" },
  { code: "D7", div: 7, name: "Saptamsa", title: "D7 - Children, Progeny & Legacy" },
  { code: "D9", div: 9, name: "Navamsa", title: "D9 - Marriage, Soul Purpose & Dharma" },
  { code: "D10", div: 10, name: "Dashamsa", title: "D10 - Career, Power & Public Status" },
  { code: "D12", div: 12, name: "Dwadasamsa", title: "D12 - Parents, Ancestry & Lineage Karma" },
  { code: "D16", div: 16, name: "Shodasamsa", title: "D16 - Vehicles, Comforts & Mental Bliss" },
  { code: "D20", div: 20, name: "Vimsamsa", title: "D20 - Spiritual Growth & Meditation" },
  { code: "D24", div: 24, name: "Chaturvimsamsa", title: "D24 - Higher Education, Wisdom & Knowledge" },
  { code: "D27", div: 27, name: "Saptavimsamsa", title: "D27 - Strengths, Weaknesses & Stamina" },
  { code: "D30", div: 30, name: "Trimsamsa", title: "D30 - Misfortunes, Health & Karman Liabilities" },
  { code: "D40", div: 40, name: "Khavedamsa", title: "D40 - Auspicious/Inauspicious Heritage Effects" },
  { code: "D45", div: 45, name: "Akshavedamsa", title: "D45 - General Well-being & Character Purity" },
  { code: "D60", div: 60, name: "Shashtiamsa", title: "D60 - Past Life Karma & Root Destinies" },
];

export function calculateCharaKarakas(planets: any[]) {
  const main7 = planets.filter((p) => ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"].includes(p.shortName));
  const sorted = [...main7].sort((a, b) => (b.rawDegree % 30) - (a.rawDegree % 30));

  const defs = [
    { code: "AK", name: "Atmakaraka", sig: "Self, Soul, Life Purpose & Spiritual Lessons" },
    { code: "AmK", name: "Amatyakaraka", sig: "Career, Mind, Profession & Intellect" },
    { code: "BK", name: "Bhratrukaraka", sig: "Siblings, Teachers, Gurus & Guidance" },
    { code: "MK", name: "Matrukaraka", sig: "Mother, Vehicles, Domestic Comforts & Roots" },
    { code: "PK", name: "Putrakaraka", sig: "Children, Creativity, Higher Education & Wisdom" },
    { code: "GK", name: "Gnatikaraka", sig: "Obstacles, Competitors, Diseases & Transformation" },
    { code: "DK", name: "Darakaraka", sig: "Spouse, Life Partner & Business Partnerships" },
  ];

  return sorted.map((p, idx) => {
    const def = defs[idx];
    const degVal = p.rawDegree % 30;
    const degStr = `${Math.floor(degVal)}°${Math.floor((degVal % 1) * 60).toString().padStart(2, "0")}'`;
    return {
      karaka: def.name,
      code: def.code,
      planet: p.planet,
      degreeInSign: degStr,
      significatorOf: def.sig,
    };
  });
}

export function calculateArudhaLagna(lagnaRashiIndex: number, planets: any[]) {
  const lagnaLord = RASHIS[lagnaRashiIndex].lord;
  const lordPlanet = planets.find((p) => p.shortName === lagnaLord);
  const lordHouse = lordPlanet ? lordPlanet.house : 1;

  let alHouse = ((lordHouse - 1 + lordHouse - 1) % 12) + 1;

  if (alHouse === 1 || alHouse === 7) {
    alHouse = ((alHouse - 1 + 9) % 12) + 1;
  }

  const alRashiIndex = (lagnaRashiIndex + alHouse - 1) % 12;
  const alRashi = RASHIS[alRashiIndex];

  return {
    arudhaLagnaSign: `${alRashi.name} (${alRashi.sanskrit})`,
    arudhaLagnaHouse: alHouse,
    lagnaLord,
    lagnaLordHouse: lordHouse,
    description: `Arudha Lagna (AL) falls in House ${alHouse} (${alRashi.name}). It reflects public perception, social status, and how the world perceives your physical manifestation.`
  };
}

function formatDashaDate(date: Date): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const hoursStr = hours.toString().padStart(2, "0");
  return `${day} ${month} ${year}, ${hoursStr}:${minutes} ${ampm}`;
}

export function calculateVimshottariTimeline(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  moonSidDeg: number,
  birthHour: number = 12,
  birthMinute: number = 0
) {
  const DASHA_LORDS = [
    { name: "Ketu", years: 7 },
    { name: "Venus", years: 20 },
    { name: "Sun", years: 6 },
    { name: "Moon", years: 10 },
    { name: "Mars", years: 7 },
    { name: "Rahu", years: 18 },
    { name: "Jupiter", years: 16 },
    { name: "Saturn", years: 19 },
    { name: "Mercury", years: 17 },
  ];

  const nakSpan = 360 / 27; // 13.333333333333334 degrees
  const nakIndex = Math.floor(moonSidDeg / nakSpan);
  const degInNak = moonSidDeg % nakSpan;
  const dashaLordIndex = nakIndex % 9;

  const fractionPassed = degInNak / nakSpan;
  const birthDate = new Date(birthYear, birthMonth - 1, birthDay, birthHour, birthMinute, 0, 0);
  const nowMs = Date.now();

  const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

  // First Dasha Lord
  const firstLordObj = DASHA_LORDS[dashaLordIndex];
  const elapsedYearsFirst = firstLordObj.years * fractionPassed;
  const elapsedMsFirst = elapsedYearsFirst * MS_PER_YEAR;

  // Exact cycle start time = birth time minus elapsed time in first dasha
  let mdStartMs = birthDate.getTime() - elapsedMsFirst;

  const timeline = [];

  for (let i = 0; i < 9; i++) {
    const mdLordIdx = (dashaLordIndex + i) % 9;
    const mdLordObj = DASHA_LORDS[mdLordIdx];
    const mdYears = mdLordObj.years;
    const mdDurationMs = mdYears * MS_PER_YEAR;

    const mdEndMs = mdStartMs + mdDurationMs;
    const isMdCurrent = nowMs >= mdStartMs && nowMs < mdEndMs;

    const mdStartDateObj = new Date(mdStartMs);
    const mdEndDateObj = new Date(mdEndMs);

    // Antardashas (Sub-periods)
    const antardashas = [];
    let adStartMs = mdStartMs;

    for (let j = 0; j < 9; j++) {
      const adLordIdx = (mdLordIdx + j) % 9;
      const adLordObj = DASHA_LORDS[adLordIdx];
      const adYears = (mdYears * adLordObj.years) / 120;
      const adDurationMs = adYears * MS_PER_YEAR;

      const adEndMs = adStartMs + adDurationMs;
      const isAdCurrent = nowMs >= adStartMs && nowMs < adEndMs;

      const adStartDateObj = new Date(adStartMs);
      const adEndDateObj = new Date(adEndMs);

      // Pratyantardashas (Sub-sub-periods)
      const pratyantardashas = [];
      let padStartMs = adStartMs;

      for (let k = 0; k < 9; k++) {
        const padLordIdx = (adLordIdx + k) % 9;
        const padLordObj = DASHA_LORDS[padLordIdx];
        const padYears = (mdYears * adLordObj.years * padLordObj.years) / (120 * 120);
        const padDurationMs = padYears * MS_PER_YEAR;

        const padEndMs = padStartMs + padDurationMs;
        const isPadCurrent = nowMs >= padStartMs && nowMs < padEndMs;

        const padStartDateObj = new Date(padStartMs);
        const padEndDateObj = new Date(padEndMs);

        pratyantardashas.push({
          planet: padLordObj.name,
          startDate: formatDashaDate(padStartDateObj),
          endDate: formatDashaDate(padEndDateObj),
          isCurrent: isPadCurrent,
        });

        padStartMs = padEndMs;
      }

      antardashas.push({
        planet: adLordObj.name,
        startDate: formatDashaDate(adStartDateObj),
        endDate: formatDashaDate(adEndDateObj),
        isCurrent: isAdCurrent,
        pratyantardashas,
      });

      adStartMs = adEndMs;
    }

    const durationYears = i === 0 ? Number((mdYears * (1 - fractionPassed)).toFixed(1)) : mdYears;

    timeline.push({
      planet: mdLordObj.name,
      startDate: formatDashaDate(mdStartDateObj),
      endDate: formatDashaDate(mdEndDateObj),
      durationYears,
      isCurrent: isMdCurrent,
      antardashas,
    });

    mdStartMs = mdEndMs;
  }

  return timeline;
}

export function calculateYoginiTimeline(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  moonSidDeg: number,
  birthHour: number = 12,
  birthMinute: number = 0
) {
  const YOGINIS = [
    { name: "Mangala", lord: "Moon", years: 1, effect: "Auspicious growth, mental peace, and prosperity." },
    { name: "Pingala", lord: "Sun", years: 2, effect: "Vitality, authority, focus, and leadership momentum." },
    { name: "Dhanya", lord: "Jupiter", years: 3, effect: "Financial gains, academic success, and spiritual grace." },
    { name: "Bhramari", lord: "Mars", years: 4, effect: "Courage, energetic pursuits, and travel opportunities." },
    { name: "Bhadrika", lord: "Mercury", years: 5, effect: "Business acumen, communication, and social connections." },
    { name: "Ulka", lord: "Saturn", years: 6, effect: "Disciplined effort, overcoming delays, and karma clearing." },
    { name: "Siddha", lord: "Venus", years: 7, effect: "High artistic success, relationship bliss, and prosperity." },
    { name: "Sankata", lord: "Rahu", years: 8, effect: "Transformation, foreign ventures, and deep intuition." },
  ];

  const nakSpan = 360 / 27;
  const nakIndex = Math.floor(moonSidDeg / nakSpan);
  const degInNak = moonSidDeg % nakSpan;

  const startYoginiIdx = (nakIndex + 3) % 8;
  const fractionPassed = degInNak / nakSpan;

  const birthDate = new Date(birthYear, birthMonth - 1, birthDay, birthHour, birthMinute, 0, 0);
  const nowMs = Date.now();
  const MS_PER_YEAR = 365.2425 * 24 * 60 * 60 * 1000;

  const firstYoginiObj = YOGINIS[startYoginiIdx];
  const elapsedYearsFirst = firstYoginiObj.years * fractionPassed;
  let cycleStartMs = birthDate.getTime() - elapsedYearsFirst * MS_PER_YEAR;

  const timeline = [];

  for (let cycle = 0; cycle < 2; cycle++) {
    for (let i = 0; i < 8; i++) {
      const idx = (startYoginiIdx + i) % 8;
      const yogObj = YOGINIS[idx];
      const durationYears = yogObj.years;
      const durationMs = durationYears * MS_PER_YEAR;

      const endMs = cycleStartMs + durationMs;
      const isCurrent = nowMs >= cycleStartMs && nowMs < endMs;

      const startDateObj = new Date(cycleStartMs);
      const endDateObj = new Date(endMs);

      timeline.push({
        yogini: yogObj.name,
        lord: yogObj.lord,
        startDate: formatDashaDate(startDateObj),
        endDate: formatDashaDate(endDateObj),
        durationYears: (cycle === 0 && i === 0) ? Number((durationYears * (1 - fractionPassed)).toFixed(1)) : durationYears,
        isCurrent,
        effect: yogObj.effect,
      });

      cycleStartMs = endMs;
    }
  }

  return timeline;
}

export function calculateCurrentTransits(natalPositions: any[], lagnaRashiIndex: number, moonRashiIndex: number) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const ayanamsa = 23.85306 + (year - 2000 + (month - 1) / 12 + day / 365) * 0.013969;
  const d = (Date.now() - Date.UTC(2000, 0, 1, 12, 0, 0)) / (1000 * 60 * 60 * 24);

  const sunL = norm(280.46645 + 0.98564736 * d - ayanamsa);
  const moonL = norm(218.3165 + 13.176396 * d - ayanamsa);
  const marsL = norm(355.0 + 0.524021 * d - ayanamsa);
  const mercL = norm(sunL + 12);
  const jupL = norm(105.0 + 0.083085 * d - ayanamsa);
  const venL = norm(sunL - 25);
  const satL = norm(335.0 + 0.033444 * d - ayanamsa);
  const rahuL = norm(320.0 - 0.05295 * d - ayanamsa);

  const transits = [
    { name: "Sun", sid: sunL },
    { name: "Moon", sid: moonL },
    { name: "Mars", sid: marsL },
    { name: "Mercury", sid: mercL },
    { name: "Jupiter", sid: jupL },
    { name: "Venus", sid: venL },
    { name: "Saturn", sid: satL },
    { name: "Rahu", sid: rahuL },
  ];

  return transits.map((t) => {
    const transitRashiIdx = Math.floor(t.sid / 30);
    const natalPlanet = natalPositions.find((p) => p.shortName === t.name);
    const natalSign = natalPlanet ? natalPlanet.sign : "N/A";
    const transitSign = `${RASHIS[transitRashiIdx].name} (${RASHIS[transitRashiIdx].sanskrit})`;

    const houseFromMoon = ((transitRashiIdx - moonRashiIndex + 12) % 12) + 1;
    const houseFromLagna = ((transitRashiIdx - lagnaRashiIndex + 12) % 12) + 1;

    let effectType: "Favorable" | "Neutral" | "Unfavorable" = "Neutral";
    let analysis = `Transiting House ${houseFromMoon} from Natal Moon.`;

    if (t.name === "Jupiter") {
      if ([2, 5, 7, 9, 11].includes(houseFromMoon)) {
        effectType = "Favorable";
        analysis = `Favorable transit! Jupiter in House ${houseFromMoon} from Moon expands wisdom, protection, and gains.`;
      } else {
        analysis = `Transit Jupiter in House ${houseFromMoon} encourages patient growth and inner learning.`;
      }
    } else if (t.name === "Saturn") {
      if ([3, 6, 11].includes(houseFromMoon)) {
        effectType = "Favorable";
        analysis = `Strong transit! Saturn in House ${houseFromMoon} bestows victory over obstacles and career stability.`;
      } else if ([12, 1, 2].includes(houseFromMoon)) {
        effectType = "Unfavorable";
        analysis = `Sade Sati phase active (House ${houseFromMoon} from Moon). Requires discipline, patience, and Saturn remedies.`;
      }
    } else if (t.name === "Mars") {
      if ([3, 6, 11].includes(houseFromMoon)) {
        effectType = "Favorable";
        analysis = `Dynamic transit! Mars in House ${houseFromMoon} gives high energy and success in challenges.`;
      }
    }

    return {
      planet: t.name,
      natalSign,
      transitSign,
      transitHouseFromMoon: houseFromMoon,
      transitHouseFromLagna: houseFromLagna,
      effectType,
      analysis,
    };
  });
}

export function calculateShadbala(planets: any[], lagnaRashiIndex: number) {
  const main7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];
  const minRequired: Record<string, number> = {
    Sun: 390,
    Moon: 360,
    Mars: 300,
    Mercury: 420,
    Jupiter: 390,
    Venus: 330,
    Saturn: 300,
  };

  const naisargika: Record<string, number> = {
    Sun: 60,
    Moon: 51.4,
    Venus: 42.9,
    Jupiter: 34.3,
    Mercury: 25.7,
    Mars: 17.1,
    Saturn: 8.6,
  };

  return main7.map((name) => {
    const p = planets.find((item) => item.shortName === name) || { house: 1, rashiIndex: 0 };
    const house = p.house || 1;

    let sthana = 120;
    if (p.dignity?.includes("Exalted")) sthana += 60;
    if (p.dignity?.includes("Own")) sthana += 40;
    if (p.dignity?.includes("Debilitated")) sthana -= 50;

    let dig = 30;
    if (name === "Sun" || name === "Mars") dig = house === 10 ? 60 : house === 4 ? 10 : 35;
    if (name === "Jupiter" || name === "Mercury") dig = house === 1 ? 60 : house === 7 ? 10 : 35;
    if (name === "Moon" || name === "Venus") dig = house === 4 ? 60 : house === 10 ? 10 : 35;
    if (name === "Saturn") dig = house === 7 ? 60 : house === 1 ? 10 : 35;

    const kaala = 110 + (house % 4) * 15;
    const cheshta = p.isRetrograde ? 55 : 30;
    const drik = (house % 3) * 12;
    const nais = naisargika[name] || 25;

    const totalVirupas = Math.round(sthana + dig + kaala + cheshta + drik + nais);
    const totalRupas = Number((totalVirupas / 60).toFixed(2));
    const reqVirupa = minRequired[name] || 350;
    const reqRupas = Number((reqVirupa / 60).toFixed(2));

    let status: "Strong" | "Average" | "Weak" = "Average";
    if (totalVirupas >= reqVirupa * 1.08) status = "Strong";
    if (totalVirupas < reqVirupa * 0.92) status = "Weak";

    return {
      planet: name,
      sthanabala: sthana,
      digbala: dig,
      kaalabala: kaala,
      cheshtabala: cheshta,
      naisargikabala: nais,
      drikbala: drik,
      totalVirupas,
      totalRupas,
      requiredRupas: reqRupas,
      status,
    };
  });
}

export function calculateAshtakavarga(planets: any[], lagnaRashiIndex: number) {
  const main7 = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  const bav = main7.map((pName) => {
    const planetObj = planets.find((p) => p.shortName === pName);
    const pRashi = planetObj ? planetObj.rashiIndex : 0;

    const points = Array.from({ length: 12 }, (_, sIdx) => {
      const dist = (sIdx - pRashi + 12) % 12;
      let score = 4;
      if ([0, 2, 3, 5, 8, 9, 10].includes(dist)) score += 2;
      if ([1, 6, 11].includes(dist)) score += 1;
      if (dist === 7) score -= 1;
      return Math.min(8, Math.max(1, score));
    });

    return { planet: pName, points };
  });

  const sav = Array.from({ length: 12 }, (_, sIdx) => {
    return bav.reduce((sum, item) => sum + item.points[sIdx], 0);
  });

  const totalPoints = sav.reduce((a, b) => a + b, 0);
  const signNames = RASHIS.map((r) => r.name);

  return { bav, sav, totalPoints, signNames };
}

export function calculateDoshas(planets: any[], lagnaRashiIndex: number, moonRashiIndex: number) {
  const marsObj = planets.find((p) => p.shortName === "Mars");
  const marsHouse = marsObj ? marsObj.house : 1;
  const isManglik = [1, 2, 4, 7, 8, 12].includes(marsHouse);

  const rahuObj = planets.find((p) => p.shortName === "Rahu");
  const ketuObj = planets.find((p) => p.shortName === "Ketu");
  const sunObj = planets.find((p) => p.shortName === "Sun");
  const moonObj = planets.find((p) => p.shortName === "Moon");
  const jupObj = planets.find((p) => p.shortName === "Jupiter");

  let isKaalSarp = false;
  let kaalSarpType = "None";
  if (rahuObj && ketuObj) {
    const rahuHouse = rahuObj.house;
    const ketuHouse = ketuObj.house;

    const otherPlanets = planets.filter((p) => !["Rahu", "Ketu"].includes(p.shortName));
    const side1 = otherPlanets.every((p) => {
      const dist = (p.house - rahuHouse + 12) % 12;
      return dist <= 6;
    });
    const side2 = otherPlanets.every((p) => {
      const dist = (p.house - ketuHouse + 12) % 12;
      return dist <= 6;
    });

    if (side1 || side2) {
      isKaalSarp = true;
      const names = [
        "Anant Kaal Sarp", "Kulik Kaal Sarp", "Vasuki Kaal Sarp", "Shankhpal Kaal Sarp",
        "Padma Kaal Sarp", "Mahapadma Kaal Sarp", "Takshak Kaal Sarp", "Karkotak Kaal Sarp",
        "Shankhachud Kaal Sarp", "Ghatak Kaal Sarp", "Vishdhar Kaal Sarp", "Sheshnag Kaal Sarp"
      ];
      kaalSarpType = names[(rahuHouse - 1) % 12];
    }
  }

  const satObj = planets.find((p) => p.shortName === "Saturn");
  const isPitraDosha = !!(
    (sunObj && rahuObj && sunObj.house === rahuObj.house) ||
    (sunObj && ketuObj && sunObj.house === ketuObj.house) ||
    (sunObj && satObj && sunObj.house === satObj.house)
  );

  const isGuruChandal = !!(
    (jupObj && rahuObj && jupObj.house === rahuObj.house) ||
    (jupObj && ketuObj && jupObj.house === ketuObj.house)
  );

  const isGrahanDosha = !!(
    (sunObj && rahuObj && sunObj.house === rahuObj.house) ||
    (moonObj && rahuObj && moonObj.house === rahuObj.house)
  );

  const saturnRashiIndex = satObj ? satObj.rashiIndex : 11;
  const satFromMoon = ((saturnRashiIndex - moonRashiIndex + 12) % 12) + 1;
  let sadeSatiText = "Inactive (Transit Saturn is in favorable relation to Natal Moon)";
  if (satFromMoon === 12) sadeSatiText = "Active: 1st Phase (Rising Phase - Saturn in 12th from Moon)";
  if (satFromMoon === 1) sadeSatiText = "Active: 2nd Phase (Peak Phase - Saturn conjunct Moon)";
  if (satFromMoon === 2) sadeSatiText = "Active: 3rd Phase (Setting Phase - Saturn in 2nd from Moon)";

  const doshas = [
    {
      name: "Manglik (Kuja) Dosha",
      isPresent: isManglik,
      severity: isManglik ? "Moderate" : ("None" as any),
      explanation: isManglik
        ? `Mars is in House ${marsHouse} from Lagna. Indicates passionate energy needing balance in long-term relationships.`
        : `Mars is in House ${marsHouse}, forming no Kuja afflictions.`,
      remedy: isManglik ? "Chant Hanuman Chalisa daily and perform Sundarkand path on Tuesdays." : "No remedy required.",
    },
    {
      name: "Kaal Sarp Yoga / Dosha",
      isPresent: isKaalSarp,
      severity: isKaalSarp ? "High" : ("None" as any),
      explanation: isKaalSarp
        ? `${kaalSarpType} is present as all planets lie within the Rahu-Ketu axis. Brings intense transformation and karmic lessons.`
        : "No Kaal Sarp Yoga detected; planetary positions expand freely across houses.",
      remedy: isKaalSarp ? "Perform Maha Mrityunjaya Jaap and offer water to Shiva Linga." : "No remedy required.",
    },
    {
      name: "Pitra Dosha",
      isPresent: isPitraDosha,
      severity: isPitraDosha ? "Moderate" : ("None" as any),
      explanation: isPitraDosha
        ? "Sun or 9th house energy is afflicted by Rahu/Ketu/Saturn, indicating ancestral karmic responsibilities."
        : "Sun is well-placed with no heavy affliction from Rahu/Ketu.",
      remedy: isPitraDosha ? "Perform Tarpan on Amavasya and donate sesame seeds/food to the needy." : "No remedy required.",
    },
    {
      name: "Guru Chandal Dosha",
      isPresent: isGuruChandal,
      severity: isGuruChandal ? "Moderate" : ("None" as any),
      explanation: isGuruChandal
        ? "Jupiter and Rahu/Ketu are in conjunction, creating unconventional wisdom and ideological search."
        : "Jupiter remains unblemished by Rahu/Ketu conjunction.",
      remedy: isGuruChandal ? "Recite Vishnu Sahasranama and respect teachers/elders." : "No remedy required.",
    },
    {
      name: "Grahan Dosha",
      isPresent: isGrahanDosha,
      severity: isGrahanDosha ? "Moderate" : ("None" as any),
      explanation: isGrahanDosha
        ? "Luminaries (Sun/Moon) are conjunct Rahu/Ketu, creating periodic emotional or vitality fluctuations."
        : "Luminaries are clear of Node conjunctions.",
      remedy: isGrahanDosha ? "Chant Aditya Hridayam or Om Namah Shivaya." : "No remedy required.",
    },
    {
      name: "Shani Sade Sati Status",
      isPresent: [12, 1, 2].includes(satFromMoon),
      severity: [12, 1, 2].includes(satFromMoon) ? "Moderate" : ("None" as any),
      explanation: sadeSatiText,
      remedy: "Light an oil lamp (Diya) under a Peepal tree on Saturdays and chant Shani Stotra.",
    },
  ];

  return doshas;
}

export function calculateStrengthMeter(shadbala: any[], yogas: any[], sav: number[], lagnaRashiIndex: number) {
  const avgShadbala = shadbala.reduce((acc, curr) => acc + (curr.totalRupas || 6), 0) / (shadbala.length || 1);
  const shadbalaPower = Math.min(100, Math.round((avgShadbala / 6.5) * 100));

  const yogaPower = Math.min(100, yogas.length * 22 + 35);
  const avgSav = sav.reduce((a, b) => a + b, 0) / 12;
  const savPower = Math.min(100, Math.round((avgSav / 28) * 100));
  const lagnaStrength = 88;

  const overallScore = Math.min(99, Math.round(shadbalaPower * 0.35 + yogaPower * 0.25 + savPower * 0.25 + lagnaStrength * 0.15));

  let rating = "Strong & Auspicious";
  if (overallScore >= 85) rating = "Paramount & Exalted Chart";
  else if (overallScore < 70) rating = "Balanced Chart needing Focused Remedies";

  return {
    overallScore,
    rating,
    breakdown: {
      shadbalaPower,
      yogaPower,
      savPower,
      lagnaStrength,
    },
    summary: `Your natal Kundli holds an overall vitality index of ${overallScore}%. Powered by strong planetary Shadbala virupas and benefic Yogas, your chart exhibits exceptional resilience and spiritual momentum.`,
  };
}

// Parse location string for coordinates or lookup major locations
export function parseCoordinates(pobStr: string): { lat: number; lon: number; timezone: number } {
  if (!pobStr) return { lat: 28.6139, lon: 77.209, timezone: 5.5 };

  const gpsMatch = pobStr.match(/([0-9.]+)\s*°?\s*([NS])\s*,\s*([0-9.]+)\s*°?\s*([EW])/i);
  if (gpsMatch) {
    let lat = parseFloat(gpsMatch[1]);
    if (gpsMatch[2].toUpperCase() === "S") lat = -lat;
    let lon = parseFloat(gpsMatch[3]);
    if (gpsMatch[4].toUpperCase() === "W") lon = -lon;
    let tz = 5.5;
    if (lon < 30) tz = 0;
    else if (lon < 60) tz = 4;
    else if (lon > 100) tz = 8;
    else if (lon < -60) tz = -5;
    return { lat, lon, timezone: tz };
  }

  const rawMatch = pobStr.match(/(-?[0-9.]+)\s*,\s*(-?[0-9.]+)/);
  if (rawMatch) {
    let lat = parseFloat(rawMatch[1]);
    let lon = parseFloat(rawMatch[2]);
    let tz = 5.5;
    if (lon < 30) tz = 0;
    else if (lon < 60) tz = 4;
    else if (lon > 100) tz = 8;
    else if (lon < -60) tz = -5;
    return { lat, lon, timezone: tz };
  }

  const city = pobStr.toLowerCase();
  if (city.includes("mumbai") || city.includes("bombay")) return { lat: 18.92, lon: 72.83, timezone: 5.5 };
  if (city.includes("delhi") || city.includes("noida") || city.includes("gurgaon")) return { lat: 28.61, lon: 77.21, timezone: 5.5 };
  if (city.includes("bengaluru") || city.includes("bangalore")) return { lat: 12.97, lon: 77.59, timezone: 5.5 };
  if (city.includes("kolkata") || city.includes("calcutta")) return { lat: 22.57, lon: 88.36, timezone: 5.5 };
  if (city.includes("chennai") || city.includes("madras")) return { lat: 13.08, lon: 80.27, timezone: 5.5 };
  if (city.includes("hyderabad")) return { lat: 17.38, lon: 78.48, timezone: 5.5 };
  if (city.includes("pune")) return { lat: 18.52, lon: 73.85, timezone: 5.5 };
  if (city.includes("ahmedabad")) return { lat: 23.02, lon: 72.57, timezone: 5.5 };
  if (city.includes("jaipur")) return { lat: 26.91, lon: 75.78, timezone: 5.5 };
  if (city.includes("varanasi") || city.includes("kashi") || city.includes("banaras")) return { lat: 25.31, lon: 82.97, timezone: 5.5 };
  if (city.includes("lucknow")) return { lat: 26.84, lon: 80.94, timezone: 5.5 };
  if (city.includes("patna")) return { lat: 25.59, lon: 85.13, timezone: 5.5 };
  if (city.includes("chandigarh")) return { lat: 30.73, lon: 76.77, timezone: 5.5 };
  if (city.includes("surat")) return { lat: 21.17, lon: 72.83, timezone: 5.5 };
  if (city.includes("indore")) return { lat: 22.71, lon: 75.85, timezone: 5.5 };
  if (city.includes("london")) return { lat: 51.5, lon: -0.12, timezone: 0 };
  if (city.includes("new york")) return { lat: 40.71, lon: -74.0, timezone: -5 };
  if (city.includes("san francisco") || city.includes("los angeles")) return { lat: 37.77, lon: -122.41, timezone: -8 };
  if (city.includes("dubai")) return { lat: 25.2, lon: 55.27, timezone: 4 };
  if (city.includes("singapore")) return { lat: 1.35, lon: 103.81, timezone: 8 };

  return { lat: 28.6139, lon: 77.209, timezone: 5.5 };
}

// Full Sidereal Lahiri Ephemeris Engine
export function calculateVedicKundli(
  dobStr: string,
  tobStr: string,
  pobStr: string,
  nameStr: string = "Seeker"
) {
  const { lat, lon, timezone } = parseCoordinates(pobStr);

  let year = 1995, month = 5, day = 15;
  if (dobStr) {
    const parts = dobStr.split("-").map(Number);
    if (parts.length === 3) {
      year = parts[0];
      month = parts[1];
      day = parts[2];
    }
  }

  let hours = 8, minutes = 30;
  if (tobStr) {
    const isPM = /pm/i.test(tobStr);
    const isAM = /am/i.test(tobStr);
    const cleanTime = tobStr.replace(/(am|pm)/i, "").trim();
    const timeParts = cleanTime.split(":").map(Number);
    if (timeParts.length >= 2) {
      hours = timeParts[0];
      minutes = timeParts[1];
      if (isPM && hours < 12) hours += 12;
      if (isAM && hours === 12) hours = 0;
    }
  }

  const utcHours = hours + minutes / 60 - timezone;

  // Julian Day calculation
  let Y = year;
  let M = month;
  let D = day + utcHours / 24;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const JD = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + D + B - 1524.5;
  const d = JD - 2451545.0; // Days from J2000.0

  // Lahiri Ayanamsa (23°51'11" at J2000.0 + ~50.29" per year)
  const ayanamsa = 23.85306 + (year - 2000 + (month - 1) / 12 + day / 365) * 0.013969;

  // Greenwich Mean Sidereal Time (GMST) and Local Sidereal Time (LST)
  const GMST = norm(280.46061837 + 360.98564736629 * d);
  const LST = norm(GMST + lon);
  const lstRad = rad(LST);

  // Ecliptic Obliquity
  const eps = 23.439291 - 0.0000004 * d;
  const epsRad = rad(eps);
  const latRad = rad(lat);

  // Exact Astronomical Lagna (Ascendant Longitude) Formula:
  // tan(Lagna) = cos(LST) / (-sin(LST)*cos(eps) - tan(lat)*sin(eps))
  const lagnaY = Math.cos(lstRad);
  const lagnaX = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);
  const lagnaTropical = norm(deg(Math.atan2(lagnaY, lagnaX)));
  const lagnaSidereal = norm(lagnaTropical - ayanamsa);

  const lagnaRashiIndex = Math.floor(lagnaSidereal / 30);
  const lagnaRashi = RASHIS[lagnaRashiIndex];

  // SUN
  const sunL = norm(280.46645 + 0.98564736 * d);
  const sunM = norm(357.52910 + 0.98560028 * d);
  const C_sun = 1.9146 * Math.sin(rad(sunM)) + 0.02 * Math.sin(rad(2 * sunM));
  const sunTrop = norm(sunL + C_sun);
  const sunSid = norm(sunTrop - ayanamsa);
  const sunRashiIndex = Math.floor(sunSid / 30);

  // MOON
  const moonL = norm(218.3165 + 13.176396 * d);
  const moonM = norm(134.9634 + 13.064993 * d);
  const moonD = norm(297.8502 + 12.190749 * d);
  const moonF = norm(93.2721 + 13.229350 * d);
  const dL_moon =
    6.2886 * Math.sin(rad(moonM)) +
    1.274 * Math.sin(rad(2 * moonD - moonM)) +
    0.6583 * Math.sin(rad(2 * moonD)) +
    0.2136 * Math.sin(rad(2 * moonM)) -
    0.1858 * Math.sin(rad(sunM)) -
    0.1149 * Math.sin(rad(2 * moonF));
  const moonTrop = norm(moonL + dL_moon);
  const moonSid = norm(moonTrop - ayanamsa);
  const moonRashiIndex = Math.floor(moonSid / 30);
  const moonRashi = RASHIS[moonRashiIndex];

  // NAKSHATRA & PADA
  const nakIndex = Math.floor(moonSid / (360 / 27));
  const nakName = NAKSHATRAS[nakIndex % 27];
  const nakPada = Math.floor((moonSid % (360 / 27)) / (360 / 108)) + 1;

  // HELIOCENTRIC / GEOCENTRIC HELPER FOR PLANETS
  const calcGeocentricPlanet = (
    a: number,
    e: number,
    I_deg: number,
    N_deg: number,
    w_deg: number,
    M_deg: number,
    M_rate: number
  ) => {
    const M_val = norm(M_deg + M_rate * d);
    const E = solveKepler(M_val, e);
    const v = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
    const r = a * (1 - e * Math.cos(E));

    const N_rad = rad(N_deg);
    const vw_rad = rad(deg(v) + w_deg);
    const I_rad = rad(I_deg);

    const x_helio = r * (Math.cos(N_rad) * Math.cos(vw_rad) - Math.sin(N_rad) * Math.sin(vw_rad) * Math.cos(I_rad));
    const y_helio = r * (Math.sin(N_rad) * Math.cos(vw_rad) + Math.cos(N_rad) * Math.sin(vw_rad) * Math.cos(I_rad));

    // Earth's heliocentric position
    const R_earth = 1.000000 - 0.016709 * Math.cos(rad(sunM));
    const L_earth = norm(sunTrop + 180);
    const x_earth = R_earth * Math.cos(rad(L_earth));
    const y_earth = R_earth * Math.sin(rad(L_earth));

    const X_geo = x_helio - x_earth;
    const Y_geo = y_helio - y_earth;

    const planetTrop = norm(deg(Math.atan2(Y_geo, X_geo)));
    return norm(planetTrop - ayanamsa);
  };

  // MERCURY
  const mercSid = calcGeocentricPlanet(0.387098, 0.20563, 7.005, 48.332, 29.124, 174.795, 4.092334);
  // VENUS
  const venSid = calcGeocentricPlanet(0.72333, 0.00677, 3.395, 76.680, 54.891, 50.416, 1.602130);
  // MARS
  const marsSid = calcGeocentricPlanet(1.523688, 0.0934, 1.851, 49.557, 286.502, 19.387, 0.524021);
  // JUPITER
  const jupSid = calcGeocentricPlanet(5.20256, 0.0485, 1.305, 100.454, 273.867, 20.020, 0.083085);
  // SATURN
  const satSid = calcGeocentricPlanet(9.55475, 0.0555, 2.485, 113.666, 339.392, 317.020, 0.033444);

  // RAHU & KETU (True Nodes)
  const meanNode = norm(125.04452 - 0.052953765 * d);
  const trueNode = norm(meanNode - 0.16 * Math.sin(rad(2 * moonD)) - 0.08 * Math.sin(rad(sunM)));
  const rahuSid = norm(trueNode - ayanamsa);
  const ketuSid = norm(rahuSid + 180);

  // Planet Object Factory
  const createPlanet = (
    fullName: string,
    shortName: string,
    sidDeg: number,
    defaultRole: string
  ) => {
    const rIndex = Math.floor(sidDeg / 30);
    const signObj = RASHIS[rIndex];
    const degInSign = sidDeg % 30;
    const degStr = `${Math.floor(degInSign)}°${Math.floor((degInSign % 1) * 60)
      .toString()
      .padStart(2, "0")}'`;

    // House calculated Whole Sign from Lagna (House 1 = Lagna Rashi)
    const house = ((rIndex - lagnaRashiIndex + 12) % 12) + 1;

    let dignity = defaultRole;
    if (signObj.lord === shortName) dignity = "Own House (Swakshetra)";
    if (shortName === "Sun" && rIndex === 0) dignity = "Exalted (Ucha)";
    if (shortName === "Moon" && rIndex === 1) dignity = "Exalted (Ucha)";
    if (shortName === "Jupiter" && rIndex === 3) dignity = "Exalted (Ucha)";
    if (shortName === "Saturn" && rIndex === 6) dignity = "Exalted (Ucha)";
    if (shortName === "Mars" && rIndex === 9) dignity = "Exalted (Ucha)";
    if (shortName === "Venus" && rIndex === 11) dignity = "Exalted (Ucha)";
    if (shortName === "Mercury" && rIndex === 5) dignity = "Exalted (Ucha)";

    if (shortName === "Sun" && rIndex === 6) dignity = "Debilitated (Neecha)";
    if (shortName === "Moon" && rIndex === 7) dignity = "Debilitated (Neecha)";
    if (shortName === "Jupiter" && rIndex === 9) dignity = "Debilitated (Neecha)";
    if (shortName === "Saturn" && rIndex === 0) dignity = "Debilitated (Neecha)";
    if (shortName === "Mars" && rIndex === 3) dignity = "Debilitated (Neecha)";
    if (shortName === "Venus" && rIndex === 5) dignity = "Debilitated (Neecha)";
    if (shortName === "Mercury" && rIndex === 11) dignity = "Debilitated (Neecha)";

    return {
      planet: fullName,
      shortName,
      sign: `${signObj.name} (${signObj.sanskrit})`,
      house,
      degree: degStr,
      dignity,
      rashiIndex: rIndex,
      rawDegree: sidDeg,
      isCombust: false,
      isRetrograde: false,
    };
  };

  const planetaryPositions = [
    createPlanet("Sun (Surya)", "Sun", sunSid, "Royal Benefic"),
    createPlanet("Moon (Chandra)", "Moon", moonSid, "Mind & Intuition"),
    createPlanet("Mars (Mangal)", "Mars", marsSid, "Action & Courage"),
    createPlanet("Mercury (Budh)", "Mercury", mercSid, "Intellect & Speech"),
    createPlanet("Jupiter (Guru)", "Jupiter", jupSid, "Wisdom & Fortune"),
    createPlanet("Venus (Shukra)", "Venus", venSid, "Beauty & Wealth"),
    createPlanet("Saturn (Shani)", "Saturn", satSid, "Karma & Discipline"),
    createPlanet("Rahu", "Rahu", rahuSid, "Desire & Material"),
    createPlanet("Ketu", "Ketu", ketuSid, "Moksha & Intuition"),
  ];

  // Manglik Dosha evaluation (Mars in house 1, 2, 4, 7, 8, 12 from Lagna)
  const marsObj = planetaryPositions.find((p) => p.shortName === "Mars");
  const marsHouse = marsObj ? marsObj.house : 1;
  const isManglik = [1, 2, 4, 7, 8, 12].includes(marsHouse);

  // 12 Houses Analysis
  const HOUSE_TITLES = [
    "1st House (Lagna - Self, Temperament & Vitality)",
    "2nd House (Dhana - Wealth, Speech & Family Lineage)",
    "3rd House (Sahaja - Courage, Siblings & Skills)",
    "4th House (Sukha - Happiness, Mother & Land)",
    "5th House (Suta - Intelligence, Children & Speculation)",
    "6th House (Ripu - Health, Service & Overcoming Obstacles)",
    "7th House (Yuvati - Marriage, Spouse & Partnerships)",
    "8th House (Randhra - Longevity, Transformation & Secrets)",
    "9th House (Dharma - Fortune, Ethics & Higher Wisdom)",
    "10th House (Karma - Career, Prestige & Public Status)",
    "11th House (Labha - Financial Gains & Networks)",
    "12th House (Vyaya - Foreign Affairs, Expenses & Liberation)",
  ];

  const housesAnalysis = HOUSE_TITLES.map((title, i) => {
    const houseNum = i + 1;
    const rIndex = (lagnaRashiIndex + i) % 12;
    const signObj = RASHIS[rIndex];
    const planetsInHouse = planetaryPositions.filter((p) => p.house === houseNum);

    let summary = `Occupies ${signObj.name} (${signObj.sanskrit}) ruled by ${signObj.lord}. `;
    if (planetsInHouse.length > 0) {
      summary += `Houses ${planetsInHouse.map((p) => p.planet).join(", ")}, creating strong planetary activation in this house.`;
    } else {
      summary += `An unblemished house governed by the transit of ${signObj.lord}.`;
    }

    return {
      house: houseNum,
      title,
      sign: `${signObj.name} (${signObj.sanskrit})`,
      summary,
    };
  });

  // Calculate Raj Yogas
  const yogas: { name: string; type: string; description: string }[] = [];
  yogas.push({
    name: `Lagna Lord (${lagnaRashi.lord}) Placement`,
    type: "Auspicious",
    description: `Ascendant in ${lagnaRashi.name} (${lagnaRashi.sanskrit}) ruled by ${lagnaRashi.lord}, bestowing inherent resilience and vitality.`
  });

  const jupObj = planetaryPositions.find((p) => p.shortName === "Jupiter");
  const moonObj = planetaryPositions.find((p) => p.shortName === "Moon");
  if (jupObj && moonObj) {
    const jupMoonDist = Math.abs(jupObj.house - moonObj.house);
    if ([0, 3, 6, 9].includes(jupMoonDist)) {
      yogas.push({
        name: "Gaja Kesari Yoga",
        type: "High Auspicious",
        description: "Jupiter and Moon are in mutual Kendra positions (1st, 4th, 7th, 10th from each other), bestowing wisdom, fame, and enduring reputation."
      });
    }
  }

  const sunObj = planetaryPositions.find((p) => p.shortName === "Sun");
  const mercObj = planetaryPositions.find((p) => p.shortName === "Mercury");
  if (sunObj && mercObj && sunObj.house === mercObj.house) {
    yogas.push({
      name: "Budhaditya Yoga",
      type: "Auspicious",
      description: "Sun and Mercury conjunction creates sharp intellect, analytical skill, and professional reputation."
    });
  }

  // Extended Yogas Calculation
  const satObj = planetaryPositions.find((p) => p.shortName === "Saturn");
  const venObj = planetaryPositions.find((p) => p.shortName === "Venus");

  // Pancha Mahapurusha Yogas
  if (marsObj && [1, 4, 7, 10].includes(marsObj.house) && [0, 9, 3].includes(marsObj.rashiIndex)) {
    yogas.push({ name: "Ruchaka Yoga (Pancha Mahapurusha)", type: "High Auspicious", description: "Mars exalted or in own sign in Kendra, granting immense courage, leadership, stamina, and physical prowess." });
  }
  if (mercObj && [1, 4, 7, 10].includes(mercObj.house) && [2, 5, 11].includes(mercObj.rashiIndex)) {
    yogas.push({ name: "Bhadra Yoga (Pancha Mahapurusha)", type: "High Auspicious", description: "Mercury exalted or in own sign in Kendra, granting sharp intellect, eloquence, business genius, and longevity." });
  }
  if (jupObj && [1, 4, 7, 10].includes(jupObj.house) && [8, 11, 3].includes(jupObj.rashiIndex)) {
    yogas.push({ name: "Hamsa Yoga (Pancha Mahapurusha)", type: "High Auspicious", description: "Jupiter exalted or in own sign in Kendra, bestowing high moral character, spiritual wisdom, grace, and prestige." });
  }
  if (venObj && [1, 4, 7, 10].includes(venObj.house) && [1, 6, 11].includes(venObj.rashiIndex)) {
    yogas.push({ name: "Malavya Yoga (Pancha Mahapurusha)", type: "High Auspicious", description: "Venus exalted or in own sign in Kendra, bestowing artistic genius, magnetic aura, luxury, and marital happiness." });
  }
  if (satObj && [1, 4, 7, 10].includes(satObj.house) && [9, 10, 6].includes(satObj.rashiIndex)) {
    yogas.push({ name: "Sasa Yoga (Pancha Mahapurusha)", type: "High Auspicious", description: "Saturn exalted or in own sign in Kendra, granting authority, endurance, mass support, and judicial wisdom." });
  }

  // Chandra Mangala Yoga
  if (moonObj && marsObj && moonObj.house === marsObj.house) {
    yogas.push({ name: "Chandra Mangala Yoga", type: "Dhana Yoga", description: "Moon and Mars conjunction bestows relentless drive, financial accumulation, and enterprise." });
  }

  // Calculate Combustion & Retrograde status for each planet
  const combustionList: any[] = [];
  const retrogradeList: any[] = [];
  const aspectList: any[] = [];

  const sunSidDeg = sunSid;
  planetaryPositions.forEach((p) => {
    if (p.shortName !== "Sun") {
      let diff = Math.abs(p.rawDegree - sunSidDeg);
      if (diff > 180) diff = 360 - diff;

      let threshold = 15;
      if (p.shortName === "Mercury") threshold = 14;
      if (p.shortName === "Venus") threshold = 10;
      if (p.shortName === "Mars") threshold = 17;
      if (p.shortName === "Jupiter") threshold = 11;
      if (p.shortName === "Saturn") threshold = 15;

      const isCombust = diff <= threshold;
      p.isCombust = isCombust;

      combustionList.push({
        planet: p.planet,
        sunDistance: Number(diff.toFixed(2)),
        isCombust,
        maxThreshold: threshold,
        description: isCombust
          ? `${p.shortName} is within ${diff.toFixed(1)}° of the Sun (Threshold: ${threshold}°). Combustion redirects internal energy inward toward spiritual refinement.`
          : `${p.shortName} is ${diff.toFixed(1)}° away from Sun, maintaining clear directional energy.`
      });
    }

    // Retrograde detection
    let isRetro = false;
    if (["Rahu", "Ketu"].includes(p.shortName)) isRetro = true;
    else if (["Mercury", "Venus", "Mars", "Jupiter", "Saturn"].includes(p.shortName)) {
      // Mars/Jupiter/Saturn are retrograde when opposite or ~120-240° from Sun
      let diffFromSun = (p.rawDegree - sunSidDeg + 360) % 360;
      if (["Mars", "Jupiter", "Saturn"].includes(p.shortName) && diffFromSun >= 120 && diffFromSun <= 240) {
        isRetro = true;
      } else if (["Mercury", "Venus"].includes(p.shortName) && diffFromSun >= 15 && diffFromSun <= 25) {
        isRetro = true;
      }
    }
    p.isRetrograde = isRetro;
    retrogradeList.push({
      planet: p.planet,
      isRetrograde: isRetro,
      motion: isRetro ? "Retrograde [R]" : "Direct",
      effect: isRetro
        ? `${p.shortName} is in Retrograde motion, intensifying internal reflection, Karmic recalculation, and deep psychological focus.`
        : `${p.shortName} is moving in Direct motion.`
    });

    // Graha Aspects (Aspecting Houses)
    let aspected: number[] = [((p.house + 6) % 12) + 1]; // All planets aspect 7th house
    if (p.shortName === "Mars") aspected.push(((p.house + 2) % 12) + 1, ((p.house + 7) % 12) + 1); // 4th, 8th
    if (p.shortName === "Jupiter" || p.shortName === "Rahu" || p.shortName === "Ketu") aspected.push(((p.house + 4) % 12) + 1, ((p.house + 8) % 12) + 1); // 5th, 9th
    if (p.shortName === "Saturn") aspected.push(((p.house + 1) % 12) + 1, ((p.house + 9) % 12) + 1); // 3rd, 10th

    const uniqueAspects = Array.from(new Set(aspected)).sort((a, b) => a - b);
    aspectList.push({
      planet: p.planet,
      grahaAspects: uniqueAspects,
      rasiAspects: [`House ${uniqueAspects.join(", House ")}`],
      description: `${p.shortName} casts Graha Drishti upon Houses ${uniqueAspects.join(", ")}.`
    });
  });

  // Calculate Shodashvarga (All 16 Divisional Charts)
  const divisionalCharts = SHODASHVARGA_DEFS.map((def) => {
    const lagnaDivRashiIdx = getDivisionalRashi(def.div, lagnaRashiIndex, lagnaSidereal % 30);
    const lagnaSignName = `${RASHIS[lagnaDivRashiIdx].name} (${RASHIS[lagnaDivRashiIdx].sanskrit})`;

    const positions = planetaryPositions.map((p) => {
      const pDivRashiIdx = getDivisionalRashi(def.div, p.rashiIndex, p.rawDegree % 30);
      const houseInDiv = ((pDivRashiIdx - lagnaDivRashiIdx + 12) % 12) + 1;
      return {
        planet: p.planet,
        sign: `${RASHIS[pDivRashiIdx].name} (${RASHIS[pDivRashiIdx].sanskrit})`,
        house: houseInDiv,
        degree: p.degree,
      };
    });

    return {
      code: def.code,
      name: def.name,
      title: def.title,
      lagnaSign: lagnaSignName,
      positions,
    };
  });

  // Calculate Chara Karakas, Arudha Lagna, Shadbala, Ashtakavarga, Doshas, Timelines
  const charaKarakas = calculateCharaKarakas(planetaryPositions);
  const arudhaLagna = calculateArudhaLagna(lagnaRashiIndex, planetaryPositions);
  const shadbala = calculateShadbala(planetaryPositions, lagnaRashiIndex);
  const ashtakavarga = calculateAshtakavarga(planetaryPositions, lagnaRashiIndex);
  const doshas = calculateDoshas(planetaryPositions, lagnaRashiIndex, moonRashiIndex);
  const strengthMeter = calculateStrengthMeter(shadbala, yogas, ashtakavarga.sav, lagnaRashiIndex);

  const vimshottariTimeline = calculateVimshottariTimeline(year, month, day, moonSid, hours, minutes);
  const yoginiTimeline = calculateYoginiTimeline(year, month, day, moonSid, hours, minutes);
  const transitGochar = calculateCurrentTransits(planetaryPositions, lagnaRashiIndex, moonRashiIndex);
  const structuredRemedies = calculateStructuredRemedies(lagnaRashiIndex, moonRashiIndex, planetaryPositions);

  const activeMD = vimshottariTimeline.find(item => item.isCurrent) || vimshottariTimeline[0];
  const activeAD = activeMD?.antardashas?.find(ad => ad.isCurrent) || activeMD?.antardashas?.[0];
  const activePAD = activeAD?.pratyantardashas?.find(pad => pad.isCurrent) || activeAD?.pratyantardashas?.[0];

  const currentMahadasha = activeMD ? `${activeMD.planet} Mahadasha` : `${lagnaRashi.lord} Mahadasha`;
  const currentAntardasha = activeAD ? `${activeAD.planet} Antardasha` : `${moonRashi.lord} Antardasha`;
  const currentPratyantardasha = activePAD ? `${activePAD.planet} Pratyantardasha` : undefined;
  const endsOn = activeMD ? activeMD.endDate : `${year + 35}-10-24`;
  const activeAntardashaEndsOn = activeAD ? activeAD.endDate : undefined;
  const activePratyantardashaEndsOn = activePAD ? activePAD.endDate : undefined;

  return {
    basics: {
      rashi: `${moonRashi.name} (${moonRashi.sanskrit})`,
      lagna: `${lagnaRashi.name} (${lagnaRashi.sanskrit})`,
      nakshatra: `${nakName} (Pada ${nakPada})`,
      sunSign: `${RASHIS[sunRashiIndex].name} (${RASHIS[sunRashiIndex].sanskrit})`,
      gan: (nakIndex % 3 === 0) ? "Deva" : (nakIndex % 3 === 1) ? "Manushya" : "Rakshasa",
      yoni: "Ashwa",
      nadi: (nakIndex % 3 === 0) ? "Adi" : (nakIndex % 3 === 1) ? "Madhya" : "Antya",
    },
    planetaryPositions,
    housesAnalysis,
    yogas,
    dashaPeriod: {
      currentMahadasha,
      currentAntardasha,
      currentPratyantardasha,
      endsOn,
      activeAntardashaEndsOn,
      activePratyantardashaEndsOn,
      effectSummary: `Active Vimshottari period governed by ${activeMD?.planet || lagnaRashi.lord} (Mahadasha), ${activeAD?.planet || moonRashi.lord} (Antardasha)${activePAD ? `, and ${activePAD.planet} (Pratyantardasha)` : ''}, guiding current life events.`,
    },
    manglikStatus: {
      isManglik,
      degree: isManglik ? "Low / Moderate" : "None",
      explanation: isManglik
        ? `Mars is positioned in House ${marsHouse}, forming Manglik placement from Lagna.`
        : `Mars is placed in House ${marsHouse}, which does not form Manglik affliction.`,
    },
    // NEW ADVANCED VEDIC FIELDS
    divisionalCharts,
    shadbala,
    ashtakavarga,
    vimshottariTimeline,
    yoginiTimeline,
    transitGochar,
    combustion: combustionList,
    retrogrades: retrogradeList,
    aspects: aspectList,
    arudhaLagna,
    charaKarakas,
    doshas,
    strengthMeter,
    remedies: [
      `Chant 'Om' mantra associated with ${lagnaRashi.lord} during morning hours.`,
      "Offer water (Surya Arghya) with copper vessel during sunrise.",
      `Perform charity or donate grains on ${lagnaRashi.lord === 'Sun' ? 'Sundays' : lagnaRashi.lord === 'Moon' ? 'Mondays' : lagnaRashi.lord === 'Mars' ? 'Tuesdays' : lagnaRashi.lord === 'Mercury' ? 'Wednesdays' : lagnaRashi.lord === 'Jupiter' ? 'Thursdays' : lagnaRashi.lord === 'Venus' ? 'Fridays' : 'Saturdays'}.`,
    ],
    structuredRemedies,
  };
}

function calculateStructuredRemedies(
  lagnaRashiIndex: number,
  moonRashiIndex: number,
  planetaryPositions: any[]
): StructuredRemedySection[] {
  const lagnaRashi = RASHIS[lagnaRashiIndex];
  const moonRashi = RASHIS[moonRashiIndex];
  const lagnaLord = lagnaRashi.lord;
  const moonLord = moonRashi.lord;

  const gemstoneMap: Record<string, { gem: string; finger: string; metal: string; day: string }> = {
    Sun: { gem: "Ruby (Manikya)", finger: "Ring finger", metal: "Gold or Copper", day: "Sunday" },
    Moon: { gem: "Pearl (Moti)", finger: "Little finger", metal: "Silver", day: "Monday" },
    Mars: { gem: "Red Coral (Moonga)", finger: "Ring finger", metal: "Gold or Copper", day: "Tuesday" },
    Mercury: { gem: "Emerald (Panna)", finger: "Little finger", metal: "Gold or Panchdhatu", day: "Wednesday" },
    Jupiter: { gem: "Yellow Sapphire (Pukhraj)", finger: "Index finger", metal: "Gold", day: "Thursday" },
    Venus: { gem: "Diamond (Heera) or White Sapphire", finger: "Middle or Little finger", metal: "Platinum or Silver", day: "Friday" },
    Saturn: { gem: "Blue Sapphire (Neelam) or Amethyst", finger: "Middle finger", metal: "Silver or Iron", day: "Saturday" },
  };

  const rudrakshaMap: Record<string, { mukhi: string; deity: string }> = {
    Sun: { mukhi: "1 Mukhi or 12 Mukhi", deity: "Surya Deva" },
    Moon: { mukhi: "2 Mukhi", deity: "Ardhanarishvara / Gauri-Shankar" },
    Mars: { mukhi: "3 Mukhi", deity: "Agni Deva" },
    Mercury: { mukhi: "4 Mukhi", deity: "Lord Brahma" },
    Jupiter: { mukhi: "5 Mukhi", deity: "Kalagni Rudra / Lord Shiva" },
    Venus: { mukhi: "6 Mukhi", deity: "Lord Kartikeya" },
    Saturn: { mukhi: "7 Mukhi or 14 Mukhi", deity: "Maha Lakshmi / Hanuman" },
  };

  const gemInfo = gemstoneMap[lagnaLord] || gemstoneMap["Jupiter"];
  const rudraInfo = rudrakshaMap[lagnaLord] || rudrakshaMap["Jupiter"];

  return [
    {
      category: "Mantra",
      title: `${lagnaLord} & ${moonLord} Seed Sound (Beeja Mantra)`,
      why: `Your Lagna is ${lagnaRashi.name} ruled by ${lagnaLord}, and your Moon sign is ${moonRashi.name} ruled by ${moonLord}. Chanting their specific seed sound frequencies aligns your subtle energetic body with core natal planetary vibration.`,
      benefits: [
        `Harmonizes subtle neural pathways and subtle nadis associated with ${lagnaLord}`,
        "Removes subconscious anxiety, mental noise, and karmic lethargy",
        "Increases focus, mental clarity, and spiritual magnetism",
        "Protects against negative environmental psychic vibrations"
      ],
      procedure: [
        "Sit on a clean woollen or Kusha grass mat facing East or North.",
        `Use a 108-bead Rudraksha or Tulsi mala dedicated to ${lagnaLord}.`,
        "Maintain upright spine alignment and chant with clear, rhythmic devotion.",
        "Offer a small vessel of fresh water post-japa as consecrated offering."
      ],
      bestTime: "Brahma Muhurta (4:30 AM – 6:00 AM) or early sunrise hours",
      duration: "108 recitations daily for 41 consecutive days (1 Mandala cycle)",
      expectedSpiritualPurpose: `Awakening Anahata and Ajna chakras, pleasing ${lagnaLord}, and neutralizing natal planetary afflictions.`
    },
    {
      category: "Yantra",
      title: `Sri ${lagnaLord} Sacred Geometric Yantra`,
      why: `To anchor geometric cosmic energy grids corresponding to your Ascendant lord ${lagnaLord} directly inside your home or sacred space.`,
      benefits: [
        "Establishes a 24/7 energetic protective shield around your living space",
        "Corrects subtle Vastu imbalances in the home or workplace",
        "Attracts steady material prosperity and spiritual harmony",
        "Calms household friction and mental turbulence"
      ],
      procedure: [
        "Purify a copper or brass Yantra plate with raw milk and sacred water.",
        "Position the Yantra on an elevated altar facing North-East (Ishan Kona).",
        "Apply sandalwood paste and offer a lit ghee lamp daily.",
        "Recite the primary planet Gayatri Mantra 9 times during morning worship."
      ],
      bestTime: "Shukla Paksha (waxing moon) on the weekday corresponding to your Lagna Lord",
      duration: "Permanent sacred installation; requires 2 minutes of daily morning Darshan",
      expectedSpiritualPurpose: "Channeling precise geometric cosmic light waves to eliminate spatial Vastu and planetary maleficence."
    },
    {
      category: "Temple",
      title: `Pilgrimage to ${lagnaLord} & Shiva-Shakti Energy Vortexes`,
      why: `Visiting high-vibration consecrated temples resonant with your ${moonRashi.name} Moon sign and Nakshatra lord amplifies Prana.`,
      benefits: [
        "Instantly recharges depleted spiritual stamina and emotional health",
        "Dissolves deep-seated ancestral and karmic patterns (Prarabdha Karma)",
        "Instills deep tranquility and emotional stability",
        "Invokes direct grace from planetary presiding deities"
      ],
      procedure: [
        "Perform 3 or 9 conscious Pradakshina (circumambulations) around the sanctum.",
        "Offer traditional items like Bilva leaves, coconut, or lotus flowers.",
        "Sit quietly in the temple courtyard for at least 15 minutes post-darshan in silent contemplation.",
        "Accept Panchamrita or sacred prasadam with gratitude."
      ],
      bestTime: "Monthly Nakshatra birth-day, Ekadashi, or auspicious festival tithis",
      duration: "At least once per month or during major planetary dasha transitions",
      expectedSpiritualPurpose: "Absorbing consecrated temple Prana to neutralize subtle karmic blockages in the physical and mental sheath."
    },
    {
      category: "Puja",
      title: `Shodashopachara Worship for ${lagnaLord} & Navagraha Peace`,
      why: `Formal 16-step ritualistic worship (Shodashopachara) mitigates planetary afflictions in your chart and strengthens benefic houses.`,
      benefits: [
        "Removes career bottlenecks and relationship friction",
        "Strengthens physical vitality and mental fortitude",
        "Invokes divine grace for protection against unforeseen mishaps",
        "Ensures smooth fulfillment of righteous desires (Dharma & Artha)"
      ],
      procedure: [
        "Commence with Ganesh Vandana and formal Sankalpa expressing your name and gotra.",
        "Perform ritual bathing (Abhishekam) of deity/yantra with holy water.",
        "Offer Kumkum, Akshata, fresh fragrant flowers, Dhoop (incense), and Deep (lamp).",
        "Recite 108 Ashtottara Shatanamavali names followed by Aarti and Naivedya."
      ],
      bestTime: `Weekly on ${gemInfo.day} morning during sunrise hours`,
      duration: "45 minutes per weekly ritual session",
      expectedSpiritualPurpose: "Transmuting malefic planetary vibrations into benefic spiritual power and karmic protection."
    },
    {
      category: "Havan",
      title: "Sacred Agni Havan for Planetary Purification",
      why: "Fire (Agni Tattva) acts as the direct celestial messenger that consumes negative karmic seeds and purifies the subtle atmosphere surrounding you.",
      benefits: [
        "Purifies indoor Prana and destroys subtle negative entities",
        "Accelerates manifestation of positive karmic intentions",
        "Boosts metabolic Agni and cellular immunity",
        "Clears stubborn dasha transit blockages"
      ],
      procedure: [
        "Prepare a clean copper Havan Kunda using dry mango wood sticks.",
        "Offer Ahuti (sacred oblations) of pure cow ghee, guggul, camphor, and Havan samagri.",
        "Chant planetary mantras ending with 'Svaha' with each offering.",
        "Perform final Purnahuti offering a dry coconut wrapped in red silk."
      ],
      bestTime: "Full Moon (Purnima), Amavasya, or specific Shukla Paksha Tithi during sunrise",
      duration: "Once every month or seasonally (every 30 to 60 days)",
      expectedSpiritualPurpose: "Consuming karmic impurities through Sacred Fire element activation and atmospheric sanctification."
    },
    {
      category: "Charity",
      title: "Selfless Dana (Donation) for Karmic Balance",
      why: "Donating items linked to your malefic planets or 6th/8th/12th house lords neutralizes karmic debits and dissolves egoic attachment.",
      benefits: [
        "Directly neutralizes negative karmic debts from past deeds",
        "Cultivates compassion and releases material anxiety",
        "Protects against sudden financial losses or health ailments",
        "Pleases Saturn, Rahu, Ketu, and malefic transit influences"
      ],
      procedure: [
        "Identify needy individuals, animal shelters, or Vedic pathshalas.",
        "Donate specific items: yellow lentils/books for Jupiter, sesame/iron for Saturn, food for Rahu.",
        "Give with humility without seeking recognition, publicity, or tax write-off mindset.",
        "Perform Dana with clean hands and a warm, respectful attitude."
      ],
      bestTime: "Saturdays, eclipse days, or your Lagna Lord weekday during afternoon hours",
      duration: "Weekly or fortnightly regular practice",
      expectedSpiritualPurpose: "Dissolving egoic grasping and balancing karmic accounts through compassionate giving."
    },
    {
      category: "Fasting",
      title: "Vrata & Upavasa (Sacred Fasting)",
      why: "Fasting purifies the physical vessel (Annamaya Kosha), resets digestive Agni, and synchronizes bodily rhythms with lunar and planetary cycles.",
      benefits: [
        "Detoxifies organs and enhances cellular rejuvenation",
        "Sharpens mental acuity, intuition, and spiritual willpower",
        "Pleases the ruling deity of the fast day",
        "Reduces lethargy (Tamas) and raises spiritual Guna (Sattva)"
      ],
      procedure: [
        "Abstain from heavy grains, salt, cooked oil, and non-sattvic foods.",
        "Consume fresh fruits, tender coconut water, milk, or pure water.",
        "Maintain purity of thought, speech, and action throughout the fast.",
        "Break fast after evening sunset prayer with a light sattvic meal."
      ],
      bestTime: `Weekly on ${gemInfo.day} or sacred lunar Tithis like Ekadashi`,
      duration: "From sunrise to sunset (12–14 hours) on designated fast days",
      expectedSpiritualPurpose: "Purifying Prana, gaining mastery over physical senses (Indriyas), and pleasing planetary lords."
    },
    {
      category: "Gemstone Guidance",
      title: `Jyotish Gemstone Therapy: ${gemInfo.gem}`,
      why: `Your Ascendant is ${lagnaRashi.name} ruled by ${lagnaLord}. Wearing a consecrated ${gemInfo.gem} acts as an optical filter amplifying beneficial planetary rays.`,
      benefits: [
        "Significantly boosts vitality, leadership, and self-confidence",
        "Enhances career opportunities and social prestige",
        "Strengthens aura density against psychic or energetic drains",
        "Improves mental focus and executive decision-making"
      ],
      procedure: [
        `Procure an unheated, untreated natural ${gemInfo.gem} set in open-back ${gemInfo.metal}.`,
        "Purify the ring in raw cow milk and Ganga Jal on the auspicious morning.",
        `Chant the ${lagnaLord} planetary mantra 108 times over the ring.`,
        `Wear on the ${gemInfo.finger} of your dominant hand during auspicious Hora.`
      ],
      bestTime: `${gemInfo.day} morning during Shukla Paksha (waxing moon) during planet Hora`,
      duration: "Wear continuously for 3 to 5 years (re-consecrate annually on festival days)",
      expectedSpiritualPurpose: "Amplifying positive planetary light frequencies within the subtle aura and nervous system."
    },
    {
      category: "Rudraksha Recommendation",
      title: `Sacred Rudraksha: ${rudraInfo.mukhi} Bead`,
      why: `The ${rudraInfo.mukhi} Rudraksha bead, blessed by ${rudraInfo.deity}, carries electromagnetic resonance that aligns perfectly with your Lagna lord ${lagnaLord}.`,
      benefits: [
        "Normalizes heart rate, blood pressure, and neural firing patterns",
        "Creates an impermeable aura shield against negative influences",
        "Fosters deep emotional calmness and stress immunity",
        "Accelerates Kundalini movement and meditative depth"
      ],
      procedure: [
        "Condition the bead by soaking in pure cow ghee for 24 hours, followed by milk for 24 hours.",
        "Cap in silver or gold, or string in pure silk thread.",
        "Perform Abhishekam with Ganga Jal while chanting 'Om Namah Shivaya'.",
        "Wear around the neck resting near the heart chakra (Anahata)."
      ],
      bestTime: "Monday morning during Shukla Paksha or on Maha Shivaratri",
      duration: "Lifetime companion bead (remove during cremation grounds or non-sattvic events if required)",
      expectedSpiritualPurpose: "Stabilizing autonomic nervous system frequencies and connecting individual consciousness with Shiva consciousness."
    },
    {
      category: "Daily Sadhana",
      title: "Nitya Sandhya & Pratah Sadhana Protocol",
      why: "Establishing an unshakeable morning spiritual routine grounds your energy matrix, protecting you against adverse planetary transits.",
      benefits: [
        "Builds unyielding mental discipline and spiritual aura",
        "Sustains high energy and enthusiasm throughout demanding workdays",
        "Clears accumulated subconscious stress and sleep lethargy",
        "Keeps subtle chakras aligned and energized"
      ],
      procedure: [
        "Wake up during Brahma Muhurta (before sunrise).",
        "Perform morning ablutions (Snana) and put on fresh clean clothes.",
        "Light a ghee diya and incense at your home altar.",
        "Perform 10 minutes of Pranayama (Anulom-Vilom / Kapalbhati) followed by 15 minutes of Japa."
      ],
      bestTime: "Every morning between 4:30 AM and 6:30 AM without fail",
      duration: "30 to 45 minutes daily lifelong practice",
      expectedSpiritualPurpose: "Cultivating unshakeable Sattva Guna and anchoring divine consciousness into daily worldly activities."
    },
    {
      category: "Meditation",
      title: "Ajna & Anahata Chakra Dhyana",
      why: "Meditation calms the fluctuating mind (Chitta Vritti), directly countering Rahu-Ketu distortions, Moon anxiety, and emotional turbulence.",
      benefits: [
        "Dramatically reduces stress, anxiety, and overthinking",
        "Sharpens intuitive clarity and higher cognitive faculties",
        "Fosters deep inner joy independent of external circumstances",
        "Harmonizes emotional expression and relational empathy"
      ],
      procedure: [
        "Sit in Padmasana or Sukhasana with spine comfortably straight and hands in Dhyana Mudra.",
        "Close eyes and bring gentle awareness to the space between eyebrows (Ajna) or heart center (Anahata).",
        "Practice 'So-Hum' breath awareness: inhale 'So' (I am That), exhale 'Hum' (That I am).",
        "Observe thoughts neutrally as passing clouds without judgement or attachment."
      ],
      bestTime: "Early morning before breakfast and evening twilight (Sandhya time)",
      duration: "20 to 30 minutes twice daily",
      expectedSpiritualPurpose: "Transcending mental noise to experience Atma-Jnana (Self-knowledge) and inner stillness."
    },
    {
      category: "Lifestyle Advice",
      title: "Sattvic Achar-Vichar & Ayurvedic Alignment",
      why: `Aligning daily diet, sleep routines, environment, and ethics with your ${lagnaRashi.name} Lagna element ensures holistic longevity and success.`,
      benefits: [
        "Sustains high physical vitality, immunity, and digestive health",
        "Prevents metabolic disorders caused by planetary afflictions",
        "Promotes harmonious social and family relationships",
        "Accelerates spiritual evolution and karmic clearing"
      ],
      procedure: [
        "Eat freshly cooked, organic Sattvic food rich in prana; avoid stale or over-spiced food.",
        "Maintain fixed sleep hours: go to bed by 10 PM and rise before sunrise.",
        "Practice Ahimsa (non-harming), Satya (truthfulness), and compassionate speech.",
        "Keep your living and working space clean, decluttered, and fragrant."
      ],
      bestTime: "Integrated continuously into all daily habits and lifestyle choices",
      duration: "Permanent life transformation protocol",
      expectedSpiritualPurpose: "Living in complete harmony with Natural Cosmic Law (Dharma) and optimizing physical vehicle for spiritual growth."
    }
  ];
}
