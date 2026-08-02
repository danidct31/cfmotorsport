const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export type JobItem = {
  id: string;
  kind?: string;
  text: string;
  checked: boolean;
};

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
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
  login: (password: string) =>
    request<{ ok: boolean; office: boolean }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
  logout: () => request<{ ok: boolean }>("/auth/logout", { method: "POST" }),
  listJobs: (kind: string) => request<JobItem[]>(`/jobs/${kind}`),
  createJob: (kind: string, text: string) =>
    request<JobItem>(`/jobs/${kind}`, {
      method: "POST",
      body: JSON.stringify({ text }),
    }),
  updateJob: (id: string, data: { text?: string; checked?: boolean }) =>
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
