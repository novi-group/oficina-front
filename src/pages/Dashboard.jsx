import React from 'react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MdTrendingUp, MdAttachMoney, MdBuild, MdPeople } from 'react-icons/md'
import './Dashboard.css'

const revenueData = [
  { month: 'Jan', value: 12000 },
  { month: 'Fev', value: 19000 },
  { month: 'Mar', value: 15000 },
  { month: 'Abr', value: 25000 },
  { month: 'Mai', value: 22000 },
  { month: 'Jun', value: 30000 },
]

const servicesData = [
  { name: 'Manutenção', value: 400 },
  { name: 'Revisão', value: 300 },
  { name: 'Funilaria', value: 200 },
  { name: 'Elétrica', value: 150 },
]

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#f59e0b']

const recentOrders = [
  { id: '#OS-001', client: 'João Silva', vehicle: 'Honda Civic', status: 'Em andamento', value: 'R$ 850,00' },
  { id: '#OS-002', client: 'Maria Santos', vehicle: 'Toyota Corolla', status: 'Concluído', value: 'R$ 1.200,00' },
  { id: '#OS-003', client: 'Pedro Oliveira', vehicle: 'Fiat Uno', status: 'Aguardando peças', value: 'R$ 450,00' },
  { id: '#OS-004', client: 'Ana Costa', vehicle: 'VW Golf', status: 'Em andamento', value: 'R$ 980,00' },
]

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' }}>
            <MdAttachMoney size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Receita Mensal</span>
            <span className="stat-value">R$ 30.000</span>
            <span className="stat-change positive">+12.5% vs mês anterior</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>
            <MdBuild size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Ordens de Serviço</span>
            <span className="stat-value">48</span>
            <span className="stat-change positive">+8 esta semana</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
            <MdPeople size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Clientes Ativos</span>
            <span className="stat-value">156</span>
            <span className="stat-change positive">+23 este mês</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
            <MdTrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Taxa de Conclusão</span>
            <span className="stat-value">94%</span>
            <span className="stat-change positive">+2% vs média</span>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3 className="chart-title">Receita Mensal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="month" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--card-bg)', 
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} name="Receita (R$)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3 className="chart-title">Serviços por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={servicesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {servicesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-card">
        <h3 className="table-title">Ordens de Serviço Recentes</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>OS</th>
                <th>Cliente</th>
                <th>Veículo</th>
                <th>Status</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr key={order.id}>
                  <td className="font-mono">{order.id}</td>
                  <td>{order.client}</td>
                  <td>{order.vehicle}</td>
                  <td>
                    <span className={`status-badge status-${order.status.toLowerCase().replace(' ', '-')}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="font-semibold">{order.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
