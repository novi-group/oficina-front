import React from 'react'
import { Link } from 'react-router-dom'
import { MdHome, MdChevronRight } from 'react-icons/md'
import './Breadcrumb.css'

export default function Breadcrumb({ items }) {
  return (
    <nav className="breadcrumb">
      <Link to="/home" className="breadcrumb-item">
        <MdHome size={18} />
        <span>Home</span>
      </Link>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <MdChevronRight className="breadcrumb-separator" size={18} />
          {item.link ? (
            <Link to={item.link} className="breadcrumb-item">
              <span>{item.label}</span>
            </Link>
          ) : (
            <span className="breadcrumb-item breadcrumb-current">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
