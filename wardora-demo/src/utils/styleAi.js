import { outfitTemplates, shoppingProducts } from "../data/wardoraData";

const DEFAULT_PROFILE = {
  dominantColor: "#d8c7f2",
  brightness: 76,
  warmth: 48,
  saturation: 36,
  contrast: 42,
  palette: ["#f7f1ff", "#d8c7f2", "#8b5fbf", "#f6c4d9"],
  mood: "luminos si rece",
  tags: ["bright", "cool", "soft"],
  insight: "Profil neutru: recomand palete luminoase, lavanda si alb optic.",
};

function toHex(value) {
  return value.toString(16).padStart(2, "0");
}

function rgbToHex(r, g, b) {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function distanceScore(left, right) {
  if (left === right) return 12;
  if (left === "All season" || right === "All season") return 7;
  return 0;
}

function buildPalette(r, g, b, brightness, warmth) {
  const base = rgbToHex(r, g, b);
  const light = brightness > 58 ? "#ffffff" : "#f7f1ff";
  const accent = warmth > 58 ? "#d94f9b" : "#7a3cc7";
  const grounding = brightness > 50 ? "#351744" : "#f6c6df";
  return [light, base, accent, grounding];
}

function profileFromRgb(r, g, b, saturation) {
  const brightness = Math.round(((0.299 * r + 0.587 * g + 0.114 * b) / 255) * 100);
  const warmth = Math.round((((r - b) + 255) / 510) * 100);
  const contrast = Math.round(clamp(Math.abs(brightness - 52) + saturation / 2, 0, 100));
  const tags = [
    brightness > 62 ? "bright" : "dark",
    warmth > 56 ? "warm" : "cool",
    saturation > 42 ? "structured" : "soft",
  ];
  const mood = `${brightness > 62 ? "luminos" : "profund"} si ${warmth > 56 ? "cald" : "rece"}`;
  const colorAdvice = warmth > 56 ? "rose, burgundy si ivory" : "lavanda, alb optic si argintiu";

  return {
    dominantColor: rgbToHex(r, g, b),
    brightness,
    warmth,
    saturation,
    contrast,
    palette: buildPalette(r, g, b, brightness, warmth),
    mood,
    tags,
    insight: `Imaginea are un profil ${mood}. Wardora va favoriza ${colorAdvice}.`,
  };
}

export function analyzeImageDataUrl(dataUrl) {
  if (!dataUrl) return Promise.resolve(DEFAULT_PROFILE);

  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const size = 96;
      canvas.width = size;
      canvas.height = size;

      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        resolve(DEFAULT_PROFILE);
        return;
      }

      context.drawImage(image, 0, 0, size, size);
      const pixels = context.getImageData(0, 0, size, size).data;
      let r = 0;
      let g = 0;
      let b = 0;
      let saturation = 0;
      let count = 0;

      for (let index = 0; index < pixels.length; index += 24) {
        const alpha = pixels[index + 3];
        if (alpha < 80) continue;

        const red = pixels[index];
        const green = pixels[index + 1];
        const blue = pixels[index + 2];
        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);

        r += red;
        g += green;
        b += blue;
        saturation += max === 0 ? 0 : ((max - min) / max) * 100;
        count += 1;
      }

      if (!count) {
        resolve(DEFAULT_PROFILE);
        return;
      }

      resolve(
        profileFromRgb(
          Math.round(r / count),
          Math.round(g / count),
          Math.round(b / count),
          Math.round(saturation / count),
        ),
      );
    };
    image.onerror = () => resolve(DEFAULT_PROFILE);
    image.src = dataUrl;
  });
}

function scoreTemplate(template, criteria, aiProfile) {
  let score = 44;
  const reasons = [];

  if (template.style === criteria.style) {
    score += 18;
    reasons.push(`stilul ${criteria.style}`);
  }
  if (template.occasion.includes(criteria.occasion)) {
    score += 15;
    reasons.push(`ocazia ${criteria.occasion}`);
  }
  if (template.weather.includes(criteria.weather)) {
    score += 10;
    reasons.push(`vremea ${criteria.weather}`);
  }
  score += Math.max(...template.season.map((season) => distanceScore(season, criteria.season)));

  if (template.dressCode === criteria.dressCode) score += 10;
  if (template.bodyFocus === criteria.bodyFocus) score += 9;
  if (template.colorMood === criteria.colorMood) score += 10;
  if (template.budget === criteria.budget) score += 6;
  if (template.comfort === criteria.comfort) score += 6;

  const aiMatches = template.aiTags.filter((tag) => aiProfile.tags.includes(tag)).length;
  score += aiMatches * 7;
  if (aiMatches) reasons.push(`profilul vizual ${aiProfile.mood}`);

  return {
    score: clamp(Math.round(score), 0, 99),
    reasons: reasons.length ? reasons : ["criteriile principale selectate"],
  };
}

export function getOutfitVariants(criteria, aiProfile = DEFAULT_PROFILE, isPremium = false) {
  return outfitTemplates
    .filter((template) => isPremium || !template.premium)
    .map((template) => {
      const result = scoreTemplate(template, criteria, aiProfile);
      return { ...template, matchScore: result.score, reasons: result.reasons };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

export function buildOutfitRecommendation(criteria, aiProfile = DEFAULT_PROFILE, isPremium, historyLength = 0) {
  const variants = getOutfitVariants(criteria, aiProfile, isPremium);
  const shortList = variants.slice(0, isPremium ? 4 : 2);
  const selected = shortList[historyLength % shortList.length];

  return {
    ...selected,
    criteria: { ...criteria },
    aiProfile,
    date: new Date().toLocaleDateString("ro-RO", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    recommendation: `Am ales ${selected.title} pentru ${selected.reasons.join(", ")}. Paleta foto detectata este ${aiProfile.dominantColor}, cu luminozitate ${aiProfile.brightness}%.`,
  };
}

function productScore(product, criteria, outfit) {
  const selectedSignals = [
    criteria.emotion,
    criteria.audience,
    criteria.style,
    criteria.occasion,
    criteria.season,
    criteria.weather,
    criteria.dressCode,
    criteria.bodyFocus,
    criteria.colorMood,
    criteria.budget,
    criteria.comfort,
    outfit?.style,
    outfit?.title,
  ].filter(Boolean);

  const score = product.tags.reduce((total, tag) => total + (selectedSignals.includes(tag) ? 16 : 0), 38);
  const audienceBoost = product.audience?.includes(criteria.audience) || product.audience?.includes("Unisex") ? 22 : -18;
  const outfitBoost = outfit?.shopping?.some((item) => product.name.toLowerCase().includes(item.split(" ")[0]?.toLowerCase())) ? 8 : 0;
  return clamp(score + audienceBoost + outfitBoost, 0, 99);
}

export function getShoppingRecommendations(criteria, outfit, isPremium = false) {
  const ranked = shoppingProducts
    .map((product) => ({
      ...product,
      matchScore: productScore(product, criteria, outfit),
    }))
    .sort((a, b) => b.matchScore - a.matchScore);

  return isPremium ? ranked : ranked.slice(0, 12);
}

export { DEFAULT_PROFILE };
