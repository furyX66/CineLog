const BASE_URL = "http://192.168.100.3:5220/api";

export async function apiFetch<T>(
  endpoint?: string,
  options: RequestInit = {},
  token?: string,
  externalUrl?: string,
): Promise<T> {
  const url = externalUrl ? `${externalUrl}` : `${BASE_URL}${endpoint}`;
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

export async function apiGet<T>(
  endpoint?: string,
  token?: string,
  externalUrl?: string,
): Promise<T> {
  return apiFetch<T>(endpoint, { method: "GET" }, token, externalUrl);
}

export async function apiPost<T>(
  body: any,
  endpoint?: string,
  token?: string,
  externalUrl?: string,
): Promise<T> {
  return apiFetch<T>(
    endpoint,
    { method: "POST", body: JSON.stringify(body) },
    token,
    externalUrl,
  );
}

export function extractErrorMessage(fullError: string): string {
  try {
    const jsonMatch = fullError.match(/Error Message:\s*(\{.*\})/);
    if (jsonMatch) {
      const errorJson = JSON.parse(jsonMatch[1]);
      let message =
        errorJson.detail ||
        errorJson.title ||
        errorJson.message ||
        "Server Error";

      message = message.replace(/^["']+|["']+$/g, "");
      return message;
    }

    const simpleMatch = fullError.match(/Error Message:\s*(.+)$/);
    if (simpleMatch) {
      let message = simpleMatch[1].trim();
      message = message.replace(/^["']+|["']+$/g, "");
      return message;
    }
    return fullError.replace(/^["']+|["']+$/g, "");
  } catch {
    return fullError.replace(/^["']+|["']+$/g, "");
  }
}
