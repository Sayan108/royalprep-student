import { useCallback, useEffect, useMemo, useState } from 'react'
import { ErrorMessage } from '../../shared/ui/error-message/index'
import {
  getStudentNotifications,
  markAllStudentNotificationsRead,
  notificationsChangedEvent,
  setStudentNotificationRead,
  type StudentNotification,
} from '../../shared/notifications/index'
import { ScreenLayout } from '../../widgets/screen-layout/index'

type NotificationFilter = 'all' | 'unread' | 'read'

export function Notifications() {
  const [notifications, setNotifications] = useState<StudentNotification[]>([])
  const [filter, setFilter] = useState<NotificationFilter>('all')
  const [error, setError] = useState('')

  const loadNotifications = useCallback(() => {
    try {
      setNotifications(getStudentNotifications())
      setError('')
    } catch (caught) {
      setError((caught as Error).message)
    }
  }, [])

  useEffect(() => {
    loadNotifications()
    window.addEventListener(notificationsChangedEvent, loadNotifications)
    window.addEventListener('storage', loadNotifications)
    return () => {
      window.removeEventListener(notificationsChangedEvent, loadNotifications)
      window.removeEventListener('storage', loadNotifications)
    }
  }, [loadNotifications])

  const unreadCount = notifications.filter(notification => !notification.read).length
  const visibleNotifications = useMemo(() => notifications.filter(notification =>
    filter === 'all' || (filter === 'unread' ? !notification.read : notification.read)
  ), [filter, notifications])

  const updateReadState = (notification: StudentNotification) => {
    try {
      setStudentNotificationRead(notification.id, !notification.read)
    } catch (caught) {
      setError((caught as Error).message)
    }
  }

  const markAllRead = () => {
    try {
      markAllStudentNotificationsRead()
    } catch (caught) {
      setError((caught as Error).message)
    }
  }

  return <ScreenLayout>
    <p className="screen-kicker">YOUR UPDATES</p>
    <div className="notification-heading">
      <div><h1>Notifications</h1><p>{unreadCount ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}` : 'You’re all caught up.'}</p></div>
      <button className="outline-button" type="button" onClick={markAllRead} disabled={!unreadCount}>Mark all as read</button>
    </div>
    <ErrorMessage text={error}/>
    <div className="notification-filters" aria-label="Filter notifications">
      {(['all', 'unread', 'read'] as const).map(value =>
        <button key={value} className={filter === value ? 'notification-filter active' : 'notification-filter'} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
          {value === 'all' ? 'All' : value === 'unread' ? `Unread${unreadCount ? ` (${unreadCount})` : ''}` : 'Read'}
        </button>
      )}
    </div>
    {visibleNotifications.length ? <ul className="notification-list">
      {visibleNotifications.map(item => <li className={'screen-card notification-item' + (item.read ? ' notification-read' : ' notification-unread')} key={item.id}>
        <div className="notification-copy">
          <div className="notification-title"><h2>{item.title}</h2><span className="notification-state">{item.read ? 'Read' : 'Unread'}</span></div>
          <p>{item.body}</p>
          <time dateTime={new Date(item.receivedAt).toISOString()}>{new Date(item.receivedAt).toLocaleString()}</time>
        </div>
        <button className="outline-button" type="button" onClick={() => updateReadState(item)}>{item.read ? 'Mark as unread' : 'Mark as read'}</button>
      </li>)}
    </ul> : <section className="screen-card notification-empty"><h2>{filter === 'unread' ? 'No unread notifications' : filter === 'read' ? 'No read notifications' : 'No notifications yet'}</h2><p>Updates sent to your student account will appear here.</p></section>}
  </ScreenLayout>
}
