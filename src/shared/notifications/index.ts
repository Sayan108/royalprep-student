export type StudentNotification = {
  id: string
  title: string
  body: string
  receivedAt: number
  read: boolean
}

export const notificationsChangedEvent = 'royalprep-notifications-changed'

function getNotificationsStorageKey() {
  const studentEmail = sessionStorage.getItem('rp-student-email')?.trim().toLowerCase() || 'anonymous'
  return 'rp-student-notifications:' + encodeURIComponent(studentEmail)
}

export function getStudentNotifications(): StudentNotification[] {
  const stored = localStorage.getItem(getNotificationsStorageKey())
  if (!stored) return []

  const parsed: unknown = JSON.parse(stored)
  if (!Array.isArray(parsed) || parsed.some(item =>
    typeof item !== 'object' || item === null ||
    typeof item.id !== 'string' || typeof item.title !== 'string' ||
    typeof item.body !== 'string' || typeof item.receivedAt !== 'number' ||
    typeof item.read !== 'boolean'
  )) {
    throw new Error('Saved notifications could not be read. Clear your browser storage and try again.')
  }
  return parsed as StudentNotification[]
}

function saveStudentNotifications(notifications: StudentNotification[]) {
  localStorage.setItem(getNotificationsStorageKey(), JSON.stringify(notifications))
  window.dispatchEvent(new Event(notificationsChangedEvent))
}

export function addStudentNotification(title: string, body: string) {
  const notifications = getStudentNotifications()
  notifications.unshift({
    id: crypto.randomUUID(),
    title,
    body,
    receivedAt: Date.now(),
    read: false,
  })
  saveStudentNotifications(notifications)
}

export function setStudentNotificationRead(id: string, read: boolean) {
  const notifications = getStudentNotifications()
  saveStudentNotifications(notifications.map(notification =>
    notification.id === id ? { ...notification, read } : notification
  ))
}

export function markAllStudentNotificationsRead() {
  const notifications = getStudentNotifications()
  saveStudentNotifications(notifications.map(notification => ({ ...notification, read: true })))
}
