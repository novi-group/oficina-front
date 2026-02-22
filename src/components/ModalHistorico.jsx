import React from 'react'
import { MdClose, MdCalendarToday, MdAttachMoney, MdBuild } from 'react-icons/md'
import './ModalHistorico.css'

export default function ModalHistorico({ isOpen, onClose, historico }) {
  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Histórico do Veículo</h2>
            <p className="modal-subtitle">
              {historico.placa} • {historico.modelo}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>
            <MdClose size={24} />
          </button>
        </div>

        <div className="modal-body">
          <div className="historico-info">
            <div className="info-card">
              <MdBuild className="info-icon" />
              <div>
                <span className="info-label">Total de Serviços</span>
                <span className="info-value">{historico.ordens.length}</span>
              </div>
            </div>
            <div className="info-card">
              <MdAttachMoney className="info-icon" />
              <div>
                <span className="info-label">Gasto Total</span>
                <span className="info-value">
                  R$ {historico.ordens.reduce((sum, os) => sum + os.valor, 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="historico-timeline">
            <h3 className="timeline-title">Ordens de Serviço</h3>
            {historico.ordens.map((os, index) => (
              <div key={index} className="timeline-item">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <div className="timeline-header">
                    <span className="timeline-os">OS #{os.numero}</span>
                    <span className={`timeline-status status-${os.status.toLowerCase()}`}>
                      {os.status}
                    </span>
                  </div>
                  <div className="timeline-date">
                    <MdCalendarToday size={14} />
                    {os.data}
                  </div>
                  <p className="timeline-description">{os.servico}</p>
                  <div className="timeline-footer">
                    <span className="timeline-value">R$ {os.valor.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
