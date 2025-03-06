
import React from "react";
import { cn } from "@/lib/utils";

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
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="glass-card rounded-lg overflow-hidden flex flex-col h-full">
        <div className="p-6 flex-1 flex flex-col items-center justify-center">
          {slideContent ? (
            <>
              <h2 className="text-xl font-semibold mb-4 text-center">{slideName}</h2>
              <div className="text-center text-muted-foreground">
                {slideContent}
              </div>
            </>
          ) : (
            <div className="text-center text-muted-foreground flex flex-col items-center">
              <h2 className="text-xl purple-gradient-text mb-2">{slideName}</h2>
              <p className="text-muted-foreground">PowerPoint Slide Preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SlidePreview;
