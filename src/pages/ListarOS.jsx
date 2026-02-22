import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { MdAdd, MdSearch, MdFilterList, MdVisibility, MdEdit, MdDelete, MdMoreVert } from 'react-icons/md'
import Breadcrumb from '../components/Breadcrumb'
import './ListarOS.css'

// Mock de dados
const ordemServico = [
  { 
    id: 1, 
    numero: 'OS-001', 
    placa: 'ABC1234', 
    cliente: 'João Silva', 
    veiculo: 'Honda Civic 2020',
    servico: 'Troca de óleo e filtros', 
    status: 'Em andamento', 
    valor: 350.00, 
    data: '20/02/2026',
    prazo: '22/02/2026'
  },
  { 
    id: 2, 
    numero: 'OS-002', 
    placa: 'XYZ5678', 
    cliente: 'Maria Santos', 
    veiculo: 'Toyota Corolla 2019',
    servico: 'Revisão completa de 20.000 km', 
    status: 'Aguardando peças', 
    valor: 1200.00, 
    data: '19/02/2026',
    prazo: '25/02/2026'
  },
  { 
    id: 3, 
    numero: 'OS-003', 
    placa: 'DEF9012', 
    cliente: 'Pedro Oliveira', 
    veiculo: 'Fiat Uno 2018',
    servico: 'Troca de pastilhas de freio', 
    status: 'Concluído', 
    valor: 450.00, 
    data: '18/02/2026',
    prazo: '20/02/2026'
  },
  { 
    id: 4, 
    numero: 'OS-004', 
    placa: 'GHI3456', 
    cliente: 'Ana Costa', 
    veiculo: 'VW Golf 2021',
    servico: 'Alinhamento e balanceamento', 
    status: 'Em andamento', 
    valor: 180.00, 
    data: '21/02/2026',
    prazo: '22/02/2026'
  },
  { 
    id: 5, 
    numero: 'OS-005', 
    placa: 'JKL7890', 
    cliente: 'Carlos Mendes', 
    veiculo: 'Chevrolet Onix 2020',
    servico: 'Troca de bateria', 
    status: 'Cancelado', 
    valor: 380.00, 
    data: '17/02/2026',
    prazo: '19/02/2026'
  },
]

export default function ListarOS() {
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [ordensVisiveis, setOrdensVisiveis] = useState(ordemServico)

  const handleBuscar = () => {
    let resultado = ordemServico

    if (busca) {
      resultado = resultado.filter(os => 
        os.numero.toLowerCase().includes(busca.toLowerCase()) ||
        os.placa.toLowerCase().includes(busca.toLowerCase()) ||
        os.cliente.toLowerCase().includes(busca.toLowerCase())
      )
    }

    if (filtroStatus !== 'todos') {
      resultado = resultado.filter(os => 
        os.status.toLowerCase().replace(' ', '-') === filtroStatus
      )
    }

    setOrdensVisiveis(resultado)
  }

  React.useEffect(() => {
    handleBuscar()
  }, [busca, filtroStatus])

  const getStatusClass = (status) => {
    return `status-badge status-${status.toLowerCase().replace(' ', '-')}`
  }

  return (
    <div className="listar-os">
      <Breadcrumb items={[
        { label: 'Ordens de Serviço' }
      ]} />

      <div className="page-header-os">
        <div>
          <h1 className="page-title">Ordens de Serviço</h1>
          <p className="page-subtitle">Gerencie todas as ordens de serviço da oficina</p>
        </div>
        <Link to="/ordens/criar" className="btn-criar-os">
          <MdAdd size={20} />
          Nova OS
        </Link>
      </div>

      <div className="filtros-container">
        <div className="busca-container">
          <MdSearch className="busca-icon" />
          <input
            type="text"
            placeholder="Buscar por OS, placa ou cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="input-busca-os"
          />
        </div>

        <div className="filtro-status">
          <MdFilterList size={20} />
          <select 
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            className="select-filtro"
          >
            <option value="todos">Todos os Status</option>
            <option value="em-andamento">Em Andamento</option>
            <option value="aguardando-peças">Aguardando Peças</option>
            <option value="concluído">Concluído</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>

      <div className="stats-os-grid">
        <div className="stat-os-card">
          <div className="stat-os-info">
            <span className="stat-os-label">Total de OS</span>
            <span className="stat-os-value">{ordemServico.length}</span>
          </div>
          <div className="stat-os-icon stat-total">
            <MdFilterList size={24} />
          </div>
        </div>
        <div className="stat-os-card">
          <div className="stat-os-info">
            <span className="stat-os-label">Em Andamento</span>
            <span className="stat-os-value">
              {ordemServico.filter(os => os.status === 'Em andamento').length}
            </span>
          </div>
          <div className="stat-os-icon stat-andamento">
            <MdEdit size={24} />
          </div>
        </div>
        <div className="stat-os-card">
          <div className="stat-os-info">
            <span className="stat-os-label">Concluídas</span>
            <span className="stat-os-value">
              {ordemServico.filter(os => os.status === 'Concluído').length}
            </span>
          </div>
          <div className="stat-os-icon stat-concluido">
            <MdVisibility size={24} />
          </div>
        </div>
        <div className="stat-os-card">
          <div className="stat-os-info">
            <span className="stat-os-label">Aguardando</span>
            <span className="stat-os-value">
              {ordemServico.filter(os => os.status === 'Aguardando peças').length}
            </span>
          </div>
          <div className="stat-os-icon stat-aguardando">
            <MdFilterList size={24} />
          </div>
        </div>
      </div>

      <div className="table-os-card">
        <div className="table-os-wrapper">
          <table className="table-os">
            <thead>
              <tr>
                <th>OS</th>
                <th>Cliente</th>
                <th>Placa</th>
                <th className="hide-mobile">Veículo</th>
                <th className="hide-mobile">Serviço</th>
                <th>Status</th>
                <th className="hide-mobile">Prazo</th>
                <th>Valor</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {ordensVisiveis.length > 0 ? (
                ordensVisiveis.map(os => (
                  <tr key={os.id}>
                    <td className="os-numero">{os.numero}</td>
                    <td>{os.cliente}</td>
                    <td className="os-placa">{os.placa}</td>
                    <td className="hide-mobile text-secondary">{os.veiculo}</td>
                    <td className="hide-mobile">{os.servico}</td>
                    <td>
                      <span className={getStatusClass(os.status)}>
                        {os.status}
                      </span>
                    </td>
                    <td className="hide-mobile text-secondary">{os.prazo}</td>
                    <td className="os-valor">R$ {os.valor.toFixed(2)}</td>
                    <td>
                      <div className="acoes-os">
                        <button className="btn-acao" title="Visualizar">
                          <MdVisibility size={18} />
                        </button>
                        <button className="btn-acao" title="Editar">
                          <MdEdit size={18} />
                        </button>
                        <button className="btn-acao btn-delete" title="Excluir">
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-secondary">
                    Nenhuma ordem de serviço encontrada
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
