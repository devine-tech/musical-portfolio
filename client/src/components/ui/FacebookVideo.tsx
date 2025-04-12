import { useEffect, useRef } from "react";

interface FacebookVideoProps {
  videoId: string;
  title: string;
}

export default function FacebookVideo({ videoId, title }: FacebookVideoProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // This effect will run when the FB SDK is loaded and available
    if (!videoId || !window.FB) return;
    
    const renderVideo = () => {
      if (containerRef.current) {
        // Clear the container before rendering
        containerRef.current.innerHTML = "";
        
        // Use FB.XFBML.parse to render the embedded post
        window.FB.XFBML.parse(containerRef.current);
      }
    };
    
    // Check if FB is already loaded
    if (window.FB) {
      renderVideo();
    } else {
      // If not loaded yet, set up event listener for when it loads
      const fbReadyListener = () => {
        renderVideo();
      };
      
      document.addEventListener('fb-sdk-ready', fbReadyListener);
      return () => {
        document.removeEventListener('fb-sdk-ready', fbReadyListener);
      };
    }
  }, [videoId]);
  
  return (
    <div ref={containerRef} className="fb-video-container w-full">
      <div 
        className="fb-video" 
        data-href={`https://www.facebook.com/facebook/videos/${videoId}/`}
        data-width="500" 
        data-show-text="false"
        data-allowfullscreen="true"
      >
        <div className="fb-xfbml-parse-ignore">
          <p>Loading video: {title}</p>
        </div>
      </div>
    </div>
  );
}

// Add type definition for FB SDK
declare global {
  interface Window {
    FB: {
      init: (params: any) => void;
      XFBML: {
        parse: (dom?: Element) => void;
      };
    };
  }
}
