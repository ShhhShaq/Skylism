import Link from "next/link"
import BeforeAfterSlider from "@/components/BeforeAfterSlider"
import ScrollAnimations from "@/components/ScrollAnimations"
import ScrollNavbar from "@/components/ScrollNavbar"
import ImageCarousel from "@/components/ImageCarousel"
import MobileMenu from "@/components/MobileMenu"
import ScrollRevealSection from "@/components/ScrollRevealSection"

export default function Home() {
  return (
    <div className="scroll-smooth">
      <ScrollAnimations />
      <ScrollNavbar />
      {/* Header - Minimal like Tilesuite */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
          <nav className="flex items-center justify-between">
            <div className="animate-fade-in">
              <img 
                src="/images/logo/skylism-logo-white.png" 
                alt="Skylism.ai" 
                className="h-6 w-auto"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 animate-slide-in-right">
              <Link href="#features" className="text-white/80 hover:text-white text-sm transition-all duration-300 hover:tracking-wide">Features</Link>
              <Link href="#pricing" className="text-white/80 hover:text-white text-sm transition-all duration-300 hover:tracking-wide">Pricing</Link>
              <Link 
                href="/dashboard" 
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-3 rounded-2xl text-sm font-light hover:bg-white/30 transition-all duration-500 border border-white/20 hover:scale-105 hover:shadow-xl"
              >
                Get Started →
              </Link>
            </div>
            
            {/* Mobile Menu */}
            <MobileMenu />
          </nav>
        </div>
      </header>

      {/* Hero Section - Full Screen with Large Text Overlay */}
      <section className="relative h-screen overflow-hidden rounded-b-3xl">
        <div className="absolute inset-0">
          {/* Hero Background - Sophisticated architectural photo style */}
          <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 animate-slow-zoom rounded-b-3xl">
            {/* Subtle texture overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 rounded-b-3xl"></div>
            {/* Floating particles */}
            <div className="absolute inset-0">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/10 rounded-full animate-float"></div>
              <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-float-delay"></div>
              <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/15 rounded-full animate-float-slow"></div>
              <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-white/15 rounded-full animate-float"></div>
              <div className="absolute top-1/3 left-3/4 w-1.5 h-1.5 bg-white/10 rounded-full animate-float-delay"></div>
            </div>
          </div>
        </div>
        
        {/* Large Typography Overlay */}
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div></div> {/* Spacer for header */}
          
          <div className="px-4 sm:px-6 md:px-8 pb-16 md:pb-20">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-white font-light tracking-tight leading-[0.9] opacity-0 animate-fade-in-up">
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-light animate-slide-in-left">
                  The realism
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-light animate-slide-in-left-delay">
                  your skies
                </div>
                <div className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-light animate-slide-in-left-delay-2">
                  deserve
                </div>
              </h1>
            </div>
          </div>
        </div>
      </section>

      {/* White Section with Image/Text Layout */}
      <section className="bg-white py-16 md:py-24 rounded-3xl mx-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left - Before/After Slider */}
            <div className="order-2 lg:order-1 animate-on-scroll transform hover:scale-105 transition-transform duration-700">
              <BeforeAfterSlider 
                beforeImage="/images/before.jpg"
                afterImage="/images/after.jpg"
                beforeLabel="Original"
                afterLabel="AI Enhanced"
              />
              <div className="mt-6">
                <Link 
                  href="/dashboard"
                  className="inline-flex items-center text-gray-900 font-medium group"
                >
                  <span className="text-sm transition-all duration-300 group-hover:tracking-wider">Try it now</span>
                  <div className="w-8 h-8 ml-3 bg-gray-900 rounded-full flex items-center justify-center group-hover:bg-gray-700 transition-all duration-300 group-hover:rotate-45">
                    <svg className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
            
            {/* Right - Text */}
            <div className="order-1 lg:order-2 animate-on-scroll">
              <div className="max-w-xl">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-900 mb-6 md:mb-8 leading-tight">
                  Fake skies are 
                  <span className="font-bold"> a thing of the past.</span>
                </h2>
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p className="hover:text-gray-800 transition-colors duration-300">
                    While others paste generic sky templates, Skylism uses advanced AI 
                    to create photorealistic skies that match your property's lighting, 
                    shadows, and atmosphere perfectly.
                  </p>
                  <p className="hover:text-gray-800 transition-colors duration-300">
                    Professional real estate photographers trust our technology to deliver 
                    authentic results that pass the scrutiny of discerning clients and 
                    maintain the integrity of their portfolio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Reveal Section */}
      <div className="my-8">
        <ScrollRevealSection />
      </div>

      {/* Process Carousel Section */}
      <section className="bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 py-24 rounded-3xl mx-4 mb-8 mt-8 relative overflow-hidden">
        {/* Floating particles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-float-delay"></div>
          <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-white/15 rounded-full animate-float-slow"></div>
        </div>
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-white font-light tracking-tight leading-[0.95] mb-6">
                <div className="text-4xl md:text-6xl lg:text-7xl mb-4">
                  Simple process,
                </div>
                <div className="text-4xl md:text-6xl lg:text-7xl font-bold">
                  stunning results
                </div>
              </h2>
              <p className="text-white/70 text-lg font-light max-w-2xl mx-auto">
                Watch your images transform from ordinary to extraordinary in seconds
              </p>
            </div>
            
            <ImageCarousel />
          </div>
        </div>
      </section>

      {/* Features Section - Split Layout */}
      <section id="features" className="bg-white py-16 md:py-24 rounded-3xl mx-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
            {/* Left - Text Content */}
            <div className="animate-on-scroll">
              <h3 className="text-sm font-medium text-gray-500 tracking-wider uppercase mb-6">
                OUR CAPABILITIES
              </h3>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-8 md:mb-12 leading-tight">
                Professional enhancement 
                <span className="font-bold">for every photo</span>
              </h2>
              
              <div className="space-y-12">
                <div className="hover:translate-x-2 transition-transform duration-300">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Perfect Listing Weather</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Replace overcast skies with perfect blue days or stunning twilight shots. 
                    Make every property photo look like it was taken on the ideal day.
                  </p>
                </div>
                
                <div className="hover:translate-x-2 transition-transform duration-300">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Remove Distractions</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Automatically remove cars, trash bins, construction equipment, and power lines. 
                    Present properties at their absolute best without expensive staging.
                  </p>
                </div>
                
                <div className="hover:translate-x-2 transition-transform duration-300">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Natural Language Editing</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Simply describe what you want: "Remove the neighbor's blue car and make 
                    the lawn greener" - our AI understands and executes your vision precisely.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right - Process Info */}
            <div className="md:pl-8 lg:pl-16 animate-on-scroll">
              <div className="bg-gray-50 p-6 sm:p-8 md:p-12 h-full flex flex-col justify-center hover:shadow-lg transition-all duration-500 rounded-2xl md:hover:scale-105 hover:bg-gray-100">
                <h3 className="text-sm font-medium text-gray-500 tracking-wider uppercase mb-6">
                  HOW IT WORKS
                </h3>
                <div className="space-y-8">
                  <div className="flex items-start hover:translate-x-2 transition-transform duration-300">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium mr-4 mt-1 hover:scale-110 transition-transform duration-300">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Upload Property Photos</h4>
                      <p className="text-gray-600 text-sm">Drop your listing photos for instant enhancement</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start hover:translate-x-2 transition-transform duration-300">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium mr-4 mt-1 hover:scale-110 transition-transform duration-300">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Choose Enhancement</h4>
                      <p className="text-gray-600 text-sm">Select sky type, remove objects, or enhance curb appeal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start hover:translate-x-2 transition-transform duration-300">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium mr-4 mt-1 hover:scale-110 transition-transform duration-300">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Get 4 Variations</h4>
                      <p className="text-gray-600 text-sm">Review enhanced options and pick the best listing photo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start hover:translate-x-2 transition-transform duration-300">
                    <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium mr-4 mt-1 hover:scale-110 transition-transform duration-300">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Download & Deliver</h4>
                      <p className="text-gray-600 text-sm">High-resolution photos ready for client delivery</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - Minimalist */}
      <section id="pricing" className="bg-gray-50 py-16 md:py-24 rounded-3xl mx-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <h3 className="text-sm font-medium text-gray-500 tracking-wider uppercase mb-6">
            PRICING
          </h3>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-light text-gray-900 mb-12 md:mb-16">
            Simple, transparent <span className="font-bold">pricing</span>
          </h2>
          
          <div className="max-w-md mx-auto">
            <div className="bg-white p-8 sm:p-10 md:p-12 border border-gray-200 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 animate-scale-in md:hover:scale-105">
              <div className="text-6xl font-light text-gray-900 mb-4">$0.49</div>
              <div className="text-gray-500 text-sm tracking-wider uppercase mb-12">per credit</div>
              
              <div className="space-y-4 text-left text-gray-700 mb-12">
                <div className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-4"></div>
                  1 credit = 1 image enhancement
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-4"></div>
                  4 AI variations included
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-4"></div>
                  Professional upscaling
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-4"></div>
                  Instant download
                </div>
              </div>
              
              <Link 
                href="/dashboard"
                className="block w-full bg-gray-900 text-white py-4 text-sm font-medium tracking-wider uppercase hover:bg-gray-800 transition-all duration-300 rounded-xl"
              >
                Start with 3 Free Credits
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="bg-gray-900 py-12 md:py-16 rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-center">
          <div className="mb-4">
            <img 
              src="/images/logo/skylism-logo-white.png" 
              alt="Skylism.ai" 
              className="h-5 w-auto mx-auto"
            />
          </div>
          <p className="text-gray-400 text-sm">The realism your skies deserve.</p>
        </div>
      </footer>
    </div>
  )
}
