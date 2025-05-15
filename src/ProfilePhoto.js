import { supabase } from './supabase'
import { useState } from 'react'

export default function ProfilePhoto({ user }) {
  const [file, setFile] = useState(null)

  const uploadAvatar = async () => {
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `avatars/${user.id}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('chat-uploads')
      .upload(fileName, file, { upsert: true })

    if (uploadError) {
      alert('Erro ao enviar avatar: ' + uploadError.message)
      return
    }

    const { data: publicUrl } = supabase.storage
      .from('chat-uploads')
      .getPublicUrl(fileName)

    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl.publicUrl }
    })

    if (updateError) {
      alert('Erro ao salvar avatar: ' + updateError.message)
    } else {
      alert('Avatar atualizado com sucesso!')
    }
  }

  return (
    <div>
      <h3>Foto de perfil</h3>
      <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
      <button onClick={uploadAvatar}>Atualizar avatar</button>
    </div>
  )
}
