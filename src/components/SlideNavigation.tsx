
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SlideNavigationProps {
  currentSlide: number;
  totalSlides: number;
  onSelectSlide: (slideNumber: number) => void;
}

const SlideNavigation: React.FC<SlideNavigationProps> = ({
  currentSlide,
  totalSlides,
  onSelectSlide,
}) => {
  const goToPrevious = () => {
    if (currentSlide > 1) {
      onSelectSlide(currentSlide - 1);
    }
  };

  const goToNext = () => {
    if (currentSlide < totalSlides) {
      onSelectSlide(currentSlide + 1);
    }
  };

  return (
    <div className="flex items-center gap-1 mb-4 overflow-x-auto scrollbar-none pb-2">
      <Button
        variant="outline"
        size="icon"
        onClick={goToPrevious}
        disabled={currentSlide === 1}
        className="bg-pitch-dark-lighter border-white/10"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex gap-1 overflow-x-auto scrollbar-none">
        {Array.from({ length: totalSlides }, (_, index) => (
          <Button
            key={index}
            variant="outline"
            className={cn(
              "min-w-[80px]",
              currentSlide === index + 1
                ? "bg-pitch-purple text-white border-pitch-purple"
                : "bg-pitch-dark-lighter border-white/10 hover:border-pitch-purple/50"
            )}
            onClick={() => onSelectSlide(index + 1)}
          >
            Slide {index + 1}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={goToNext}
        disabled={currentSlide === totalSlides}
        className="bg-pitch-dark-lighter border-white/10"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default SlideNavigation;
