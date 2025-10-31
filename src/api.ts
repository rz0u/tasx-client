export type Task = {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'done';
    created_at: string;
    completed_at?: string | null;
}

export type NewTask = {
    title: string;
    description?: string;
}

export type UpdateTask = {
    id: number;
    status: Task['status'];
}

const SERVER = import.meta.env.VITE_API_URL as string;

async function http<T>(path: string, init?: RequestInit): Promise<T> {
    const r = await fetch(`${SERVER}${path}`, {
        ...init,
        headers: { 
            'Content-Type': 'application/json',
            ...(init?.headers || {})
        },
    });
    if (!r.ok) {
    // Try to surface a meaningful error
    const text = await r.text().catch(() => '');
    throw new Error(text || r.statusText);
  }

  // Handle empty reponses (204, 205, or no content-length)
  if (r.status === 204 || r.status === 205) {
    return undefined as T;
  }

  const text = await r.text();   // safer than res.json()
  if (!text) return undefined as T;

  // If the server didn’t send JSON, avoid another crash
  try {
    return JSON.parse(text) as T;
  } catch {
    return undefined as T;
  }
}

export function nextStatus(status: Task['status']): Task['status'] {
    if (status === 'pending') return 'done';
    if (status === 'in_progress') return 'done';
    return 'done'
}

export const api = {
    // GET /api/v1/tasx
    list: () => http<Task[]>('/tasx'),

    // POST /api/v1/tasx
    create: (payload: NewTask) =>
        http<Task>('/tasx', {
            method: 'POST',
            body: JSON.stringify(payload)
        }),

    // PATCH /api/v1/tasx/update/:id    body: { status }
    updateStatus: ({id, status}: UpdateTask) =>
        http<Task>(`/tasx/update/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({status: nextStatus(status)})
        }),

    // DELETE /api/v1/tasx/delete/:id
    delete: (id: number) => http<void>(`/tasx/delete/${id}`, {method: 'DELETE'})
}
