import { useState } from 'react'

export const useToast = () => {
  const [toasts, setToasts] = useState([])

  const toast = ({ title, description, variant = 'default' }) => {
    const id = Date.now()
    const newToast = { id, title, description, variant }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
    
    // For now, just use alert for simplicity
    if (variant === 'destructive') {
      alert(`Error: ${title}\n${description}`)
    } else {
      alert(`${title}\n${description}`)
    }
  }

  return { toast, toasts }
}

