
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getPresentationById, updateSlide } from "@/services/presentationService";

export const usePresentation = (presentationId: string | undefined) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [presentation, setPresentation] = useState<any | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadPresentation = async () => {
      if (presentationId) {
        setIsLoading(true);
        try {
          const loadedPresentation = getPresentationById(presentationId);
          
          if (loadedPresentation) {
            console.log("Loaded presentation:", loadedPresentation);
            setPresentation(loadedPresentation);
          } else {
            toast({
              title: "Presentation not found",
              description: "The requested presentation could not be found",
              variant: "destructive",
            });
            navigate("/");
          }
        } catch (error) {
          console.error("Error loading presentation:", error);
          toast({
            title: "Error loading presentation",
            description: "There was a problem loading your presentation",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadPresentation();
  }, [presentationId, navigate, toast]);
  
  const handleUpdateSlide = (slideId: number, content: string) => {
    if (!presentationId) return;
    
    updateSlide(presentationId, slideId, content);
    
    if (presentation) {
      const updatedSlides = [...presentation.slides];
      const slideIndex = updatedSlides.findIndex((s) => s.id === slideId);
      
      if (slideIndex !== -1) {
        updatedSlides[slideIndex] = {
          ...updatedSlides[slideIndex],
          content,
        };
        
        setPresentation({
          ...presentation,
          slides: updatedSlides,
        });
        
        toast({
          title: "Slide updated",
          description: "Your changes have been saved",
        });
      }
    }
  };
  
  return {
    presentation,
    isLoading,
    currentSlideIndex,
    setCurrentSlideIndex,
    currentSlide: presentation?.slides[currentSlideIndex - 1] || null,
    handleUpdateSlide
  };
};
