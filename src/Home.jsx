import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Home({ currentUserId, onSelectUser }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, username, avatar_url')
        .neq('id', currentUserId)

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        return
      }

      setUsers(data)
    }

    fetchUsers()
  }, [currentUserId])

  return (
    <div className="user-list">
      <h2>Todos os Usuários</h2>
      {users.map(user => (
        <div
          key={user.id}
          onClick={() => onSelectUser(user)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem',
            cursor: 'pointer',
            borderBottom: '1px solid #eee'
          }}
        >
          <img
            src={user.avatar_url}
            alt="avatar"
            width={30}
            height={30}
            style={{ borderRadius: '50%' }}
          />
          <span>{user.username || 'Sem nome'}</span>
        </div>
      ))}
    </div>
  )
}
