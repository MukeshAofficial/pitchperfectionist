
import React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

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
  // Function to parse and format slide content
  const renderSlideContent = (content: string) => {
    if (!content) return null;
    
    // Split by newlines to separate different parts of content
    const contentParts = content.split('\n').filter(part => part.trim() !== '');
    
    return (
      <div className="space-y-3">
        {contentParts.map((part, index) => {
          // Check if it's a heading (contains "Title:" or similar patterns)
          if (part.match(/^(Title|Heading|Header):/i)) {
            const [_, text] = part.split(':');
            return <h3 key={index} className="text-xl font-bold purple-gradient-text">{text.trim()}</h3>;
          }
          
          // Check if it's a bullet point
          if (part.startsWith('•') || part.startsWith('-') || part.startsWith('*')) {
            return <li key={index} className="ml-5">{part.substring(1).trim()}</li>;
          }
          
          // Regular paragraph
          return <p key={index} className="text-sm">{part}</p>;
        })}
      </div>
    );
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="glass-card rounded-lg overflow-hidden flex flex-col h-full">
        <div className="p-4 border-b border-white/10">
          <h2 className="text-xl font-semibold purple-gradient-text">{slideName}</h2>
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
