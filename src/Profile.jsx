import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export default function Profile({ user, onSave }) {
  const [username, setUsername] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)

  const saveProfile = async () => {
    let avatar_url = null

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()
      const filePath = `${user.id}/avatar.${fileExt}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true })

      if (uploadError) {
        alert('Erro ao enviar imagem')
        return
      }
      avatar_url = filePath
    }

    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, username, avatar_url })

    if (!error) {
      alert('Perfil atualizado')
      onSave?.()
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (data) setUsername(data.username)
    }
    fetchProfile()
  }, [user])

  return (
    <div>
      <h2>Configuração de Perfil</h2>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Nome de usuário"
      />
      <input type="file" onChange={e => setAvatarFile(e.target.files[0])} />
      <button onClick={saveProfile}>Salvar</button>
    </div>
  )
}
