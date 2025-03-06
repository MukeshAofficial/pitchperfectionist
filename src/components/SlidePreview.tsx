import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SlidePreviewProps {
  slideContent: string;
  slideName: string;
  className?: string;
}

const SlidePreview: React.FC<SlidePreviewProps> = ({ 
  slideContent, 
  slideName,
  className
}) => {
  const [fullscreen, setFullscreen] = useState(false);
  
  // Function to parse and format slide content
  const renderSlideContent = (content: string) => {
    if (!content) return null;
    
    // Split by newlines to separate different parts of content
    const contentParts = content.split('\n').filter(part => part.trim() !== '');
    
    // Keep track of list context
    let inList = false;
    
    return (
      <div className="space-y-3">
        {contentParts.map((part, index) => {
          // Check if it's a heading (contains "Title:" or similar patterns)
          if (part.match(/^(Title|Heading|Header):/i)) {
            const [_, text] = part.split(':');
            return <h3 key={index} className={cn("font-bold purple-gradient-text", fullscreen ? "text-3xl my-4" : "text-xl")}>{text.trim()}</h3>;
          }
          
          // Check if it's a bullet point
          if (part.startsWith('•') || part.startsWith('-') || part.startsWith('*')) {
            // If this is the first bullet point, start a list
            if (!inList) {
              inList = true;
              return (
                <ul key={index} className="list-disc pl-5 space-y-2">
                  <li className={cn(fullscreen ? "text-lg" : "text-sm")}>{part.substring(1).trim()}</li>
                </ul>
              );
            }
            // If we're already in a list, just add the item
            return (
              <ul key={index} className="list-disc pl-5 space-y-2">
                <li className={cn(fullscreen ? "text-lg" : "text-sm")}>{part.substring(1).trim()}</li>
              </ul>
            );
          }
          
          // If this is not a bullet point but we were in a list, end the list
          inList = false;
          
          // Regular paragraph
          return <p key={index} className={cn(fullscreen ? "text-lg" : "text-sm")}>{part}</p>;
        })}
      </div>
    );
  };

  // Handle fullscreen toggle with ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && fullscreen) {
        setFullscreen(false);
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fullscreen]);

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-pitch-dark flex flex-col p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold purple-gradient-text">{slideName}</h2>
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            <Minimize2 className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 overflow-y-auto rounded-lg glass-card p-8">
          {slideContent ? (
            <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
              {renderSlideContent(slideContent)}
            </div>
          ) : (
            <div className="text-center text-muted-foreground flex flex-col items-center justify-center h-full">
              <p className="text-muted-foreground text-xl">No content available for this slide</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="glass-card rounded-lg overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-xl font-semibold purple-gradient-text">{slideName}</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen}
            className="h-8 w-8"
          >
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          {slideContent ? (
            <div className="flex flex-col space-y-4">
              {renderSlideContent(slideContent)}
            </div>
          ) : (
            <div className="text-center text-muted-foreground flex flex-col items-center">
              <p className="text-muted-foreground">No content available for this slide</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlidePreview;
