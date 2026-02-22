import React, { useState } from 'react'
import { MdSearch, MdDirectionsCar, MdPerson, MdPhone, MdHistory, MdClose } from 'react-icons/md'
import Breadcrumb from '../components/Breadcrumb'
import ModalHistorico from '../components/ModalHistorico'
import './CriarOS.css'

const veiculosCadastrados = [
  {
    placa: 'ABC1234',
    modelo: 'Honda Civic 2020',
    cliente: 'João Silva',
    telefone: '(11) 98765-4321',
    ordens: [
      { numero: '001', data: '15/01/2026', servico: 'Troca de óleo e filtros', valor: 350.00, status: 'Concluído' },
      { numero: '045', data: '10/12/2025', servico: 'Revisão completa de 10.000 km', valor: 850.00, status: 'Concluído' },
      { numero: '089', data: '05/11/2025', servico: 'Alinhamento e balanceamento', valor: 180.00, status: 'Concluído' },
    ]
  },
  {
    placa: 'XYZ5678',
    modelo: 'Toyota Corolla 2019',
    cliente: 'Maria Santos',
    telefone: '(11) 97654-3210',
    ordens: [
      { numero: '002', data: '18/01/2026', servico: 'Troca de pastilhas de freio', valor: 450.00, status: 'Concluído' },
      { numero: '078', data: '20/12/2025', servico: 'Troca de bateria', valor: 380.00, status: 'Concluído' },
    ]
  },
]

export default function CriarOS() {
  const [placa, setPlaca] = useState('')
  const [buscaRealizada, setBuscaRealizada] = useState(false)
  const [veiculoEncontrado, setVeiculoEncontrado] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    servico: '',
    descricao: '',
    valorEstimado: '',
    prazoEstimado: '',
  })

  const handleBuscarPlaca = () => {
    if (!placa.trim()) return

    const placaFormatada = placa.toUpperCase().replace(/[^A-Z0-9]/g, '')
    const veiculo = veiculosCadastrados.find(v => v.placa === placaFormatada)
    
    setVeiculoEncontrado(veiculo || null)
    setBuscaRealizada(true)
  }

  const handlePlacaChange = (e) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    setPlaca(value)
    if (buscaRealizada) setBuscaRealizada(false)
  }

  const handleLimparBusca = () => {
    setPlaca('')
    setBuscaRealizada(false)
    setVeiculoEncontrado(null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Criar OS:', { placa, ...formData })
    alert('OS criada com sucesso! (simulação)')
  }

  return (
    <div className="criar-os">
      <Breadcrumb items={[
        { label: 'Ordens de Serviço', link: '/ordens' },
        { label: 'Criar nova OS' }
      ]} />

      <div className="page-header">
        <div>
          <h1 className="page-title">Criar nova OS</h1>
          <p className="page-subtitle">Preencha os dados abaixo para registrar uma nova OS</p>
        </div>
      </div>

      <div className="os-form-container">
        <div className="form-section">
          <div className="section-header">
            <MdDirectionsCar className="section-icon" />
            <div>
              <h2 className="section-title">Identificação do Veículo</h2>
              <p className="section-subtitle">Busque pela placa para verificar o histórico</p>
            </div>
          </div>

          <div className="busca-placa">
            <div className="input-group-busca">
              <input
                type="text"
                placeholder="Digite a placa (ex: ABC1234)"
                value={placa}
                onChange={handlePlacaChange}
                maxLength={7}
                className="input-placa"
              />
              {placa && (
                <button 
                  type="button" 
                  className="btn-limpar-busca"
                  onClick={handleLimparBusca}
                >
                  <MdClose size={20} />
                </button>
              )}
            </div>
            <button 
              type="button"
              onClick={handleBuscarPlaca}
              className="btn-buscar"
              disabled={!placa}
            >
              <MdSearch size={20} />
              Buscar
            </button>
          </div>

          {buscaRealizada && (
            <div className="resultado-busca">
              {veiculoEncontrado ? (
                <div className="veiculo-card encontrado">
                  <div className="veiculo-header">
                    <MdDirectionsCar className="veiculo-icon" />
                    <div className="veiculo-info">
                      <h3 className="veiculo-placa">{veiculoEncontrado.placa}</h3>
                      <p className="veiculo-modelo">{veiculoEncontrado.modelo}</p>
                    </div>
                  </div>

                  <div className="veiculo-cliente">
                    <div className="cliente-info">
                      <MdPerson size={18} />
                      <span>{veiculoEncontrado.cliente}</span>
                    </div>
                    <div className="cliente-info">
                      <MdPhone size={18} />
                      <span>{veiculoEncontrado.telefone}</span>
                    </div>
                  </div>

                  <div className="veiculo-historico-preview">
                    <div className="preview-header">
                      <MdHistory size={18} />
                      <span>Histórico de Serviços</span>
                      <span className="preview-count">{veiculoEncontrado.ordens.length} OS anteriores</span>
                    </div>
                    <div className="preview-list">
                      {veiculoEncontrado.ordens.slice(0, 2).map((os, idx) => (
                        <div key={idx} className="preview-item">
                          <span className="preview-os">OS #{os.numero}</span>
                          <span className="preview-servico">{os.servico}</span>
                          <span className="preview-valor">R$ {os.valor.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <button 
                      type="button"
                      className="btn-ver-historico"
                      onClick={() => setModalOpen(true)}
                    >
                      Ver histórico completo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="veiculo-card nao-encontrado">
                  <div className="nao-encontrado-content">
                    <MdDirectionsCar className="nao-encontrado-icon" />
                    <h3>Veículo não cadastrado</h3>
                    <p>Este veículo não possui histórico. Preencha os dados do cliente abaixo.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {buscaRealizada && (
          <form onSubmit={handleSubmit} className="os-form">
            {!veiculoEncontrado && (
              <div className="form-section">
                <div className="section-header">
                  <MdPerson className="section-icon" />
                  <h2 className="section-title">Dados do Cliente</h2>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Nome Completo *</label>
                    <input type="text" required placeholder="Digite o nome" />
                  </div>
                  <div className="form-group">
                    <label>Telefone *</label>
                    <input type="tel" required placeholder="(00) 00000-0000" />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" placeholder="email@exemplo.com" />
                  </div>
                  <div className="form-group">
                    <label>Modelo do Veículo *</label>
                    <input type="text" required placeholder="Ex: Honda Civic 2020" />
                  </div>
                </div>
              </div>
            )}

            <div className="form-section">
              <div className="section-header">
                <MdDirectionsCar className="section-icon" />
                <h2 className="section-title">Informações do Serviço</h2>
              </div>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Tipo de Serviço *</label>
                  <select 
                    required
                    value={formData.servico}
                    onChange={(e) => setFormData({...formData, servico: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    <option value="manutencao">Manutenção Preventiva</option>
                    <option value="revisao">Revisão</option>
                    <option value="reparo">Reparo</option>
                    <option value="funilaria">Funilaria e Pintura</option>
                    <option value="eletrica">Elétrica</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Descrição do Serviço *</label>
                  <textarea 
                    required
                    rows="4"
                    placeholder="Descreva detalhadamente o serviço a ser realizado..."
                    value={formData.descricao}
                    onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Valor Estimado</label>
                  <input 
                    type="number" 
                    step="0.01"
                    placeholder="R$ 0,00"
                    value={formData.valorEstimado}
                    onChange={(e) => setFormData({...formData, valorEstimado: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Prazo Estimado</label>
                  <input 
                    type="date"
                    value={formData.prazoEstimado}
                    onChange={(e) => setFormData({...formData, prazoEstimado: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="btn-secondary">
                Cancelar
              </button>
              <button type="submit" className="btn-primary-os">
                Criar Ordem de Serviço
              </button>
            </div>
          </form>
        )}
      </div>

      {veiculoEncontrado && (
        <ModalHistorico
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          historico={veiculoEncontrado}
        />
      )}
    </div>
  )
}
