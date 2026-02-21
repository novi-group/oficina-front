import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'

function Home() {
  return (
    <div style={{ padding: '3rem', textAlign: 'center' }}>
      <h1>Bem-vindo à Oficina</h1>
      <p>Você fez login com sucesso. Aqui ficará o painel principal.</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}
