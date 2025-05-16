import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Chat({ user, otherUser, goBack }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        payload => {
          const msg = payload.new
          if (
            (msg.sender_id === user.id && msg.receiver_id === otherUser.id) ||
            (msg.sender_id === otherUser.id && msg.receiver_id === user.id)
          ) {
            setMessages(prev => [...prev, msg])
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, otherUser])

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUser.id}),and(sender_id.eq.${otherUser.id},receiver_id.eq.${user.id})`)
      .order('created_at', { ascending: true })

    setMessages(data)
  }

  const sendMessage = async () => {
    await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: otherUser.id,
      content: newMessage
    })
    setNewMessage('')
  }

  return (
    <div>
      <h2>Chat com {otherUser.username}</h2>
      <button onClick={goBack}>Voltar</button>
      <div style={{ height: '300px', overflow: 'auto' }}>
        {messages.map(msg => (
          <p key={msg.id}>
            <strong>{msg.sender_id === user.id ? 'Você' : otherUser.username}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
        placeholder="Digite uma mensagem"
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  )
}
