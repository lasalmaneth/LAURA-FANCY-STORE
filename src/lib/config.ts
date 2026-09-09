export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? window.location.origin : "http://localhost:8080");

export const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";
