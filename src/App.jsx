import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { supabase } from './supabase'
import Login from './Login'
import Profile from './Profile'
import Home from './Home'
import Chat from './Chat'

function AppRoutes() {
  const [user, setUser] = useState(null)
  const [profileSet, setProfileSet] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user?.user_metadata?.name) {
        setProfileSet(true)
      }
    })
  }, [])

  if (!user) return <Login onLogin={setUser} />
  if (!profileSet) return <Profile user={user} onSave={() => setProfileSet(true)} />

  return (
    <Routes>
      <Route path="/" element={<Home currentUserId={user.id} onSelectUser={() => {}} />} />
      <Route path="/chat/:userId" element={<Chat user={user} />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
