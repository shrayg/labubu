import { useState, useRef } from 'react'
import { Upload } from 'lucide-react'
import { Button } from './ui/button'

const ImageUpload = ({ onImageUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        onImageUpload(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 md:p-8 lg:p-12 text-center transition-colors cursor-pointer ${
          isDragOver
            ? 'border-primary bg-primary/10'
            : 'border-muted-foreground/30 hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <Upload className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mx-auto mb-3 md:mb-4 text-muted-foreground" />
        <p className="text-sm md:text-base lg:text-lg font-medium mb-2">
          Drag and drop an image here
        </p>
        <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
          or
        </p>
        <Button
          type="button"
          className="generate-button text-xs md:text-sm lg:text-base px-4 md:px-6 py-2 md:py-3"
        >
          Choose Image
        </Button>
      </div>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
      
      <p className="text-xs md:text-sm text-muted-foreground text-center">
        Drag and drop an image here, or click to browse
      </p>
    </div>
  )
}

export default ImageUpload

