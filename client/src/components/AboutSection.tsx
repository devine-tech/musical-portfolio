import { useEffect, useRef } from "react";
import { Mic2, Music, Award, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AboutSectionProps {
  isLoading: boolean;
  bio: string;
}

export default function AboutSection({ isLoading, bio }: AboutSectionProps) {
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
  
  return (
    <section id="about" ref={sectionRef} className="about-section section">
      <div className="container mx-auto px-4">
        <h2 className="section-heading text-[#3C3B6E] animate-on-scroll">About Me</h2>
        
        <div className="about-content animate-on-scroll">
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-4" />
            </>
          ) : (
            <p className="text-lg leading-relaxed mb-8">{bio}</p>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
            <div className="p-6 bg-white rounded-lg shadow-md border border-[#3C3B6E]/10 transform transition-transform hover:-translate-y-1 animate-on-scroll">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#3C3B6E] text-white rounded-full mb-4">
                <Mic2 size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#3C3B6E]">Vocal Style</h3>
              <p>Versatile range that brings emotion to every performance, specializing in rock, country, and blues.</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-md border border-[#3C3B6E]/10 transform transition-transform hover:-translate-y-1 animate-on-scroll">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#B22234] text-white rounded-full mb-4">
                <Music size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#B22234]">Influences</h3>
              <p>Inspired by classic American rock, soul, and country legends while forging a unique contemporary sound.</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-md border border-[#3C3B6E]/10 transform transition-transform hover:-translate-y-1 animate-on-scroll">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#3C3B6E] text-white rounded-full mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#3C3B6E]">Achievements</h3>
              <p>Performed at major venues across the country and collaborated with renowned artists and producers.</p>
            </div>
            
            <div className="p-6 bg-white rounded-lg shadow-md border border-[#3C3B6E]/10 transform transition-transform hover:-translate-y-1 animate-on-scroll">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#B22234] text-white rounded-full mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#B22234]">Experience</h3>
              <p>Over a decade of professional vocal experience in studio recording and live performances.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
