const API_URL = "http://localhost:5000";

export async function apiFetch(url, options = {}) {
  const res = await fetch(API_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    throw new Error("AUTH_EXPIRED");
  }

  if (res.status === 403) {
    throw new Error("AUTH_EXPIRED");
  }

  return res;
}
