import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { SidebarProvider } from './context/SidebarContext'
import './App.css'
import Login from './pages/Login'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import CriarOS from './pages/CriarOS'
import ListarOS from './pages/ListarOS'

function Clientes() {
  return <div style={{ padding: '2rem' }}><h1>Clientes</h1></div>
}

function Estoque() {
  return <div style={{ padding: '2rem' }}><h1>Estoque</h1></div>
}

function Financeiro() {
  return <div style={{ padding: '2rem' }}><h1>Financeiro</h1></div>
}

function Configuracoes() {
  return <div style={{ padding: '2rem' }}><h1>Configurações</h1></div>
}

export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/home" element={<Dashboard />} />
              <Route path="/ordens" element={<ListarOS />} />
              <Route path="/ordens/criar" element={<CriarOS />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/estoque" element={<Estoque />} />
              <Route path="/financeiro" element={<Financeiro />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </ThemeProvider>
  )
}
