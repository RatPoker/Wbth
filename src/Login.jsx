import { useState } from 'react'
import { supabase } from './supabase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return alert(error.message)
    onLogin(data.user)
  }

  const signUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return alert(error.message)
    alert('Conta criada! Faça login.')
  }

  return (
    <div className="login">
      <h2>Login ou Registro</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Senha" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={signIn}>Entrar</button>
      <button onClick={signUp}>Registrar</button>
    </div>
  )
}
