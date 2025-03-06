
import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, FileDown, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import SlideNavigation from "@/components/SlideNavigation";
import { useToast } from "@/hooks/use-toast";

interface EditorToolbarProps {
  presentationId: string | undefined;
  currentSlide: number;
  totalSlides: number;
  onSelectSlide: (slideNumber: number) => void;
  presentationName?: string;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  presentationId,
  currentSlide,
  totalSlides,
  onSelectSlide,
  presentationName = "Presentation"
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleViewModeClick = () => {
    if (presentationId) {
      navigate(`/viewer/${presentationId}`);
    }
  };
  
  const handleExportPresentation = () => {
    // In a full implementation, this would export to PowerPoint
    // For now, we'll just show a toast
    toast({
      title: "Export feature coming soon",
      description: "The ability to export to PowerPoint will be available in a future update.",
    });
  };
  
  return (
    <div className="p-4 border-b border-white/10 bg-pitch-dark-lighter">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center flex-1">
          <SlideNavigation
            currentSlide={currentSlide}
            totalSlides={totalSlides}
            onSelectSlide={onSelectSlide}
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportPresentation}
            className="bg-pitch-dark-lighter border-white/10"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
          
          <Button
            variant="outline"
            onClick={handleViewModeClick}
            className="bg-pitch-dark-lighter border-white/10"
          >
            <Eye className="mr-2 h-4 w-4" />
            Presentation Mode
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditorToolbar;
