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

// Import our API service
import { uploadPowerPoint } from "./api";

// Extract text from a PowerPoint file using the FastAPI backend
export const extractTextFromPowerPoint = async (file: File): Promise<Presentation> => {
  try {
    // Use the API to upload and process the PowerPoint file
    const result = await uploadPowerPoint(file);
    
    // Create a unique ID for the presentation
    const presentationId = Date.now().toString();
    const presentationName = file.name.replace(/\.[^/.]+$/, "");
    
    // Map the slides from the API response
    const slides: Slide[] = result.slides.map((content: string, index: number) => ({
      id: index + 1,
      title: `Slide ${index + 1}`,
      content: content || `No text on slide ${index + 1}`
    }));
    
    const presentation = {
      id: presentationId,
      name: presentationName,
      slides,
    };
    
    // Save the presentation
    savePresentation(presentation);
    
    return presentation;
  } catch (error) {
    console.error("Error extracting text from PowerPoint:", error);
    // Fallback to mock data if the API fails
    return fallbackMockData(file);
  }
};

// Fallback to mock data if the API fails
const fallbackMockData = (file: File): Presentation => {
  // Create a unique ID for the presentation
  const presentationId = Date.now().toString();
  const presentationName = file.name.replace(/\.[^/.]+$/, "");
  
  // Generate mock slides
  const slides: Slide[] = Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    title: `Slide ${i + 1}`,
    content: i === 0 
      ? `Title: ${presentationName}\nDescription: This is the title slide of your presentation.`
      : `This is slide ${i + 1} content. In a real implementation, this would contain the actual text from your PowerPoint slide.`
  }));
  
  return {
    id: presentationId,
    name: presentationName,
    slides,
  };
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
