import { useEffect, useState } from "react";
import { MusicIcon, ImageIcon } from "lucide-react";

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set a timeout to trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <section id="home" className="hero-section">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 items-center">
          {/* Text content */}
          <div className="hero-content order-2 md:order-1">
            <h1 className={`hero-name ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              <span className="main-name">Mike Johnson</span>
            </h1>
            
            <h2 className={`hero-profession ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
              Vocalist & Performer
            </h2>
            
            <p className={`hero-tagline ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.3s' }}>
              Captivating performances blending soulful vocals with contemporary sounds
            </p>
            
            <div className={`hero-cta-container ${isLoaded ? 'opacity-100' : 'opacity-0'}`} style={{ transitionDelay: '0.6s' }}>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#videos" className="cta-button flex items-center justify-center gap-2" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('videos')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <MusicIcon size={20} />
                  <span>Watch Performances</span>
                </a>
                
                <a href="#gallery" className="cta-button-alt flex items-center justify-center gap-2" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  <ImageIcon size={20} />
                  <span>View Gallery</span>
                </a>
              </div>
            </div>
          </div>
          
          {/* Singer Image */}
          <div className={`hero-image-container md:order-2 mb-8 md:mb-0 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <img 
              src="/images/The-Weeknd.jpg" 
              alt="Mike Johnson - Vocalist" 
              className="hero-image"
            />
          </div>
        </div>
      </div>
      
      {/* Subtle gradient accent at the bottom */}
      <div className="hero-accent"></div>
    </section>
  );
}
