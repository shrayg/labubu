// Image utility functions for AVIF conversion and compression

export const convertToAVIF = async (blob, quality = 80) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Set canvas dimensions
      canvas.width = img.width
      canvas.height = img.height
      
      // Draw image to canvas
      ctx.drawImage(img, 0, 0)
      
      // Convert to AVIF with compression
      canvas.toBlob(
        (avifBlob) => {
          if (avifBlob) {
            resolve(avifBlob)
          } else {
            reject(new Error('Failed to convert to AVIF'))
          }
        },
        'image/avif',
        quality / 100
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(blob)
  })
}

export const compressImage = async (blob, maxWidth = 1024, maxHeight = 1024, quality = 80) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width *= ratio
        height *= ratio
      }
      
      // Set canvas dimensions
      canvas.width = width
      canvas.height = height
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, width, height)
      
      // Convert to AVIF with compression
      canvas.toBlob(
        (compressedBlob) => {
          if (compressedBlob) {
            resolve(compressedBlob)
          } else {
            reject(new Error('Failed to compress image'))
          }
        },
        'image/avif',
        quality / 100
      )
    }
    
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = URL.createObjectURL(blob)
  })
}

export const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

