import axios from 'axios'

export interface Cat {
  id: number
  name: string
  age: number | null
  details: string | null
  favorite_foods: string[]
  last_checkup: string | null
  photo_path: string | null
  next_checkup_due: string | null
  created_at: string
  updated_at: string
}

export interface Vaccination {
  id: number
  cat_id: number
  name: string
  date: string
  created_at: string
}

export interface MedicalEntry {
  id: number
  cat_id: number
  date: string
  notes: string
  created_at: string
}

export interface UploadResult {
  path: string
}

export interface ReminderBuckets {
  overdue: Cat[]
  due_soon: Cat[]
  upcoming: Cat[]
}

const client = axios.create({
  baseURL: '',
})

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message ?? err.response?.data?.error ?? 'Request failed';
    console.error('[api]', err);
    // dispatch a custom event so Toast can pick it up globally
    window.dispatchEvent(new CustomEvent('meowa:toast', { detail: { message: msg, type: 'error' } }));
    return Promise.reject(err);
  }
);

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}

export const catsApi = {
  list: () => client.get<PaginatedResponse<Cat> | Cat[]>('/api/cats').then((r) => r.data),
  get: (id: number) => client.get<Cat>(`/api/cats/${id}`).then((r) => r.data),
  create: (data: Partial<Cat>) => client.post<Cat>('/api/cats', data).then((r) => r.data),
  update: (id: number, data: Partial<Cat>) =>
    client.put<Cat>(`/api/cats/${id}`, data).then((r) => r.data),
  delete: (id: number) => client.delete(`/api/cats/${id}`),
}

export const vaccinationsApi = {
  list: (catId: number) =>
    client.get<Vaccination[]>(`/api/cats/${catId}/vaccinations`).then((r) => r.data),
  create: (catId: number, data: { name: string; date: string }) =>
    client.post<Vaccination>(`/api/cats/${catId}/vaccinations`, data).then((r) => r.data),
  update: (catId: number, vId: number, data: { name: string; date: string }) =>
    client.put<Vaccination>(`/api/cats/${catId}/vaccinations/${vId}`, data).then((r) => r.data),
  delete: (catId: number, vId: number) =>
    client.delete(`/api/cats/${catId}/vaccinations/${vId}`),
}

export const medicalApi = {
  list: (catId: number) =>
    client.get<MedicalEntry[]>(`/api/cats/${catId}/medical`).then((r) => r.data),
  create: (catId: number, data: { date: string; notes: string }) =>
    client.post<MedicalEntry>(`/api/cats/${catId}/medical`, data).then((r) => r.data),
  update: (catId: number, mId: number, data: { date: string; notes: string }) =>
    client.put<MedicalEntry>(`/api/cats/${catId}/medical/${mId}`, data).then((r) => r.data),
  delete: (catId: number, mId: number) =>
    client.delete(`/api/cats/${catId}/medical/${mId}`),
}

export const uploadsApi = {
  upload: (file: File) => {
    const form = new FormData()
    form.append('file', file)
    return client.post<UploadResult>('/api/uploads', form).then((r) => r.data)
  },
}

export const remindersApi = {
  list: () => client.get<ReminderBuckets>('/api/reminders').then((r) => r.data),
}
