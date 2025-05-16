import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Login from './Login'
import Profile from './Profile'
import Home from './Home'
import Chat from './Chat'

export default function App() {
  const [user, setUser] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [profileSet, setProfileSet] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: authData } = await supabase.auth.getUser()
      const currentUser = authData.user
      setUser(currentUser)

      if (!currentUser) {
        setLoading(false)
        return
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', currentUser.id)
        .single()

      if (profile?.username && !error) {
        setProfileSet(true)
      }

      setLoading(false)
    }

    fetchUserAndProfile()
  }, [])

  useEffect(() => {
    if (!user) return

    const interval = setInterval(async () => {
      await supabase.from('presence').upsert({
        user_id: user.id,
        email: user.email,
        avatar_url: user.user_metadata?.avatar_url,
        last_seen: new Date().toISOString()
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [user])

  if (loading) return <p>Carregando...</p>
  if (!user) return <Login onLogin={setUser} />
  if (!profileSet) return <Profile user={user} onDone={() => setProfileSet(true)} />

  return selectedUser ? (
    <Chat user={user} otherUser={selectedUser} goBack={() => setSelectedUser(null)} />
  ) : (
    <Home currentUserId={user.id} onSelectUser={setSelectedUser} />
  )
}
