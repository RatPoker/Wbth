import { useEffect, useState } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from './cropImage'
import { supabase } from './supabase'

export default function Profile({ user, onSave }) {
  const [username, setUsername] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [cropping, setCropping] = useState(false)

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleSelectFile = e => {
    const file = e.target.files[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImageUrl(reader.result)
      setCropping(true)
    }
    reader.readAsDataURL(file)
  }

  const saveProfile = async () => {
    let avatar_url = null

    if (avatarFile && croppedAreaPixels) {
      const croppedImageBlob = await getCroppedImg(imageUrl, croppedAreaPixels)

      // 👇 converte Blob em File corretamente
      const croppedImageFile = new File([croppedImageBlob], 'avatar.jpg', {
        type: 'image/jpeg',
      })

      const filePath = `${user.id}/avatar.jpg`


      console.log('user.id:', user.id)

      const { data: authData } = await supabase.auth.getUser()
      console.log('auth.uid():', authData?.user?.i
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedImageFile, {
          upsert: true,
          contentType: 'image/jpeg',
          cacheControl: '3600',
        })

      if (uploadError) {
        console.error('Erro no upload:', uploadError)
        alert('Erro ao enviar imagem: ' + uploadError.message)
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
    } else {
      console.error('Erro ao salvar perfil:', error)
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
      <input type="file" onChange={handleSelectFile} />
      {cropping && (
        <div style={{ position: 'relative', width: 300, height: 300 }}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>
      )}
      <button onClick={saveProfile}>Salvar</button>
    </div>
  )
}
