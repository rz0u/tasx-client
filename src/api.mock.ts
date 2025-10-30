// src/api.mock.ts
export type Task = {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'done';
  created_at: string;
  completed_at?: string | null;
};

type NewTask = { title: string; description?: string };

const STORAGE_KEY = 'tasx_tasks';
const ID_KEY = 'tasx_id_counter';

const sleep = (ms = 300) => new Promise(r => setTimeout(r, ms));

function load(): Task[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Task[]) : [];
}
function save(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}
function nextId(): number {
  const cur = Number(localStorage.getItem(ID_KEY) || '1');
  localStorage.setItem(ID_KEY, String(cur + 1));
  return cur;
}

function seedIfEmpty() {
  const has = load();
  if (has.length) return;
  const now = new Date().toISOString();
  const seeded: Task[] = [
    { id: nextId(), title: 'Buy coffee beans', description: 'Arabica 250g', status: 'pending', created_at: now, completed_at: null },
    { id: nextId(), title: 'Wireframe home page', description: 'Figma draft v2', status: 'in_progress', created_at: now, completed_at: null },
    { id: nextId(), title: 'Submit expense report', status: 'done', created_at: now, completed_at: now },
    { id: nextId(), title: 'Buy  beans', description: 'Arabica 250g', status: 'pending', created_at: now, completed_at: null },
    { id: nextId(), title: 'Wireframe  page', description: 'Figma draft v2', status: 'in_progress', created_at: now, completed_at: null },
    { id: nextId(), title: ' expense report', status: 'done', created_at: now, completed_at: now },
  ];
  save(seeded);
}
seedIfEmpty();

export const api = {
  async list(): Promise<Task[]> {
    await sleep();
    return load();
  },

  async create(body: NewTask): Promise<Task> {
    await sleep();
    const tasks = load();
    const now = new Date().toISOString();
    const t: Task = {
      id: nextId(),
      title: body.title.trim(),
      description: body.description?.trim() || undefined,
      status: 'pending',
      created_at: now,
      completed_at: null,
    };
    tasks.unshift(t);
    save(tasks);
    return t;
  },

  // Keep the same signature you're calling in your component
  async updateStatus({ id, status }: { id: number; status: Task['status'] }): Promise<Task> {
    await sleep();
    const tasks = load();
    const i = tasks.findIndex(t => t.id === id);
    if (i === -1) throw new Error('Not found');
    tasks[i].status = status;
    tasks[i].completed_at = status === 'done' ? new Date().toISOString() : null;
    save(tasks);
    return tasks[i];
  },

  async delete(id: number): Promise<void> {
    await sleep();
    const tasks = load().filter(t => t.id !== id);
    save(tasks);
  },
};
