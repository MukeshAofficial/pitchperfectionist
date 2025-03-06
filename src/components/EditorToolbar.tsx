
import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import SlideNavigation from "@/components/SlideNavigation";

interface EditorToolbarProps {
  presentationId: string | undefined;
  currentSlide: number;
  totalSlides: number;
  onSelectSlide: (slideNumber: number) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  presentationId,
  currentSlide,
  totalSlides,
  onSelectSlide
}) => {
  const navigate = useNavigate();
  
  const handleViewModeClick = () => {
    if (presentationId) {
      navigate(`/viewer/${presentationId}`);
    }
  };
  
  return (
    <div className="p-4 flex justify-between items-center">
      <SlideNavigation
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        onSelectSlide={onSelectSlide}
      />
      
      <Button
        variant="outline"
        onClick={handleViewModeClick}
        className="bg-pitch-dark-lighter border-white/10"
      >
        <Eye className="mr-2 h-4 w-4" />
        Presentation Mode
      </Button>
    </div>
  );
};

export default EditorToolbar;
