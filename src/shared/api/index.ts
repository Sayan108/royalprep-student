import axios from 'axios'
import { apiOrigin } from '../config'

export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message)
  }
}

export async function api<T>(path: string, init: RequestInit = {}, admin = false, student = false): Promise<T> {
  const headers = new Headers(init.headers)
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
  if (!headers.has('Authorization') && (admin || student)) {
    headers.set('Authorization', 'Bearer ' + sessionStorage.getItem(admin ? 'rp-admin' : 'rp-student'))
  }

  try {
    const response = await axios.request<T>({
      url: apiOrigin + '/api' + path,
      method: init.method,
      data: init.body,
      headers: Object.fromEntries(headers.entries()),
      signal: init.signal ?? undefined,
    })
    return response.data
  } catch (error) {
    if (!axios.isAxiosError(error) || axios.isCancel(error)) throw error
    const status = error.response?.status
    if (status === 401 && (admin || student)) {
      sessionStorage.removeItem(admin ? 'rp-admin' : 'rp-student')
      if (student) sessionStorage.removeItem('rp-student-email')
      window.dispatchEvent(new CustomEvent('royalprep-session-expired', { detail: admin ? 'admin' : 'student' }))
    }
    const body: unknown = error.response?.data
    const message = typeof body === 'object' && body !== null && 'error' in body && typeof body.error === 'string'
      ? body.error
      : status ? 'Request failed.' : 'Unable to reach the server. Please check your connection and try again.'
    throw new ApiError(message, status ?? 0)
  }
}
