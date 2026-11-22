import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import brandMark from '../../shared/assets/royalprep-logo-256.png'
import { chapterNotesEnabled } from '../../shared/config/index'
import { apiOrigin } from '../../shared/config/index'

export function ScreenLayout({ children, admin = false, navigation = true }: { children: ReactNode; admin?: boolean; navigation?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [notification, setNotification] = useState('')
  useEffect(() => {
    if (admin) return
    const token = sessionStorage.getItem('rp-student')
    if (!token || typeof WebSocket === 'undefined') return
    const origin = (apiOrigin || window.location.origin).replace(/^http/, 'ws')
    const socket = new WebSocket(origin + '/ws?token=' + encodeURIComponent(token))
    socket.onmessage = event => {
      try { const message = JSON.parse(event.data) as { type?: string; notification?: { title: string; body: string } }; if (message.type === 'notification' && message.notification) setNotification(message.notification.title + ': ' + message.notification.body) } catch { /* malformed server messages are ignored */ }
    }
    return () => socket.close()
  }, [admin])
  return <div className={'screen-layout' + (admin ? ' screen-admin' : '')}>
    <header className="screen-header">
      <Link to=      {admin ?  '/admin' : '/'} className="screen-brand"><img className="brand-mark" src={brandMark} alt=""/><span>Royal<span>Prep</span></span></Link>
      <div className="screen-header-actions"><span className="header-badge">{admin ? 'ADMIN' : 'MRCS PART A'}</span>
        {navigation && <button className="screen-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="screen-navigation" onClick={() => setMenuOpen(value => !value)}>{menuOpen ? 'Close menu' : 'Menu'}</button>}
      </div>
    </header>
    <div className={'screen-body' + (navigation ? '' : ' screen-body-no-sidebar')}>
      {navigation && <nav id="screen-navigation" aria-label={admin ? 'Admin navigation' : 'Student navigation'} className={'screen-sidebar' + (menuOpen ? ' screen-sidebar-open' : '')} onClick={() => setMenuOpen(false)}>
        <p className="sidebar-label">{admin ? 'ADMIN' : 'PRACTICE'}</p>
        {admin ? <><NavLink to="/admin/dashboard">Dashboard</NavLink><NavLink to="/admin/questions">Question bank</NavLink><NavLink to="/admin/content/hero">Homepage hero</NavLink>{chapterNotesEnabled && <NavLink to="/admin/content/chapters">Chapter notes</NavLink>}<NavLink to="/admin/communications">Reports</NavLink></> : <><NavLink to="/app" end>Dashboard</NavLink><NavLink to="/course">Course chapters</NavLink><NavLink to="/study/library">Chapter library</NavLink><NavLink to="/practice">Practice</NavLink><NavLink to="/app/mocks">Mocks</NavLink><NavLink to="/app/results">Results</NavLink><NavLink to="/app/mistakes">My mistakes</NavLink><NavLink to="/app/flashcards">Flashcards</NavLink><NavLink to="/tools">Study tools</NavLink><NavLink to="/pricing">Plans and pricing</NavLink><NavLink to="/app/profile">Profile and privacy</NavLink><NavLink to="/sign-in">Student account</NavLink></>}
      </nav>}
      <main className="screen-content">{notification && <div role="status" className="screen-card"><strong>New notification</strong><p>{notification}</p><button className="outline-button" type="button" onClick={() => setNotification('')}>Dismiss</button></div>}{children}</main>
    </div>
  </div>
}
