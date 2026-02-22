import React from 'react'
import { MdNotifications, MdPerson, MdLightMode, MdDarkMode, MdMenu } from 'react-icons/md'
import { useTheme } from '../context/ThemeContext'
import { useSidebar } from '../context/SidebarContext'
import './Navbar.css'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { toggleSidebar, isMobile } = useSidebar()

  return (
    <header className="navbar">
      <div className="navbar-left">
        {isMobile && (
          <button className="navbar-menu-btn" onClick={toggleSidebar}>
            <MdMenu size={24} />
          </button>
        )}
        <h1 className="navbar-title">Dashboard</h1>
      </div>

      <div className="navbar-right">
        <button className="navbar-btn" onClick={toggleTheme} title="Alternar tema">
          {theme === 'light' ? <MdDarkMode size={20} /> : <MdLightMode size={20} />}
        </button>

        <button className="navbar-btn" title="Notificações">
          <MdNotifications size={20} />
          <span className="badge">3</span>
        </button>

        <div className="navbar-profile">
          <MdPerson size={24} />
          <div className="profile-info">
            <span className="profile-name">Admin</span>
            <span className="profile-role">Administrador</span>
          </div>
        </div>
      </div>
    </header>
  )
}
