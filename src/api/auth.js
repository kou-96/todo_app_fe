const API_URL = "http://localhost:5000";

/* ===============================
   共通 fetch（認証付き）
================================ */
export async function apiFetch(url, options = {}) {
  const accessToken = localStorage.getItem("accessToken");

  const res = await fetch(API_URL + url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),
      ...options.headers,
    },
  });

  // accessToken 期限切れ
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();

    // refreshToken も期限切れ or 無効
    if (!refreshed) {
      throw new Error("AUTH_EXPIRED");
    }

    // refresh 成功 → 再リクエスト
    return apiFetch(url, options);
  }

  // refreshToken が無効な場合など
  if (res.status === 403) {
    throw new Error("AUTH_EXPIRED");
  }

  return res;
}

/* ===============================
   accessToken 再発行
================================ */
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) return false;

  const res = await fetch(API_URL + "/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return false;

  const data = await res.json();
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return true;
}
