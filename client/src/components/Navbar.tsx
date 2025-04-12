import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, Music, User, Mail, Image } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle scroll to add shadow on navbar when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Close mobile menu when clicking a link
  const handleNavLinkClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    
    // Smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };
  
  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              <span className="font-semibold">Mike</span> <span className="font-bold">Johnson</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a 
              href="#about" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('about');
              }}
            >
              About
            </a>
            <a 
              href="#videos" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('videos');
              }}
            >
              Videos
            </a>
            <a 
              href="#gallery" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('gallery');
              }}
            >
              Gallery
            </a>
            <a 
              href="#contact" 
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick('contact');
              }}
            >
              Contact
            </a>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-800 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white absolute top-16 left-0 right-0 z-50 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#about"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-gray-50 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick('about');
                }}
              >
                <User size={18} />
                <span>About</span>
              </a>
              <a
                href="#videos"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-gray-50 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick('videos');
                }}
              >
                <Music size={18} />
                <span>Videos</span>
              </a>
              <a
                href="#gallery"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-gray-50 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick('gallery');
                }}
              >
                <Image size={18} />
                <span>Gallery</span>
              </a>
              <a
                href="#contact"
                className="flex items-center gap-3 px-4 py-3 text-base font-medium hover:bg-gray-50 rounded-md"
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick('contact');
                }}
              >
                <Mail size={18} />
                <span>Contact</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
