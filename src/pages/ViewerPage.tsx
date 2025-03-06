
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Download, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import SlidePreview from "@/components/SlidePreview";
import { getPresentationById } from "@/services/presentationService";
import { formatSlideContent } from "@/utils/pptParser";

const ViewerPage: React.FC = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for the presentation and current slide
  const [presentation, setPresentation] = useState<any | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Get the current slide content
  const currentSlide = presentation?.slides[currentSlideIndex] || null;
  
  // Load the presentation
  useEffect(() => {
    if (presentationId) {
      const loadedPresentation = getPresentationById(presentationId);
      
      if (loadedPresentation) {
        setPresentation(loadedPresentation);
      } else {
        toast({
          title: "Presentation not found",
          description: "The requested presentation could not be found",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [presentationId, navigate, toast]);
  
  // Handle navigation
  const goToPreviousSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };
  
  const goToNextSlide = () => {
    if (presentation && currentSlideIndex < presentation.slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        goToPreviousSlide();
      } else if (event.key === "ArrowRight") {
        goToNextSlide();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentSlideIndex, presentation]);
  
  // Handle edit button click
  const handleEditClick = () => {
    navigate(`/editor/${presentationId}`);
  };
  
  if (!presentation) {
    return (
      <div className="min-h-screen bg-pitch-dark flex flex-col">
        <Header title="Loading Presentation..." showBack={true} showSettings={false} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-pitch-purple border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading your presentation...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-pitch-dark flex flex-col">
      <Header 
        title={`${presentation.name} - Slide ${currentSlideIndex + 1}/${presentation.slides.length}`} 
        onBackClick={() => navigate('/')} 
        showBack={true}
        showSettings={false}
      />
      
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-4xl mx-auto">
          <SlidePreview 
            slideContent={currentSlide?.content || ""} 
            slideName={currentSlide?.title || "No Slide Selected"}
            className="h-[calc(100vh-200px)]"
          />
        </div>
        
        <div className="flex items-center justify-between w-full max-w-4xl mt-4">
          <Button 
            variant="outline" 
            onClick={goToPreviousSlide}
            disabled={currentSlideIndex === 0}
            className="bg-pitch-dark-lighter border-white/10"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex space-x-3">
            <Button 
              variant="secondary"
              onClick={handleEditClick}
              className="bg-pitch-purple/20 hover:bg-pitch-purple/30 text-white"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Presentation
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={goToNextSlide}
            disabled={!presentation || currentSlideIndex === presentation.slides.length - 1}
            className="bg-pitch-dark-lighter border-white/10"
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewerPage;
