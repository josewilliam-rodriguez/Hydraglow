// utils/mediaUpload.js
export const getMediaURL = async (file, type = 'image') => {
  const formData = new FormData();
  formData.append('upload_preset', 'Hidraglow-preset');
  formData.append('file', file);
  
  // Especificar carpeta según el tipo
  if (type === 'video') {
    formData.append('folder', 'blog-videos');
    formData.append('resource_type', 'video');
  } else {
    formData.append('folder', 'blog-images');
  }

  try {
    const resp = await fetch('https://api.cloudinary.com/v1_1/duqoqmq8i/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!resp.ok) {
      throw new Error(`Error en la subida: ${resp.statusText}`);
    }
    
    const data = await resp.json();
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading media:', error);
    throw error;
  }
};

// Función de compatibilidad
export const getImageURL = async (file) => {
  return getMediaURL(file, 'image');
};