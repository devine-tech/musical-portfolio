import { useEffect, useRef } from "react";
import { ContentItem } from "@shared/schema";
import FacebookVideo from "@/components/ui/FacebookVideo";
import { Skeleton } from "@/components/ui/skeleton";

interface VideosSectionProps {
  isLoading: boolean;
  videos: ContentItem[];
}

export default function VideosSection({ isLoading, videos }: VideosSectionProps) {
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
  
  // Function to extract Facebook video ID from URL
  const extractVideoId = (url: string): string => {
    // Handle different Facebook video URL formats
    const regex = /facebook\.com\/(?:.*?)\/videos\/(?:.*?\/)?(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : "";
  };
  
  return (
    <section id="videos" ref={sectionRef} className="videos-section section">
      <div className="container mx-auto px-4">
        <h2 className="section-heading text-[#3C3B6E] animate-on-scroll">Watch Me Live</h2>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Skeleton className="w-full aspect-video rounded-lg" />
            <Skeleton className="w-full aspect-video rounded-lg" />
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videos.map((video) => (
              <div key={video.id} className="animate-on-scroll">
                <div className="video-container">
                  <FacebookVideo 
                    videoId={extractVideoId(video.content)} 
                    title={video.title} 
                  />
                </div>
                <h3 className="text-xl font-semibold mt-4 mb-2">{video.title}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No videos available at the moment.</p>
        )}
        
        <div className="text-center mt-12 animate-on-scroll">
          <p className="text-lg mb-4">Want to see more performances?</p>
          <a 
            href="https://www.facebook.com/vocalist" 
            target="_blank" 
            rel="noopener noreferrer"
            className="cta-button inline-flex items-center gap-2"
          >
            View All Videos
          </a>
        </div>
      </div>
    </section>
  );
}
