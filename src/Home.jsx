import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Home({ currentUserId, onSelectUser }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('presence').select('*')
        .neq('user_id', currentUserId)
      setUsers(data)
    }

    fetchUsers()
    const interval = setInterval(fetchUsers, 10000)
    return () => clearInterval(interval)
  }, [currentUserId])

  return (
    <div className="user-list">
      <h2>Usuários Online</h2>
      {users.map(user => (
        <div key={user.user_id} onClick={() => onSelectUser(user)}>
          <img src={user.avatar_url} alt="" width={30} />
          <span>{user.email}</span>
        </div>
      ))}
    </div>
  )
}
