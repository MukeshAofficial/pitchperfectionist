
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

// Function to extract text from a PowerPoint or Word file
export const extractTextFromPowerPoint = async (file: File): Promise<Presentation> => {
  // Create a unique ID for the presentation
  const presentationId = Date.now().toString();
  const presentationName = file.name.replace(/\.[^/.]+$/, "");
  
  // Check if it's a Word document (.docx) - we can extract text using mammoth
  if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
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
            
            // Log the extracted content for debugging
            console.log("Extracted content from DOCX:", slides);
            
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
  
  // For PowerPoint files (.ppt, .pptx)
  // Since direct browser parsing of PPT is limited, we'll attempt to extract text
  if (file.name.endsWith('.pptx') || file.name.endsWith('.ppt')) {
    try {
      const reader = new FileReader();
      
      return new Promise((resolve, reject) => {
        reader.onload = async (e) => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            // Try to extract text from PowerPoint
            const text = await extractTextFromPPTArrayBuffer(arrayBuffer);
            
            // Process extracted text into slides
            const slideTexts = processExtractedPPTText(text);
            const slides: Slide[] = slideTexts.map((content, i) => ({
              id: i + 1,
              title: `Slide ${i + 1}`,
              content: content
            }));
            
            // Log the extracted content for debugging
            console.log("Extracted content from PPT:", slides);
            
            resolve({
              id: presentationId,
              name: presentationName,
              slides,
            });
          } catch (error) {
            console.error("Error parsing PPT file:", error);
            
            // Fallback to a single slide with error message
            const slides: Slide[] = [
              {
                id: 1,
                title: "PowerPoint Content",
                content: "Title: Unable to fully parse PowerPoint content\n\nDirect PowerPoint parsing in browsers is limited. For better results, try:\n• Converting your PPT to DOCX first\n• Uploading a simpler presentation\n• Using the AI enhancement features on this placeholder"
              }
            ];
            
            resolve({
              id: presentationId,
              name: presentationName,
              slides,
            });
          }
        };
        
        reader.onerror = () => {
          reject(new Error("Error reading file"));
        };
        
        reader.readAsArrayBuffer(file);
      });
    } catch (error) {
      console.error("Error processing PowerPoint:", error);
      throw new Error("Failed to process presentation");
    }
  }
  
  throw new Error("Unsupported file format");
};

// Helper function to attempt extracting text from PPT array buffer
const extractTextFromPPTArrayBuffer = async (buffer: ArrayBuffer): Promise<string> => {
  // This is a basic approach using text extraction
  // In a production app, you'd use a server-side solution or a specialized library
  
  // Convert ArrayBuffer to string
  const textDecoder = new TextDecoder('utf-8');
  let text = textDecoder.decode(buffer);
  
  // Extract text content (basic approach)
  // Extract anything that looks like text from the binary content
  let extractedText = '';
  
  // Look for text patterns in the binary data
  const matches = text.match(/[\x20-\x7E\s]{5,}/g); // Match readable ASCII text sequences
  if (matches) {
    extractedText = matches.join('\n\n');
  }
  
  return extractedText;
};

// Process the extracted PPT text into slide content
const processExtractedPPTText = (extractedText: string): string[] => {
  // Split into potential slides - look for slide markers or large text blocks
  const slideTexts: string[] = [];
  
  // Try to identify slide breaks
  let slides = extractedText.split(/Slide\s+\d+|SLIDE\s+\d+|\[Slide\s+\d+\]/);
  
  // If no slides were identified, split by large gaps
  if (slides.length <= 1) {
    slides = extractedText.split(/\n{3,}/);
  }
  
  // Clean up each slide
  slides.forEach((slide, index) => {
    const trimmed = slide.trim();
    if (trimmed.length > 0) {
      // Add a title if we can identify one
      let slideContent = "";
      
      const lines = trimmed.split('\n');
      if (lines.length > 0) {
        // Use first line as title if it's short enough
        if (lines[0].length < 100) {
          slideContent = `Title: ${lines[0]}\n\n`;
          lines.shift(); // Remove the title from content
        } else {
          slideContent = `Title: Slide ${index + 1}\n\n`;
        }
        
        // Format the rest of the content
        const content = lines.join('\n');
        slideContent += formatExtractedContent(content);
      }
      
      slideTexts.push(slideContent);
    }
  });
  
  // If no slides were properly extracted, create a single slide with all content
  if (slideTexts.length === 0 && extractedText.trim().length > 0) {
    slideTexts.push(`Title: Extracted Content\n\n${formatExtractedContent(extractedText)}`);
  }
  
  return slideTexts;
};

// Format extracted content to make it more readable
const formatExtractedContent = (content: string): string => {
  // Split into lines
  let lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  // Try to identify bullet points
  lines = lines.map(line => {
    // If line starts with a number and period, or common bullet characters, format as bullet
    if (line.match(/^[\d•\-\*]\.\s+/)) {
      return line; // Already formatted
    }
    // Short lines (likely bullet points) that don't start with common slide titles
    else if (
      line.length < 100 && 
      !line.startsWith('Title:') &&
      !line.match(/^(Introduction|Conclusion|Summary|Agenda|Overview|Thank you)/i)
    ) {
      return `• ${line}`;
    }
    return line;
  });
  
  return lines.join('\n');
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
