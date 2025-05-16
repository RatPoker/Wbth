import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Home({ currentUserId, onSelectUser }) {
  const [users, setUsers] = useState([])
  const [onlineUserIds, setOnlineUserIds] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      // Busca todos os perfis, exceto o atual
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('id, email, avatar_url')
        .neq('id', currentUserId)

      // Busca todos da tabela `presence`
      const { data: presence } = await supabase
        .from('presence')
        .select('user_id')

      const onlineIds = presence.map(p => p.user_id)

      setOnlineUserIds(onlineIds)
      setUsers(profiles || [])
    }

    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [currentUserId])

  return (
    <div className="user-list">
      <h2>Usuários</h2>
      {users.map(user => (
        <div key={user.id} onClick={() => onSelectUser(user)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: '5px 0' }}>
          <img src={user.avatar_url} alt="" width={30} height={30} style={{ borderRadius: '50%' }} />
          <span>{user.email}</span>
          {onlineUserIds.includes(user.id) && <span style={{ color: 'green' }}>●</span>}
        </div>
      ))}
    </div>
  )
}
