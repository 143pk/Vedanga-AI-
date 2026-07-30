export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<{ ok: boolean; status: number; data: T | null; error?: string }> {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      if (!res.ok) {
        return {
          ok: false,
          status: res.status,
          data: data,
          error: data?.error || `Request failed with status ${res.status}`,
        };
      }
      return { ok: true, status: res.status, data };
    } else {
      // Returned non-JSON (e.g. 404 HTML on static host like Cloudflare Pages)
      return {
        ok: false,
        status: res.status,
        data: null,
        error: "Non-JSON response from server (static environment or backend endpoint unmapped).",
      };
    }
  } catch (err: any) {
    return {
      ok: false,
      status: 0,
      data: null,
      error: err.message || "Network error",
    };
  }
}
