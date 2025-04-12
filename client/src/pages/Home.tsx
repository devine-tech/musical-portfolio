import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import VideosSection from "@/components/VideosSection";
import GallerySection from "@/components/GallerySection";
import ContactSection from "@/components/ContactSection";
import { ContentItem } from "@shared/schema";
import { loadFacebookSDK } from "@/lib/fbSdk";

export default function Home() {
  const { data: bioContent, isLoading: bioLoading } = useQuery<ContentItem[]>({
    queryKey: ['/api/content/bio'],
  });

  const { data: videoContent, isLoading: videosLoading } = useQuery<ContentItem[]>({
    queryKey: ['/api/content/video'],
  });

  const { data: socialContent, isLoading: socialsLoading } = useQuery<ContentItem[]>({
    queryKey: ['/api/content/social'],
  });

  useEffect(() => {
    // Load Facebook SDK when the component mounts
    loadFacebookSDK();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main>
        <HeroSection />
        
        <AboutSection 
          isLoading={bioLoading} 
          bio={bioContent?.[0]?.content || ""} 
        />
        
        <VideosSection 
          isLoading={videosLoading} 
          videos={videoContent || []} 
        />
        
        <GallerySection />
        
        <ContactSection 
          isLoading={socialsLoading} 
          socialLinks={socialContent || []} 
        />
      </main>
      
      {/* Footer with simple copyright */}
      <footer className="bg-background py-6 text-center text-sm text-muted-foreground">
        <div className="container mx-auto">
          <p>© {new Date().getFullYear()} Mike Johnson. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
