
import mammoth from "mammoth";

// Interface for a slide
export interface Slide {
  id: number;
  title: string;
  content: string;
}

// Interface for a presentation
export interface Presentation {
  id: string;
  name: string;
  slides: Slide[];
}

// Mock function to extract text from a PowerPoint file
// In a real implementation, you would use a library to extract text from PPTX
export const extractTextFromPowerPoint = async (file: File): Promise<Presentation> => {
  // This is a mock implementation
  // In a real app, you would use a library like pptx-parser or a server-side solution
  
  return new Promise((resolve) => {
    // Create a unique ID for the presentation
    const presentationId = Date.now().toString();
    const presentationName = file.name.replace(/\.[^/.]+$/, "");
    
    // Simulate processing time
    setTimeout(() => {
      // Generate mock slides
      const slides: Slide[] = Array.from({ length: 6 }, (_, i) => ({
        id: i + 1,
        title: `Slide ${i + 1}`,
        content: i === 0 
          ? `Title: ${presentationName}\nDescription: This is the title slide of your presentation.`
          : `This is slide ${i + 1} content. In a real implementation, this would contain the actual text from your PowerPoint slide.`
      }));
      
      resolve({
        id: presentationId,
        name: presentationName,
        slides,
      });
    }, 1500);
  });
};

// Save a presentation to local storage
export const savePresentation = (presentation: Presentation): void => {
  const presentations = getSavedPresentations();
  presentations.push(presentation);
  localStorage.setItem("presentations", JSON.stringify(presentations));
};

// Get all saved presentations from local storage
export const getSavedPresentations = (): Presentation[] => {
  const presentations = localStorage.getItem("presentations");
  return presentations ? JSON.parse(presentations) : [];
};

// Get a specific presentation by ID
export const getPresentationById = (id: string): Presentation | undefined => {
  const presentations = getSavedPresentations();
  return presentations.find((p) => p.id === id);
};

// Update a slide in a presentation
export const updateSlide = (
  presentationId: string,
  slideId: number,
  content: string
): void => {
  const presentations = getSavedPresentations();
  const presentationIndex = presentations.findIndex((p) => p.id === presentationId);
  
  if (presentationIndex !== -1) {
    const presentation = presentations[presentationIndex];
    const slideIndex = presentation.slides.findIndex((s) => s.id === slideId);
    
    if (slideIndex !== -1) {
      presentation.slides[slideIndex].content = content;
      presentations[presentationIndex] = presentation;
      localStorage.setItem("presentations", JSON.stringify(presentations));
    }
  }
};
