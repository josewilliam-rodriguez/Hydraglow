export const getImageURL = async file => {
  const imagen = new FormData()
  imagen.append('upload_preset', 'Hidraglow-preset')
  imagen.append('file', file)

  const resp = await fetch('https://api.cloudinary.com/v1_1/duqoqmq8i/upload', {
    method: 'POST',
    body: imagen
  })
  const data = await resp.json()

  return data.secure_url
}
