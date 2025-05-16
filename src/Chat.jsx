import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Chat({ user, otherUser, goBack }) {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [file, setFile] = useState(null)

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(user_id.eq.${user.id}, recipient_id.eq.${otherUser.user_id}),and(user_id.eq.${otherUser.user_id}, recipient_id.eq.${user.id})`
      )
      .order('created_at', { ascending: true })

    if (!error) setMessages(data)
  }

  const uploadFile = async () => {
    if (!file) return { url: null, type: null }

    const ext = file.name.split('.').pop()
    const fileName = `uploads/${Date.now()}-${Math.random()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('chat-uploads')
      .upload(fileName, file)

    if (uploadError) {
      alert('Erro ao enviar arquivo.')
      return { url: null, type: null }
    }

    const { data: publicUrl } = supabase.storage
      .from('chat-uploads')
      .getPublicUrl(fileName)

    const type = file.type.startsWith('video/') ? 'video' : 'image'

    return { url: publicUrl.publicUrl, type }
  }

  const sendMessage = async () => {
    let file_url = null
    let file_type = null

    if (file) {
      const result = await uploadFile()
      file_url = result.url
      file_type = result.type
    }

    await supabase.from('messages').insert({
      user_id: user.id,
      recipient_id: otherUser.user_id,
      content: newMessage,
      file_url,
      file_type,
    })

    setNewMessage('')
    setFile(null)
    fetchMessages()
  }

  return (
    <div>
      <button onClick={goBack}>⬅ Voltar</button>
      <h2>Chat com {otherUser.email}</h2>

      <div>
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: '1rem' }}>
            <strong>{msg.user_id === user.id ? 'Você' : otherUser.email}</strong>
            <p>{msg.content}</p>
            {msg.file_url && msg.file_type === 'image' && (
              <img src={msg.file_url} alt="imagem" style={{ maxWidth: '200px' }} />
            )}
            {msg.file_url && msg.file_type === 'video' && (
              <video controls style={{ maxWidth: '300px' }}>
                <source src={msg.file_url} type="video/mp4" />
                Seu navegador não suporta vídeo.
              </video>
            )}
          </div>
        ))}
      </div>

      <div>
        <textarea value={newMessage} onChange={e => setNewMessage(e.target.value)} />
        <br />
        <input type="file" accept="image/*,video/*" onChange={e => setFile(e.target.files[0])} />
        <br />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  )
}
