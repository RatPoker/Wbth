import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Chat({ user, otherUser, goBack }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')

  const roomId = [user.id, otherUser.user_id].sort().join('-')

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('room', roomId)
        .order('created_at', { ascending: true })
      setMessages(data)
    }

    const channel = supabase
      .channel('realtime:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.new.room === roomId) {
          setMessages(prev => [...prev, payload.new])
        }
      })
      .subscribe()

    load()
    return () => supabase.removeChannel(channel)
  }, [roomId])

  const send = async () => {
    if (!text.trim()) return
    await supabase.from('messages').insert({
      sender: user.id,
      receiver: otherUser.user_id,
      room: roomId,
      text
    })
    setText('')
  }

  return (
    <div className="chat">
      <button onClick={goBack}>← Voltar</button>
      <h3>Chat com {otherUser.email}</h3>
      <div className="messages">
        {messages.map(m => (
          <div key={m.id} className={m.sender === user.id ? 'me' : 'other'}>
            <span>{m.text}</span>
          </div>
        ))}
      </div>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="Digite uma mensagem..." />
      <button onClick={send}>Enviar</button>
    </div>
  )
}
