const trimTrailingSlash = (value = "") => value.replace(/\/+$/, "");

export const API_BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_URL || "");

export const apiUrl = (path) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};
