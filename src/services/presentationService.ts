
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

// Function to extract text from a PowerPoint file
export const extractTextFromPowerPoint = async (file: File): Promise<Presentation> => {
  // Create a unique ID for the presentation
  const presentationId = Date.now().toString();
  const presentationName = file.name.replace(/\.[^/.]+$/, "");
  
  // Check if it's a Word document (.docx) - we can extract text using mammoth
  if (file.name.endsWith('.docx')) {
    try {
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const result = await mammoth.extractRawText({ arrayBuffer });
            const text = result.value;
            
            // Split the text into "slides" (paragraphs or sections)
            const paragraphs = text.split('\n\n').filter(p => p.trim() !== '');
            
            const slides: Slide[] = paragraphs.map((content, i) => ({
              id: i + 1,
              title: `Slide ${i + 1}`,
              content
            }));
            
            resolve({
              id: presentationId,
              name: presentationName,
              slides,
            });
          } catch (error) {
            console.error("Error parsing DOCX file:", error);
            reject(new Error("Failed to parse DOCX file"));
          }
        };
        
        reader.onerror = () => {
          reject(new Error("Error reading file"));
        };
        
        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error("Error processing DOCX:", error);
      throw new Error("Failed to process document");
    }
  }
  
  // For PowerPoint files, we currently use a mock implementation
  // In a real implementation, you would need a server-side solution or a more specialized library
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      console.log("Processing PowerPoint file:", file.name);
      
      // Generate more realistic mock slides
      const slides: Slide[] = [
        {
          id: 1,
          title: "Title Slide",
          content: `Title: ${presentationName}\nDescription: Introduction to our presentation`
        },
        {
          id: 2,
          title: "Agenda",
          content: "Title: Today's Agenda\n• Key points to discuss\n• Timeline\n• Expected outcomes\n• Q&A session"
        },
        {
          id: 3,
          title: "Introduction",
          content: "Title: Introduction\nThis presentation covers the main aspects of our project including:\n• Background information\n• Current challenges\n• Proposed solutions"
        },
        {
          id: 4,
          title: "Key Features",
          content: "Title: Key Features\n• Feature 1: Enhanced user experience\n• Feature 2: Improved performance\n• Feature 3: Better integration\n• Feature 4: Advanced analytics"
        },
        {
          id: 5,
          title: "Timeline",
          content: "Title: Project Timeline\n• Phase 1: Research & Planning (2 weeks)\n• Phase 2: Development (4 weeks)\n• Phase 3: Testing (2 weeks)\n• Phase 4: Deployment (1 week)"
        },
        {
          id: 6,
          title: "Conclusion",
          content: "Title: Conclusion\n• Summarized key points\n• Next steps\n• Contact information\n• Thank you"
        }
      ];
      
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
