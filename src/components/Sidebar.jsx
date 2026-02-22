import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  MdDashboard, 
  MdBuild, 
  MdPeople, 
  MdInventory, 
  MdAttachMoney,
  MdSettings,
  MdLogout,
  MdClose,
  MdExpandMore,
  MdExpandLess,
  MdAdd,
  MdList
} from 'react-icons/md'
import { useSidebar } from '../context/SidebarContext'
import './Sidebar.css'

export default function Sidebar() {
  const location = useLocation()
  const { isOpen, isMobile, closeSidebar } = useSidebar()
  const [ordensExpanded, setOrdensExpanded] = useState(false)

  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar()
    }
  }

  const toggleOrdens = () => {
    setOrdensExpanded(!ordensExpanded)
  }

  const menuItems = [
    { path: '/home', icon: <MdDashboard />, label: 'Dashboard' },
    { path: '/clientes', icon: <MdPeople />, label: 'Clientes' },
    { path: '/estoque', icon: <MdInventory />, label: 'Estoque' },
    { path: '/financeiro', icon: <MdAttachMoney />, label: 'Financeiro' },
    { path: '/configuracoes', icon: <MdSettings />, label: 'Configurações' },
  ]

  const ordensSubItems = [
    { path: '/ordens', icon: <MdList />, label: 'Ver Todas' },
    { path: '/ordens/criar', icon: <MdAdd />, label: 'Criar Nova' },
  ]

  const isOrdensActive = location.pathname.startsWith('/ordens')

  return (
    <>
      {isMobile && isOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}
      <aside className={`sidebar ${isMobile && isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
            </svg>
            <span>Oficina</span>
          </div>
          {isMobile && (
            <button className="sidebar-close" onClick={closeSidebar}>
              <MdClose size={24} />
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          ))}

          {/* Dropdown Ordens de Serviço */}
          <div className="sidebar-dropdown">
            <button
              className={`sidebar-item sidebar-dropdown-trigger ${isOrdensActive ? 'active' : ''}`}
              onClick={toggleOrdens}
            >
              <span className="sidebar-icon"><MdBuild /></span>
              <span className="sidebar-label">Ordens de Serviço</span>
              <span className="sidebar-expand-icon">
                {ordensExpanded ? <MdExpandLess /> : <MdExpandMore />}
              </span>
            </button>

            {ordensExpanded && (
              <div className="sidebar-submenu">
                {ordensSubItems.map(item => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-subitem ${location.pathname === item.path ? 'active' : ''}`}
                    onClick={handleLinkClick}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    <span className="sidebar-label">{item.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-item" onClick={() => window.location.href = '/'}>
            <span className="sidebar-icon"><MdLogout /></span>
            <span className="sidebar-label">Sair</span>
          </button>
        </div>
      </aside>
    </>
  )
}
