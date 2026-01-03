const BASE_URL = "http://192.168.100.3:5220/api";

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(
      `API Error: ${response.status}, Error Message: ${errorMessage}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function apiGet<T>(endpoint: string, token?: string): Promise<T> {
  return apiFetch<T>(endpoint, { method: "GET" }, token);
}

export async function apiPost<T>(
  endpoint: string,
  body: any,
  token?: string,
): Promise<T> {
  return apiFetch<T>(
    endpoint,
    { method: "POST", body: JSON.stringify(body) },
    token,
  );
}

export function extractErrorMessage(fullError: string): string {
  try {
    const jsonMatch = fullError.match(/Error Message:\s*(\{.*\})/);
    if (jsonMatch) {
      const errorJson = JSON.parse(jsonMatch[1]);
      return (
        errorJson.detail ||
        errorJson.title ||
        errorJson.message ||
        "Server Error"
      );
    }

    const simpleMatch = fullError.match(/Error Message:\s*(.+)$/);
    if (simpleMatch) {
      return simpleMatch[1].trim();
    }

    return fullError;
  } catch {
    return fullError;
  }
}
