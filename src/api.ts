export type Task = {
    id: number;
    title: string;
    description?: string;
    status: 'pending' | 'in_progress' | 'done';
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
    if (!r.ok) throw new Error(await r.text());
    return r.json() as Promise<T>
}

export function nextStatus(status: Task['status']): Task['status'] {
    if (status === 'pending') return 'in_progress';
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