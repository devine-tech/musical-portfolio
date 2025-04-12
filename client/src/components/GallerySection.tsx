import { useEffect, useRef } from "react";
import { Image } from "lucide-react";

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    // Animation on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    
    const elements = sectionRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));
    
    return () => {
      elements?.forEach((el) => observer.unobserve(el));
    };
  }, []);
  
  // Gallery images
  const galleryImages = [
    {
      id: 1,
      src: "/images/gallery-1.svg",
      alt: "Live performance at a concert",
      title: "Live Performance",
    },
    {
      id: 2,
      src: "/images/gallery-2.svg",
      alt: "In the recording studio",
      title: "Studio Session",
    },
    {
      id: 3,
      src: "/images/gallery-3.svg",
      alt: "Performing at a summer festival",
      title: "Summer Festival",
    },
    {
      id: 4,
      src: "/images/gallery-4.svg",
      alt: "Nightclub performance",
      title: "Nightclub Show",
    },
  ];
  
  return (
    <section id="gallery" ref={sectionRef} className="gallery-section section">
      <div className="container mx-auto px-4">
        <h2 className="section-heading text-[#3C3B6E] animate-on-scroll">Photo Gallery</h2>
        
        <p className="text-center text-lg mb-8 max-w-3xl mx-auto animate-on-scroll">
          Check out some highlights from my performances and recording sessions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {galleryImages.map((image) => (
            <div key={image.id} className="gallery-item animate-on-scroll">
              <div className="relative overflow-hidden rounded-lg shadow-lg">
                <img 
                  src={image.src} 
                  alt={image.alt} 
                  className="w-full h-auto object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <h3 className="text-xl font-semibold">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 animate-on-scroll">
          <button className="cta-button inline-flex items-center gap-2 bg-[#3C3B6E] text-white">
            <Image size={20} />
            <span>View All Photos</span>
          </button>
        </div>
      </div>
    </section>
  );
}