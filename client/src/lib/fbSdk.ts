// Facebook SDK loading function

export function loadFacebookSDK() {
  // Don't load again if already present
  if (document.getElementById('facebook-jssdk')) {
    return;
  }
  
  // Create a custom event for when FB SDK is ready
  const fbReadyEvent = new Event('fb-sdk-ready');
  
  // Add the Facebook SDK script
  const script = document.createElement('script');
  script.id = 'facebook-jssdk';
  script.async = true;
  script.defer = true;
  script.crossOrigin = 'anonymous';
  script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v17.0';
  
  // Initialize Facebook SDK once loaded
  window.fbAsyncInit = function() {
    window.FB.init({
      xfbml: true,
      version: 'v17.0'
    });
    
    // Dispatch custom event when FB SDK is ready
    document.dispatchEvent(fbReadyEvent);
  };
  
  // Insert the script element
  const firstScriptElement = document.getElementsByTagName('script')[0];
  if (firstScriptElement && firstScriptElement.parentNode) {
    firstScriptElement.parentNode.insertBefore(script, firstScriptElement);
  } else {
    document.head.appendChild(script);
  }
  
  return () => {
    // Cleanup function (not really needed for FB SDK)
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  };
}

// Add type for fbAsyncInit
declare global {
  interface Window {
    fbAsyncInit: () => void;
  }
}
