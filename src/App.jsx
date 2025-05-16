import React, { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Home from './Home'
import Chat from './Chat'
import Login from './Login'

export default function App() {
  const [user, setUser] = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    // Verifica se o usuário está logado
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoadingUser(false)
    })

    // Escuta mudanças de sessão (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  // Atualiza presença a cada 10s
  useEffect(() => {
    const interval = setInterval(async () => {
      if (!user) return
      await supabase.from('presence').upsert({
        user_id: user.id,
        email: user.email,
        avatar_url: user.user_metadata?.avatar_url,
        last_seen: new Date().toISOString()
      })
    }, 10000)
    return () => clearInterval(interval)
  }, [user])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSelectedUser(null)
  }

  if (loadingUser) return <p>Carregando usuário...</p>
  if (!user) return <Login onLogin={setUser} />

  return (
    <div style={{ padding: '1rem' }}>
      <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>
        Sair
      </button>

      {!selectedUser ? (
        <Home onSelectUser={setSelectedUser} currentUserId={user.id} />
      ) : (
        <Chat user={user} otherUser={selectedUser} goBack={() => setSelectedUser(null)} />
      )}
    </div>
  )
}
