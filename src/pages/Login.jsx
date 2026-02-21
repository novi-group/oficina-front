import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../App.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    // Aqui você integrará com a API de autenticação
    alert(`Tentativa de login: ${email}`)
    navigate('/')
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Entrar</h2>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@exemplo.com"
            required
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <button type="submit">Entrar</button>
        <p style={{ marginTop: '0.75rem' }}>
          Ou volte para <Link to="/">Home</Link>
        </p>
      </form>
    </div>
  )
}
