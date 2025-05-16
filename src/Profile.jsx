import { useState } from 'react'
import { supabase } from './supabase'

export default function Profile({ user, onDone }) {
  const [name, setName] = useState(user.user_metadata?.name || '')
  const [avatar, setAvatar] = useState(user.user_metadata?.avatar_url || '')

  const save = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { name, avatar_url: avatar }
    })
    if (error) return alert(error.message)
    onDone()
  }

  return (
    <div className="profile">
      <h2>Configurar Perfil</h2>
      <input placeholder="Nome" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Avatar URL" value={avatar} onChange={e => setAvatar(e.target.value)} />
      <button onClick={save}>Salvar</button>
    </div>
  )
}
