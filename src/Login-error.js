import { useState } from 'react'
import { supabase } from '../supabase'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const signIn = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email, password
    })
    if (error) alert(error.message)
    else onLogin(data.user)
  }

  const signUp = async () => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) alert(error.message)
    else alert('Check your email to confirm!')
  }

  return (
    <div>
      <h2>Login or Register</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <button onClick={signIn}>Login</button>
      <button onClick={signUp}>Register</button>
    </div>
  )
}
