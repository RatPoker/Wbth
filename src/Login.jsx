import { useState } from 'react'
import { supabase } from './supabase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isLoginMode, setIsLoginMode] = useState(true)

  const handleAuth = async () => {
    setLoading(true)
    try {
      if (isLoginMode) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) return alert(error.message)
        onLogin(data.user)
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) return alert(error.message)
        alert('Verifique seu email para confirmar o cadastro.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <h2>{isLoginMode ? 'Entrar' : 'Criar Conta'}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: '0.5rem', padding: '0.5rem' }}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: '1rem', padding: '0.5rem' }}
      />
      <button onClick={handleAuth} disabled={loading} style={{ width: '100%', padding: '0.5rem' }}>
        {loading ? 'Carregando...' : isLoginMode ? 'Entrar' : 'Cadastrar'}
      </button>
      <p style={{ marginTop: '1rem' }}>
        {isLoginMode ? 'Não tem conta?' : 'Já tem conta?'}{' '}
        <span
          onClick={() => setIsLoginMode(!isLoginMode)}
          style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
        >
          {isLoginMode ? 'Criar uma' : 'Entrar'}
        </span>
      </p>
    </div>
  )
}
