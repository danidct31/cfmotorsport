const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
const TOKEN_KEY = "cf_token";

export type JobItem = {
  id: string;
  kind?: string;
  text: string;
  checked: boolean;
  dueDate?: string | null;
  priority?: number;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers,
    cache: "no-store",
  });
  if (!res.ok) {
    const message = await res.text();
    throw new Error(message || `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  me: () =>
    request<{ authenticated: boolean; office: boolean }>("/auth/me"),
  login: async (password: string) => {
    const result = await request<{
      ok: boolean;
      office: boolean;
      token: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    setToken(result.token);
    return result;
  },
  logout: async () => {
    try {
      await request<{ ok: boolean }>("/auth/logout", { method: "POST" });
    } finally {
      setToken(null);
    }
  },
  listJobs: (kind: string) => request<JobItem[]>(`/jobs/${kind}`),
  createJob: (kind: string, text: string) =>
    request<JobItem>(`/jobs/${kind}`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  updateJob: (
    id: string,
    data: {
      text?: string;
      checked?: boolean;
      dueDate?: string | null;
      priority?: number;
    },
  ) =>
    request<JobItem>(`/jobs/item/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteJob: (id: string) =>
    request<{ ok: boolean }>(`/jobs/item/${id}`, { method: "DELETE" }),
  listNotes: (parentId: string) => request<JobItem[]>(`/notes/${parentId}`),
  createNote: (parentId: string, text: string) =>
    request<JobItem>(`/notes/${parentId}`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  updateNote: (id: string, data: { text?: string; checked?: boolean }) =>
    request<JobItem>(`/notes/item/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteNote: (id: string) =>
    request<{ ok: boolean }>(`/notes/item/${id}`, { method: "DELETE" }),
};
