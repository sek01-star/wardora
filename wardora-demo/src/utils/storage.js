import { defaultCriteria } from "../data/wardoraData";

export const STORAGE_KEYS = {
  account: "wardora_account",
  session: "wardora_session",
  premium: "wardora_premium",
  history: "wardora_outfit_history",
  wardrobe: "wardora_wardrobe",
  criteria: "wardora_criteria",
  aiProfile: "wardora_ai_profile",
};

export function readJson(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getInitialAccount() {
  const session = window.localStorage.getItem(STORAGE_KEYS.session);
  if (session === "signed-out") return null;
  return readJson(STORAGE_KEYS.account, null);
}

export function getInitialHistory() {
  return readJson(STORAGE_KEYS.history, []);
}

export function getInitialWardrobe() {
  return readJson(STORAGE_KEYS.wardrobe, []);
}

export function getInitialCriteria() {
  return { ...defaultCriteria, ...readJson(STORAGE_KEYS.criteria, {}) };
}

export function getInitialAiProfile() {
  return readJson(STORAGE_KEYS.aiProfile, null);
}

export function buildAccount(form, previousAccount) {
  const fallbackName = form.email ? form.email.split("@")[0] : "Wardora Muse";
  return {
    name: form.name?.trim() || previousAccount?.name || fallbackName,
    email: form.email?.trim() || previousAccount?.email || "demo@wardora.local",
    premium: Boolean(previousAccount?.premium),
    photo: previousAccount?.photo || "",
    createdAt: previousAccount?.createdAt || new Date().toISOString(),
    upgradedAt: previousAccount?.upgradedAt || "",
  };
}
