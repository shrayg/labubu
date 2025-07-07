import './App.css'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Button } from './components/ui/button'
import { Card } from './components/ui/card'
import { Upload, Download, Sparkles } from 'lucide-react'
import ImageUpload from './components/ImageUpload'
import GeneratedImage from './components/GeneratedImage'
import OpenAI from 'openai'
import { supabase, supabaseAdmin } from './lib/supabaseClient'
import { useToast } from './hooks/use-toast'

// Import the provided images
import labubuMainTitle from './assets/labubu_main_title.png'
import homeIcon from './assets/home_icon.png'
import generatorIcon from './assets/generator_icon.png'
import galleryIcon from './assets/gallery_icon.png'
import galleryTitle from './assets/labubu_gallery_title.png'
import createLabubuTitle from './assets/create_labubu_title.png'

function App() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [appImage, setAppImage] = useState([])
  const [generatedImage, setGeneratedImage] = useState(null)
  const [images, setImages] = useState([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [done, setDone] = useState(false)
  const { toast } = useToast()
  const handleCopyCA = useCallback(() => {
    navigator.clipboard.writeText('9ckL51ZbpqdzosCH2xcLsNfPy7hiZxbDZnz2cdcBCnMv')
  })

  const homeRef = useRef(null)
  const generatorRef = useRef(null)
  const galleryRef = useRef(null)

  const scrollToSection = (section) => {
    const refs = {
      home: homeRef,
      generator: generatorRef,
      gallery: galleryRef
    }
    refs[section]?.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const fetchImages = async () => {
      const { data, error } = await supabase
        .from('images')
        .select('id, url, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch images:', error)
        return
      }

      if (data) {
        setImages(
          data.map(img => ({
            id: img.id,
            url: img.url,
            timestamp: img.created_at
          }))
        )
      }
    }

    fetchImages()
  }, [])

  const handleImageUpload = (imageUrl) => {
    setUploadedImage(imageUrl)
    setGeneratedImage(null)
    setDone(false)

    fetch(imageUrl)
      .then(res => res.blob())
      .then(blob => {
        setAppImage([{ blob }])
      })
  }

  const generateImage = async () => {
    if (!appImage || appImage.length === 0) {
      toast({
        title: 'No image selected',
        description: 'Please upload an image first',
        variant: 'destructive',
      })
      return
    }

    setIsGenerating(true)
    try {
      const openai = new OpenAI({
        apiKey: import.meta.env.VITE_API_KEY,
        dangerouslyAllowBrowser: true
      })

      console.log('past key')

      const prompt = `Create a high-resolution, front-facing Labubu-style plush keychain character in a 1:1 aspect ratio on a clean white background with soft, even studio lighting.

Use the provided image as theme and color inspiration.

Specifications:

Fleece Texture & Body: Soft, curly fleece body with a color that represents the main image, with plush hands and feet.

Face & Eyes: Off-white plush face panel; large, glossy black or colored “beaded” eyes matching the key colors from the input; thick embroidered brows; a small round plush nose.

Iconic Grin: Wide, mischievous Labubu smile—sharp, white embroidered teeth.

Chest Detail: Embroider a simple pixel-style motif drawn from the central element of the input image onto the chest in bright contrasting thread.

Keychain Finishing: Attach a gold metal keyring and a beige woven tag reading “THE MONSTERS” at the top seam.

Tone & Feel:

Playful, collectible-ready, with vibrant but clean styling.

Maintain Labubu’s signature proportions (round head, stubby body) and friendly yet cheeky charm.

Ensure the final result looks like a high-quality vinyl toy photo—crisp edges, soft shadows, true-to-life textures.`

      const imageObj = appImage[0]

      const toBase64 = (blob) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            const base64 = (reader.result).split(',')[1]
            resolve(base64)
          }
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
      }

      let base64Image = null
      if (imageObj.blob) {
        base64Image = await toBase64(imageObj.blob)
      } else {
        toast({
          title: 'Error',
          description: 'Could not extract image data from uploaded file.',
          variant: 'destructive',
        })
        setIsGenerating(false)
        return
      }

      const response = await openai.responses.create({
        model: 'o3',
        input: [
          {
            role: 'user',
            content: [
              { type: 'input_text', text: prompt },
              {
                type: 'input_image',
                image_url: `data:image/png;base64,${base64Image}`,
                detail: 'auto',
                aspect_ratio: '1:1'

              },
            ],
          },
        ],
        tools: [{ type: 'image_generation' }],
      })
      
      // const response = await openai.images.generate({
      //   model: 'dall-e-3',
      //   prompt,
      //   n: 1,
      //   size: '1024x1024'
      // })
      

      const imageData = response.output
        .filter((output) => output.type === 'image_generation_call')
        .map((output) => output.result)

      const generatedImageBase64 = imageData[0]
      if (generatedImageBase64) {
        setGeneratedImage(`data:image/png;base64,${generatedImageBase64}`)
        //toast({
        //  title: 'Image generated successfully!',
        //  description: 'Your generated Labubu is ready.',
        //})

        const dataURL = `data:image/png;base64,${generatedImageBase64}`

        const res = await fetch(dataURL)
        const blob = await res.blob()

        const fileName = `labubu-${Date.now()}.png`
        const { error: upLoadErr } = await supabaseAdmin
          .storage
          .from('labubus-images')
          .upload(fileName, blob, { contentType: 'image/png' })
        if (upLoadErr) {
          console.error('Storage upload error:', upLoadErr)
          console.error('Error message:', upLoadErr.message)
          throw upLoadErr
        }

        const { data } = supabaseAdmin
          .storage
          .from('labubus-images')
          .getPublicUrl(fileName)

        if (!data || !data.publicUrl) {
          console.error('getPublicUrl failed: Missing public URL')
          throw new Error('Failed to retrieve public URL')
        }

        const publicUrl = data.publicUrl

        console.log('About to insert with URL:', publicUrl)

        const { error: dbErr } = await supabaseAdmin
          .from('images')
          .insert({
            url: publicUrl,
            user_id: null
          })
        if (dbErr) {
          console.error('Detailed insert error:', dbErr)
          console.error('Error code:', dbErr.code)
          console.error('Error message:', dbErr.message)
          console.error('Error details:', dbErr.details)
          throw dbErr
        }

        //toast({ title: 'Image saved to gallery!' })

      } else {
        toast({
          title: 'Generation failed',
          description: 'Failed to generate image.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error generating image:', error)
      toast({
        title: 'Generation failed',
        description: 'An error occurred while generating the image.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
      setDone(true)
    }
  }
  

  const downloadGeneratedImage = () => {
    if (!generatedImage) return
    
    const link = document.createElement('a')
    link.href = generatedImage
    link.download = `labubu-generated-${Date.now()}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadImage = async (imageUrl, id) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `labubu-${id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Download failed:', err)
      alert('Failed to download image. Please try again.')
    }
  }

  return (
    <div className="labubu-bg fabric-texture smooth-scroll">
      {/* Desktop Navigation */}
      <div className="desktop-nav">
        <button
          onClick={() => scrollToSection('home')}
          className="nav-button w-16 h-16 rounded-full overflow-hidden border-0 bg-transparent p-0"
          aria-label="Go to Home"
        >
          <img src={homeIcon} alt="Home" className="w-full h-full object-cover" />
        </button>
        <button
          onClick={() => scrollToSection('generator')}
          className="nav-button w-16 h-16 rounded-full overflow-hidden border-0 bg-transparent p-0"
          aria-label="Go to Generator"
        >
          <img src={generatorIcon} alt="Generator" className="w-full h-full object-cover" />
        </button>
        <button
          onClick={() => scrollToSection('gallery')}
          className="nav-button w-16 h-16 rounded-full overflow-hidden border-0 bg-transparent p-0"
          aria-label="Go to Gallery"
        >
          <img src={galleryIcon} alt="Gallery" className="w-full h-full object-cover" />
        </button>
      </div>

      {/* Mobile Navigation */}
      <div className="mobile-nav-container">
        <div className="mobile-nav flex gap-3">
          <button
            onClick={() => scrollToSection('home')}
            className="nav-button w-12 h-12 rounded-full overflow-hidden border-0 bg-white p-0"
            aria-label="Go to Home"
          >
            <img src={homeIcon} alt="Home" className="w-full h-full object-cover" />
          </button>
          <button
            onClick={() => scrollToSection('generator')}
            className="nav-button w-12 h-12 rounded-full overflow-hidden border-0 bg-white p-0"
            aria-label="Go to Generator"
          >
            <img src={generatorIcon} alt="Generator" className="w-full h-full object-cover" />
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="nav-button w-12 h-12 rounded-full overflow-hidden border-0 bg-white p-0"
            aria-label="Go to Gallery"
          >
            <img src={galleryIcon} alt="Gallery" className="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      {/* Home Section */}
      <section ref={homeRef} className="min-h-screen flex flex-col items-center justify-center section-padding">
        <div className="text-center max-w-4xl mx-auto w-full px-2">
          {/* Main Title */}
          <div className="mb-6 md:mb-8 lg:mb-12">
            <img 
              src={labubuMainTitle} 
              alt="Labubu's Smile" 
              className="mx-auto title-image drop-shadow-2xl"
            />
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8 lg:mb-12 justify-center">
            <Button
              onClick={() => scrollToSection('generator')}
              size="lg"
              className="generate-button action-button rounded-full"
            >
              <Sparkles className="mr-2" size={16} />
              Start Creating
            </Button>
            <Button
              onClick={() => scrollToSection('gallery')}
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground action-button rounded-full"
            >
              View Gallery
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white action-button rounded-full"
            >
              <a
                href="https://x.com/i/communities/1942335061379981670/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {/* You can use a Twitter icon here if you have one */}
                Twitter
              </a>
            </Button>
          </div>
          
          {/* Welcome Message */}
          <div className="stitched-border bg-card card-content mb-6 md:mb-8 lg:mb-12 max-w-2xl mx-auto">
            <h2 className="welcome-title font-bold text-primary mb-3 md:mb-4">
              Welcome to the magical world of Labubu's!
            </h2>
            <p className="welcome-text text-muted-foreground">
              <b>Create your very own Labubu character</b> with our AI generator! 
              <br />
              Upload any image and watch as it transforms into a unique Labubu design.
              <br />
              <b>Join our community</b> and explore <b>the gallery</b> of amazing Labubus created by others.
              <br />
              <br />
              
            </p>
          </div>

          
          { /* CA*/}
          <div className="stitched-border bg-card card-content max-w-2xl mx-auto">
            <p
              onClick={handleCopyCA}
              className="welcome-text text-muted-foreground cursor-pointer"
            >
              <b>CA:</b> 9ckL51ZbpqdzosCH2xcLsNfPy7hiZxbDZnz2cdcBCnMv
              <br />
              <span className="text-xs italic text-gray-500">Click to copy</span>
            </p>
          </div>


          
        </div>
      </section>

      {/* Generator Section */}
      <section ref={generatorRef} className="min-h-screen flex flex-col items-center justify-center section-padding">
        <div className="max-w-6xl mx-auto w-full px-2">
          {/* Section Title */}
          <div className="text-center mb-6 md:mb-8 lg:mb-12">
            <img 
              src={createLabubuTitle} 
              alt="Create Your Labubu" 
              className="mx-auto section-title-image drop-shadow-2xl mb-3 md:mb-4 lg:mb-6"
            />
            <p className="section-description text-muted-foreground max-w-2xl mx-auto px-2">
              Upload any image and transform it into your personalized Labubu character
            </p>
          </div>

          <div className="generator-grid">
            {/* Upload Section */}
            <Card className="stitched-border bg-card card-content card-hover">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-primary mb-3 md:mb-4 lg:mb-6 text-center">Upload Image</h3>
              
              {uploadedImage ? (
                <div className="space-y-3 md:space-y-4 text-center">
                  <img 
                    src={uploadedImage} 
                    alt="Uploaded" 
                    className="mx-auto max-w-full h-24 md:h-32 lg:h-48 object-contain rounded-lg shadow-lg"
                  />
                  <Button
                    onClick={() => setUploadedImage(null)}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-xs md:text-sm"
                  >
                    Choose Different Image
                  </Button>
                </div>
              ) : (
                <ImageUpload onImageUpload={handleImageUpload} />
              )}

              <Button
                onClick={generateImage}
                disabled={!uploadedImage || isGenerating}
                className="generate-button w-full mt-3 md:mt-4 lg:mt-6 py-2 md:py-3 lg:py-4 text-sm md:text-base lg:text-lg font-bold rounded-lg"
              >
                <Sparkles className="mr-2" size={14} />
                {isGenerating ? 'Generating Your Labubu...' : 'Generate Labubu'}
              </Button>
            </Card>

            {/* Result Section */}
            <Card className="stitched-border bg-card card-content card-hover">
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-primary mb-3 md:mb-4 lg:mb-6 text-center">Your Labubu</h3>
              <GeneratedImage
                imageUrl={generatedImage}
                isGenerating={isGenerating}
              />
            </Card>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section ref={galleryRef} className="min-h-screen flex flex-col items-center justify-center section-padding">
        <div className="max-w-6xl mx-auto w-full px-2">
          {/* Section Title */}
          <div className="text-center mb-6 md:mb-8 lg:mb-12">
            <img 
              src={galleryTitle} 
              alt="Labubu Gallery" 
              className="mx-auto gallery-title-image drop-shadow-2xl mb-3 md:mb-4 lg:mb-6"
            />
            <p className="section-description text-muted-foreground px-2">
              Explore all the amazing Labubus created by our community
            </p>
          </div>

          {images.length === 0 ? (
            <Card className="stitched-border bg-card card-content text-center card-hover">
              <div className="text-muted-foreground mb-4 md:mb-6">
                <div className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16 mx-auto mb-3 md:mb-4 bg-muted rounded-lg flex items-center justify-center">
                  <Sparkles size={20} className="md:w-6 md:h-6 lg:w-8 lg:h-8" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold mb-2 text-primary">No Labubus created yet</h3>
                <p className="text-xs md:text-sm lg:text-base">Start creating your first Labubu!</p>
              </div>
              <Button
                onClick={() => scrollToSection('generator')}
                className="generate-button action-button rounded-lg font-bold"
              >
                Create Your First Labubu
              </Button>
            </Card>
          ) : (
            <div className="gallery-grid">
              {images.map((image) => (
                <div key={image.id} className="gallery-item stitched-border">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={image.url}
                      alt={`Labubu ${image.id}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-1 md:p-2 lg:p-3 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {new Date(image.timestamp).toLocaleDateString()}
                    </span>
                    <Button
                      size="sm"
                      onClick={() => downloadImage(image.url, image.id)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs px-1 md:px-2 py-1"
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default App



