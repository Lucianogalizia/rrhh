import { getToken } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const token = typeof window !== "undefined" ? getToken() : null;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  const token = typeof window !== "undefined" ? getToken() : null;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }

  return res.json();
}
