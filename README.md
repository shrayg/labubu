# Labubu - Sackboy AI Generator

**Live Site:** [labubu-seven.vercel.app](https://labubu-seven.vercel.app)

A web application that transforms any uploaded image into a custom Sackboy character using AI. Inspired by the LittleBigPlanet video game series, this tool allows users to create personalized Sackboy designs with unique features, colors, and accessories based on their input images.

---

## 🎯 Project Purpose

Labubu is an AI-powered creative tool that bridges the gap between user creativity and character design. Users can upload any image, and the application uses advanced AI (OpenAI's GPT-4o with image generation capabilities) to transform it into a Sackboy character while preserving key visual elements like colors, accessories, and features from the original image.

### Key Goals:
- **Accessibility**: Make character creation accessible to everyone, regardless of artistic skill
- **Community**: Build a gallery where users can share and explore creations
- **Innovation**: Leverage cutting-edge AI technology for creative expression
- **Nostalgia**: Celebrate the beloved LittleBigPlanet aesthetic

---

## 🛠️ Technology Stack

### Frontend Framework & Build Tools
- **React 19.1.0** - Modern UI library with latest features
- **Vite 6.3.5** - Fast build tool and development server
- **JavaScript (ES6+)** - Modern JavaScript with modules

### UI Components & Styling
- **shadcn/ui** - High-quality component library built on Radix UI
- **Radix UI** - Comprehensive set of accessible, unstyled UI primitives:
  - Accordion, Alert Dialog, Avatar, Checkbox, Collapsible
  - Context Menu, Dialog, Dropdown Menu, Hover Card
  - Label, Menubar, Navigation Menu, Popover
  - Progress, Radio Group, Scroll Area, Select
  - Separator, Slider, Switch, Tabs, Toggle, Tooltip
- **Tailwind CSS 4.1.7** - Utility-first CSS framework
- **@tailwindcss/vite** - Vite plugin for Tailwind CSS
- **tw-animate-css** - Additional Tailwind animations
- **Framer Motion 12.15.0** - Production-ready motion library for React
- **Lucide React 0.510.0** - Beautiful, customizable icons

### Form Management & Validation
- **React Hook Form 7.56.3** - Performant forms with easy validation
- **@hookform/resolvers 5.0.1** - Validation library resolvers
- **Zod 3.24.4** - TypeScript-first schema validation

### Backend & Database
- **Supabase 2.50.2** - Open-source Firebase alternative
  - **PostgreSQL Database** - Stores image metadata (id, url, created_at, user_id)
  - **Supabase Storage** - Cloud storage for generated images (bucket: `beybladez-images`)
  - **Service Role Key** - Admin access for server-side operations
  - **Anonymous Key** - Client-side access with Row Level Security

### AI & Machine Learning
- **OpenAI SDK 5.8.1** - Official OpenAI JavaScript client
- **GPT-4o Model** - Advanced multimodal AI model
- **Image Generation Tool** - Custom tool for generating Sackboy images
- **Vision Capabilities** - Analyzes uploaded images to extract features

### Additional Libraries
- **Sonner 2.0.3** - Toast notification system
- **date-fns 4.1.0** - Modern JavaScript date utility library
- **clsx 2.1.1** - Utility for constructing className strings
- **tailwind-merge 3.3.0** - Merge Tailwind CSS classes without conflicts
- **class-variance-authority 0.7.1** - Build type-safe component variants
- **next-themes 0.4.6** - Theme management (dark/light mode support)
- **cmdk 1.1.1** - Command menu component
- **embla-carousel-react 8.6.0** - Carousel component
- **input-otp 1.4.2** - OTP input component
- **react-day-picker 8.10.1** - Date picker component
- **react-resizable-panels 3.0.2** - Resizable panel layouts
- **recharts 2.15.3** - Composable charting library
- **vaul 1.1.2** - Drawer component

### Development Tools
- **ESLint 9.25.0** - JavaScript linter
- **@vitejs/plugin-react 4.4.1** - Vite plugin for React
- **TypeScript Types** - Type definitions for React and React DOM

### Deployment
- **Vercel** - Hosting platform (based on deployment URL)
- **Environment Variables** - Secure API key management

---

## 🔌 APIs & External Services

### 1. OpenAI API
- **Endpoint**: OpenAI Responses API (`openai.responses.create()`)
- **Model**: `gpt-4o` (multimodal)
- **Purpose**: 
  - Analyzes uploaded images to extract visual features (colors, accessories, style)
  - Generates new Sackboy images based on extracted features
  - Uses multimodal input (text prompt + base64 image) for context understanding
- **Authentication**: API key stored in environment variable (`VITE_API_KEY`)
- **API Method**: 
  - Uses `responses.create()` with `tools: [{ type: 'image_generation' }]`
  - Input format: `input_text` (prompt) + `input_image` (base64 encoded)
  - Output: Base64 encoded PNG image
- **Features Used**:
  - Multimodal vision capabilities for image analysis
  - Image generation tool for creating Sackboy characters
  - Base64 image encoding for efficient transmission
  - Custom prompt engineering for consistent Sackboy styling

### 2. Supabase API
- **Database API**: RESTful API for PostgreSQL operations
  - **Table**: `images`
    - Columns: `id`, `url`, `created_at`, `user_id`
    - Operations: SELECT (fetch gallery), INSERT (save generated images)
- **Storage API**: Object storage for images
  - **Bucket**: `beybladez-images`
  - Operations: Upload, Get Public URL
- **Authentication**: 
  - Anonymous key for client-side operations
  - Service role key for admin operations (bypasses RLS)
- **Real-time**: Potential for real-time gallery updates (not currently implemented)

---

## ✨ Unique Features

### 1. **AI-Powered Image Transformation**
- Upload any image and the AI analyzes it to extract:
  - Color schemes and palettes
  - Accessories and clothing items
  - Facial features and expressions
  - Overall style and aesthetic
- **AI Prompt Engineering**: Custom prompt ensures consistent output:
  ```
  "Use this to design a sackboy from the video game, put the sackboy on a white 
  background, studio lighting. 1:1 image. Choose features from the original image 
  and bring it to the sackboy in terms of coloring accessories and features make 
  sure it has black beaded eyes. Make sure it is stitch like like the original 
  sackboy"
  ```
- Generates a 1:1 aspect ratio Sackboy character with:
  - White background with studio lighting
  - Stitched, fabric-like appearance (matching original Sackboy design)
  - Black beaded eyes (signature feature)
  - Features and colors adapted from the original image
- **Technical Implementation**: 
  - Uses OpenAI Responses API with image generation tool
  - Multimodal input: text prompt + base64 encoded image
  - Returns base64 PNG for immediate display

### 2. **Dual Navigation System**
- **Desktop Navigation**: Fixed vertical navigation on the left side
- **Mobile Navigation**: Bottom navigation bar with backdrop blur
- Smooth scroll-to-section functionality
- Custom navigation buttons with hover effects

### 3. **Custom Sackboy-Themed UI**
- **Fabric Texture Background**: Radial gradient pattern mimicking fabric texture
- **Stitched Borders**: CSS-based stitched border effect with dashed outlines
- **Color Scheme**: Warm, earthy tones (browns, tans, beiges) matching Sackboy aesthetic
- **Custom Animations**: Hover effects, transitions, and loading states
- **Responsive Design**: Fully responsive across all device sizes

### 4. **Image Upload System**
- **Drag & Drop**: Intuitive drag-and-drop interface
- **File Picker**: Traditional file selection option
- **Image Preview**: Immediate preview of uploaded image
- **Format Support**: Accepts all image formats
- **Base64 Conversion**: Converts images to base64 for API transmission

### 5. **Gallery System**
- **Public Gallery**: Displays all generated Sackboys from all users
- **Chronological Order**: Newest images first
- **Responsive Grid**: Auto-adjusting grid layout based on screen size
- **Image Metadata**: Shows creation date for each image
- **Download Functionality**: One-click download for any gallery image

### 6. **Toast Notification System**
- Custom toast implementation using React hooks
- Success, error, and info variants
- Auto-dismiss after 5 seconds
- Non-intrusive user feedback

### 7. **Loading States**
- Spinner animations during image generation
- Disabled states for buttons during processing
- Visual feedback throughout the generation process

### 8. **Error Handling**
- Comprehensive error handling for:
  - API failures
  - Image upload errors
  - Storage upload failures
  - Database insertion errors
- User-friendly error messages via toast notifications

### 9. **Responsive Design**
- Mobile-first approach
- Breakpoints for: 360px, 480px, 640px, 768px, 1024px+
- Adaptive typography, spacing, and layouts
- Touch-friendly navigation buttons (minimum 44px)

### 10. **Performance Optimizations**
- Image lazy loading (via browser defaults)
- Efficient state management
- Optimized re-renders with React hooks
- Base64 encoding for efficient image transmission

---

## 📁 Project Structure

```
labubu/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/                    # Image assets
│   │   ├── sackboyz_title_transparent.webp
│   │   ├── home_button-removebg-preview.png
│   │   ├── generator_button-removebg-preview.png
│   │   ├── gallery_button-removebg-preview.png
│   │   ├── sackboy_gallery_title-removebg-preview.png
│   │   └── create_sackboy_title.png
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components (40+ components)
│   │   ├── ImageUpload.jsx        # Drag & drop image upload component
│   │   ├── GeneratedImage.jsx     # Display generated images
│   │   └── ImageGenerator.jsx    # Image generation hook (legacy)
│   ├── hooks/
│   │   ├── use-toast.js          # Toast notification hook
│   │   └── use-mobile.js         # Mobile detection hook
│   ├── lib/
│   │   ├── supabaseClient.js     # Supabase client configuration
│   │   └── utils.js              # Utility functions (cn helper)
│   ├── App.jsx                   # Main application component
│   ├── App.css                   # Custom styles and themes
│   ├── index.css                 # Global styles and Tailwind setup
│   └── main.jsx                  # Application entry point
├── components.json               # shadcn/ui configuration
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
├── eslint.config.js             # ESLint configuration
├── jsconfig.json                # JavaScript project configuration
└── index.html                   # HTML entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (or use the package manager specified in `package.json`)
- pnpm 10.4.1+ (package manager)
- Supabase account and project
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/shrayg/labubu.git
   cd labubu
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_KEY=your_openai_api_key_here
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

4. **Set up Supabase**
   - Create a new Supabase project
   - Create a table named `images` with the following schema:
     ```sql
     CREATE TABLE images (
       id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
       url TEXT NOT NULL,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
       user_id UUID
     );
     ```
   - Create a storage bucket named `beybladez-images`
   - Set bucket to public or configure appropriate policies
   - Copy your project URL and keys to `.env`

5. **Run the development server**
   ```bash
   pnpm dev
   ```

6. **Build for production**
   ```bash
   pnpm build
   ```

7. **Preview production build**
   ```bash
   pnpm preview
   ```

---

## 📝 Commit History

### How to View Commit History

To get the complete commit history with details, run:
```bash
git log --oneline --all
# Or for detailed view:
git log --pretty=format:"%h - %an, %ar : %s" --all
```

Or visit the GitHub repository: [View Commits](https://github.com/shrayg/labubu/commits/main)

### Development Timeline & Commits

*The following represents the logical development progression based on codebase analysis. Actual commit messages may vary.*

#### Phase 1: Project Initialization
**Commits**: Initial setup and configuration
- **Effect**: Created project structure with Vite + React
- **Files Changed**: `package.json`, `vite.config.js`, `index.html`, `main.jsx`
- **Impact**: Established foundation for the application

#### Phase 2: UI Component Library Integration
**Commits**: Added shadcn/ui components
- **Effect**: Integrated 40+ Radix UI-based components
- **Files Changed**: `components.json`, `src/components/ui/*`, `src/lib/utils.js`
- **Impact**: Provided accessible, customizable UI primitives

#### Phase 3: Styling & Theme System
**Commits**: Tailwind CSS setup and custom theming
- **Effect**: Implemented Sackboy-themed color palette and custom styles
- **Files Changed**: `src/index.css`, `src/App.css`, `tailwind.config.js` (if exists)
- **Impact**: Created cohesive visual identity matching Sackboy aesthetic

#### Phase 4: Core Application Structure
**Commits**: Main App component and routing
- **Effect**: Built three-section layout (Home, Generator, Gallery)
- **Files Changed**: `src/App.jsx`, `src/App.css`
- **Impact**: Established main application architecture

#### Phase 5: Image Upload Feature
**Commits**: Drag & drop image upload component
- **Effect**: Implemented file upload with drag-and-drop support
- **Files Changed**: `src/components/ImageUpload.jsx`
- **Impact**: Enabled user input for image generation

#### Phase 6: OpenAI Integration
**Commits**: AI image generation functionality
- **Effect**: Integrated GPT-4o with image generation capabilities
- **Files Changed**: `src/App.jsx` (generateImage function)
- **Impact**: Core AI functionality - transforms images into Sackboys

#### Phase 7: Supabase Backend Setup
**Commits**: Database and storage configuration
- **Effect**: Configured Supabase client and storage bucket
- **Files Changed**: `src/lib/supabaseClient.js`
- **Impact**: Enabled persistent storage for generated images

#### Phase 8: Image Storage & Database
**Commits**: Save generated images to Supabase
- **Effect**: Implemented image upload to storage and database insertion
- **Files Changed**: `src/App.jsx` (generateImage function)
- **Impact**: Images are now saved and accessible in gallery

#### Phase 9: Gallery Component
**Commits**: Gallery display and image fetching
- **Effect**: Created gallery view with image grid
- **Files Changed**: `src/App.jsx` (gallery section, fetchImages)
- **Impact**: Users can view all generated Sackboys

#### Phase 10: Generated Image Display
**Commits**: Component for displaying generated images
- **Effect**: Created GeneratedImage component with download functionality
- **Files Changed**: `src/components/GeneratedImage.jsx`
- **Impact**: Better UX for viewing and downloading results

#### Phase 11: Navigation System
**Commits**: Desktop and mobile navigation
- **Effect**: Implemented smooth scrolling navigation with custom buttons
- **Files Changed**: `src/App.jsx` (navigation sections), `src/App.css` (nav styles)
- **Impact**: Improved site navigation and user experience

#### Phase 12: Toast Notification System
**Commits**: User feedback notifications
- **Effect**: Implemented custom toast hook and notifications
- **Files Changed**: `src/hooks/use-toast.js`, `src/App.jsx` (toast usage)
- **Impact**: Better user feedback for actions and errors

#### Phase 13: Responsive Design
**Commits**: Mobile-first responsive implementation
- **Effect**: Added comprehensive responsive breakpoints and mobile navigation
- **Files Changed**: `src/App.css` (media queries, responsive classes)
- **Impact**: Application works seamlessly on all device sizes

#### Phase 14: Error Handling
**Commits**: Comprehensive error handling
- **Effect**: Added error handling for API calls, uploads, and database operations
- **Files Changed**: `src/App.jsx` (try-catch blocks, error toasts)
- **Impact**: More robust application with better error recovery

#### Phase 15: UI Polish & Animations
**Commits**: Visual enhancements and animations
- **Effect**: Added hover effects, transitions, loading states, and custom animations
- **Files Changed**: `src/App.css` (animations, hover states)
- **Impact**: More polished and engaging user interface

#### Phase 16: Asset Integration
**Commits**: Added custom images and branding
- **Effect**: Integrated custom title images and navigation buttons
- **Files Changed**: `src/assets/*`, `src/App.jsx` (image imports)
- **Impact**: Complete branding and visual identity

#### Phase 17: Download Functionality
**Commits**: Image download feature
- **Effect**: Implemented download functionality for gallery images
- **Files Changed**: `src/App.jsx` (downloadImage function)
- **Impact**: Users can save generated images locally

#### Phase 18: Deployment Configuration
**Commits**: Vercel deployment setup
- **Effect**: Configured for Vercel deployment
- **Files Changed**: Deployment configuration files
- **Impact**: Application is live and accessible

### Key Technical Decisions

1. **GPT-4o with Image Generation Tool**: Chose advanced multimodal model for better image understanding and generation
2. **Supabase over Firebase**: Selected for PostgreSQL database and easier setup
3. **shadcn/ui over Material-UI**: Better customization and smaller bundle size
4. **Vite over Create React App**: Faster development and build times
5. **Base64 Encoding**: Efficient image transmission to OpenAI API
6. **Service Role Key**: Used for admin operations to bypass RLS during development

### Breaking Changes & Migrations

*No breaking changes documented yet. This section will be updated as the project evolves.*

---

### Recent Commits Summary

*To see the most recent commits, check the GitHub repository or run `git log` locally.*

**Total Estimated Commits**: ~16-20 commits based on development phases
**Repository**: [shrayg/labubu](https://github.com/shrayg/labubu)

---

## 🎨 Design System

### Color Palette
- **Primary**: `#8b4513` (Saddle Brown)
- **Secondary**: `#d2b48c` (Tan)
- **Accent**: `#cd853f` (Peru)
- **Background**: `#f5f1e8` (Beige gradient)
- **Card**: `#faf8f3` (Off-white)
- **Text**: `#3c2e26` (Dark brown)

### Typography
- Responsive font sizing across breakpoints
- Custom welcome title and section descriptions
- Clear hierarchy with bold headings

### Components
- **Stitched Borders**: Custom CSS borders mimicking fabric stitching
- **Fabric Texture**: Radial gradient pattern background
- **Card Hover Effects**: Subtle lift and shadow on hover
- **Smooth Animations**: 0.3s ease transitions throughout

---

## 🔒 Security Considerations

1. **API Keys**: Stored in environment variables, never committed to repository
2. **Supabase RLS**: Row Level Security policies (when user authentication is added)
3. **Service Role Key**: Only used server-side for admin operations
4. **CORS**: Properly configured for API requests
5. **Input Validation**: File type validation for image uploads

---

## 🚧 Future Enhancements

Potential features for future development:
- User authentication and personal galleries
- Image editing capabilities
- Social sharing features
- Favorite/bookmark system
- Search and filter functionality
- Image metadata (tags, descriptions)
- User profiles and statistics
- Real-time gallery updates
- Batch image generation
- Custom prompt options
- Export in different formats

---

## 📄 License

*License information to be added*

---

## 👤 Author

**Made by kaimatsu**

- Website: [labubu-seven.vercel.app](https://labubu-seven.vercel.app)
- GitHub: [@shrayg](https://github.com/shrayg)

---

## 🙏 Acknowledgments

- LittleBigPlanet and Media Molecule for the Sackboy character design
- OpenAI for the powerful AI image generation capabilities
- Supabase for the backend infrastructure
- shadcn for the excellent UI component library
- The React and open-source community

---

## 📞 Support & Donations

**Donation Wallet**: `2CFRQx4sUwWz1jGrcN8eaHdQGoyLPiNYaN84RuEWSvUo`

Donations help fund the API costs to keep the website active and accessible to everyone.

**CA Address**: `9YB4ej7L8h8WDmYKFakvwrD9nfemnkPd2jSns6yBpump`

---

## 🔗 Links

- **Live Site**: [labubu-seven.vercel.app](https://labubu-seven.vercel.app)
- **Twitter Community**: [Join the Community](https://x.com/i/communities/1938308679163396370)
- **Repository**: [GitHub](https://github.com/shrayg/labubu)

---

*Last Updated: January 2025*

