const STORAGE_KEY = "growth-os-v1";
const UPDATED_AT_KEY = "growth-os-v1-updated-at";

export function loadData(fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem(UPDATED_AT_KEY, new Date().toISOString());
  } catch {
    // storage unavailable (private mode, quota, etc) — fail silently
  }
}

export function getLocalUpdatedAt() {
  try {
    return localStorage.getItem(UPDATED_AT_KEY);
  } catch {
    return null;
  }
}
