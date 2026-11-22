import assert from 'node:assert/strict'
import { test } from 'node:test'
import axios from 'axios'
import { createServer } from 'vite'

test('API client preserves request, error and session behavior', async t => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, appType: 'custom' })
  const originalAdapter = axios.defaults.adapter
  const originalWindow = globalThis.window
  const originalStorage = globalThis.sessionStorage
  const originalLocalStorage = globalThis.localStorage
  const values = new Map()
  const notificationValues = new Map()
  globalThis.sessionStorage = {
    getItem: key => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  }
  globalThis.localStorage = {
    getItem: key => notificationValues.get(key) ?? null,
    setItem: (key, value) => notificationValues.set(key, value),
  }
  globalThis.window = new EventTarget()
  t.after(async () => {
    axios.defaults.adapter = originalAdapter
    globalThis.window = originalWindow
    globalThis.sessionStorage = originalStorage
    globalThis.localStorage = originalLocalStorage
    await server.close()
  })

  const { api, ApiError } = await server.ssrLoadModule('/src/shared/api/index.ts')
  const notifications = await server.ssrLoadModule('/src/shared/notifications/index.ts')
  await t.test('stores notifications and updates read and unread state', () => {
    values.set('rp-student-email', 'student@example.test')
    notifications.addStudentNotification('Mock results', 'Your mock has been marked.')
    let items = notifications.getStudentNotifications()
    assert.equal(items.length, 1)
    assert.equal(items[0].title, 'Mock results')
    assert.equal(items[0].read, false)

    notifications.setStudentNotificationRead(items[0].id, true)
    items = notifications.getStudentNotifications()
    assert.equal(items[0].read, true)

    notifications.setStudentNotificationRead(items[0].id, false)
    notifications.markAllStudentNotificationsRead()
    assert.equal(notifications.getStudentNotifications()[0].read, true)

    values.set('rp-student-email', 'another-student@example.test')
    assert.deepEqual(notifications.getStudentNotifications(), [])
    values.set('rp-student-email', 'student@example.test')
    assert.equal(notifications.getStudentNotifications()[0].title, 'Mock results')
  })
  await t.test('sends JSON and the appropriate bearer token', async () => {
    values.set('rp-student', 'student-token')
    axios.defaults.adapter = async config => {
      assert.equal(config.url, '/api/practice/questions')
      assert.equal(config.method, 'post')
      assert.equal(config.headers.get('Authorization'), 'Bearer student-token')
      assert.deepEqual(JSON.parse(config.data), { answer: 1 })
      return { data: { ok: true }, status: 200, statusText: 'OK', headers: {}, config }
    }
    assert.deepEqual(await api('/practice/questions', { method: 'POST', body: JSON.stringify({ answer: 1 }) }, false, true), { ok: true })
  })
  await t.test('clears expired sessions and reports the server error', async () => {
    values.set('rp-student-email', 'student@example.test')
    let expired
    window.addEventListener('royalprep-session-expired', event => { expired = event.detail }, { once: true })
    axios.defaults.adapter = async config => {
      throw new axios.AxiosError('Unauthorized', 'ERR_BAD_REQUEST', config, undefined, { data: { error: 'Session expired.' }, status: 401, statusText: 'Unauthorized', headers: {}, config })
    }
    await assert.rejects(api('/auth/session', {}, false, true), error => error instanceof ApiError && error.status === 401 && error.message === 'Session expired.')
    assert.equal(values.has('rp-student'), false)
    assert.equal(values.has('rp-student-email'), false)
    assert.equal(expired, 'student')
  })
  await t.test('surfaces network failures and preserves cancellation', async () => {
    axios.defaults.adapter = async config => { throw new axios.AxiosError('Network Error', 'ERR_NETWORK', config) }
    await assert.rejects(api('/public/chapters'), error => error instanceof ApiError && error.status === 0 && /Unable to reach the server/.test(error.message))
    const controller = new AbortController()
    controller.abort()
    await assert.rejects(api('/public/chapters', { signal: controller.signal }), axios.isCancel)
  })
})
