import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Home from './Home'
import Chat from './Chat'

function App() {
  const [user, setUser] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
    // Recupera usuário logado
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  useEffect(() => {
    // Marca presença a cada 10s
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

  if (!user) return <p>Carregando usuário...</p>

  return (
    <div>
      {!selectedUser ? (
        <Home onSelectUser={setSelectedUser} currentUserId={user.id} />
      ) : (
        <Chat user={user} otherUser={selectedUser} goBack={() => setSelectedUser(null)} />
      )}
    </div>
  )
}

export default App
