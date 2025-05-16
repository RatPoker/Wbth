import React from 'react'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Home({ onSelectUser, currentUserId }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetchOnlineUsers()
  }, [])

  const fetchOnlineUsers = async () => {
    const { data, error } = await supabase
      .from('presence')
      .select('*')
      .neq('user_id', currentUserId)
      .gte('last_seen', new Date(Date.now() - 60000).toISOString()) // online há 60s

    if (!error) setUsers(data)
  }

  return (
    <div>
      <h2>Usuários Online</h2>
      {users.map(user => (
        <div
          key={user.user_id}
          onClick={() => onSelectUser(user)}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', padding: 8, borderBottom: '1px solid #ddd' }}
        >
          <img
            src={user.avatar_url}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
          />
          <strong>{user.email}</strong>
        </div>
      ))}
    </div>
  )
}
