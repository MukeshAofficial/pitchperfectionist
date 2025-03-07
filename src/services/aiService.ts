import { EnhancementType, EnhancementOptions } from "@/components/EnhancementOptions";
import { enhanceSlide as apiEnhanceSlide } from "./api";

// Interface for the AI service configuration
interface AIServiceConfig {
  apiKey: string;
  model: string;
  defaultPrompt: string;
}

// Create a class for the AI service
class AIService {
  private config: AIServiceConfig;
  private currentPresentationId: string | null = null;

  constructor(config: AIServiceConfig) {
    this.config = config;
  }

  // Update the service configuration
  public updateConfig(config: Partial<AIServiceConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Set the current presentation ID
  public setCurrentPresentationId(id: string): void {
    this.currentPresentationId = id;
  }

  // Get the current presentation ID
  public getCurrentPresentationId(): string | null {
    return this.currentPresentationId;
  }

  // Get the current API key
  public getApiKey(): string {
    return this.config.apiKey;
  }

  // Get the current model
  public getModel(): string {
    return this.config.model;
  }

  // Get the default prompt
  public getDefaultPrompt(): string {
    return this.config.defaultPrompt;
  }

  // Create a prompt based on the enhancement type and options
  private createPrompt(
    enhancementType: EnhancementType,
    slideContent: string,
    options: EnhancementOptions
  ): string {
    const { customInstructions, toneLevel, targetAudience } = options;
    
    let prompt = "Enhance the following presentation slide content";
    
    // Add enhancement type specific instructions
    switch (enhancementType) {
      case "simplify":
        prompt += " by simplifying the language and making it easier to understand";
        break;
      case "storytelling":
        prompt += " by adding storytelling elements and narrative structure";
        break;
      case "professional":
        prompt += " by making it more professional and business-appropriate";
        break;
      case "accessible":
        prompt += " by improving accessibility and inclusivity";
        break;
      case "engaging":
        prompt += " by making it more engaging and captivating for the audience";
        break;
      case "concise":
        prompt += " by making it more concise and focused on key points";
        break;
      case "elaborate":
        prompt += " by elaborating on the content with more details and explanation";
        break;
      case "academic":
        prompt += " by giving it an academic style appropriate for research or educational settings";
        break;
      case "creative":
        prompt += " by adding creative elements and unique perspectives";
        break;
    }
    
    // Add audience information if provided
    if (targetAudience) {
      prompt += `. The target audience is: ${targetAudience}`;
    }
    
    // Add tone level information
    prompt += `. Use a tone intensity of ${toneLevel}/10 (where 10 is the strongest).`;
    
    // Add custom instructions if provided
    if (customInstructions) {
      prompt += ` Additional instructions: ${customInstructions}`;
    }
    
    // Add default prompt if set
    if (this.config.defaultPrompt) {
      prompt += ` ${this.config.defaultPrompt}`;
    }
    
    // Add the slide content
    prompt += `\n\nSlide content:\n${slideContent}`;
    
    // Final instruction
    prompt += "\n\nEnhanced version:";
    
    return prompt;
  }

  // Enhance a slide using the FastAPI backend
  public async enhanceSlide(
    enhancementType: EnhancementType,
    slideContent: string,
    options: EnhancementOptions,
    slideIndex: number = 0
  ): Promise<string> {
    try {
      // Create the enhancement request options
      const enhancementOptions = {
        customInstructions: options.customInstructions,
        toneLevel: options.toneLevel,
        targetAudience: options.targetAudience,
        apiKey: this.config.apiKey,
        model: this.config.model,
        defaultPrompt: this.config.defaultPrompt,
      };
      
      // If we're in development mode and don't have a real backend connection
      if (process.env.NODE_ENV === "development" && !import.meta.env.VITE_API_URL) {
        console.log("Simulating backend enhancement in development");
        return this.simulateEnhancement(enhancementType, slideContent);
      }
      
      // Call the API service
      const result = await apiEnhanceSlide(slideIndex, enhancementType, enhancementOptions);
      return result.enhanced_content;
    } catch (error) {
      console.error("Error enhancing slide:", error);
      
      // Fallback to OpenAI API if the backend fails
      return this.fallbackToOpenAI(enhancementType, slideContent, options);
    }
  }
  
  // Fallback to OpenAI API if the backend fails
  private async fallbackToOpenAI(
    enhancementType: EnhancementType,
    slideContent: string,
    options: EnhancementOptions
  ): Promise<string> {
    // Check if API key is set
    if (!this.config.apiKey) {
      throw new Error("OpenAI API key is not set. Please set it in the settings.");
    }
    
    try {
      const prompt = this.createPrompt(enhancementType, slideContent, options);
      
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: [
            {
              role: "system",
              content: "You are an expert presentation writer and editor. Your task is to enhance presentation slide content based on specific requirements."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`OpenAI API error: ${error.error?.message || JSON.stringify(error)}`);
      }
      
      const data = await response.json();
      const enhancedContent = data.choices[0].message.content.trim();
      
      return enhancedContent;
    } catch (error) {
      console.error("Error with OpenAI fallback:", error);
      // If everything fails, return simulated content
      return this.simulateEnhancement(enhancementType, slideContent);
    }
  }
  
  // Simulate enhancement for development or when API key is not available
  private simulateEnhancement(
    enhancementType: EnhancementType,
    slideContent: string
  ): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let enhanced = slideContent;
        
        switch (enhancementType) {
          case "simplify":
            enhanced = `${slideContent}\n\n[Simplified version would appear here with easier language and clearer explanations]`;
            break;
          case "storytelling":
            enhanced = `${slideContent}\n\n[Storytelling version would include a narrative arc, characters, and emotional elements]`;
            break;
          case "professional":
            enhanced = `${slideContent}\n\n[Professional version would use business terminology, formal language, and structured points]`;
            break;
          case "accessible":
            enhanced = `${slideContent}\n\n[Accessible version would use inclusive language, clear structure, and avoid jargon]`;
            break;
          case "engaging":
            enhanced = `${slideContent}\n\n[Engaging version would include questions, interactive elements, and captivating language]`;
            break;
          case "concise":
            enhanced = `${slideContent}\n\n[Concise version would eliminate redundancy and focus on key messages]`;
            break;
          case "elaborate":
            enhanced = `${slideContent}\n\n[Elaborate version would add details, examples, and expanded explanations]`;
            break;
          case "academic":
            enhanced = `${slideContent}\n\n[Academic version would include citations, technical language, and research-based structure]`;
            break;
          case "creative":
            enhanced = `${slideContent}\n\n[Creative version would incorporate metaphors, unique perspectives, and innovative presentation styles]`;
            break;
        }
        
        resolve(enhanced);
      }, 1500);
    });
  }
}

// Create and export default instance with default configuration
export const aiService = new AIService({
  apiKey: localStorage.getItem("openai-api-key") || "",
  model: localStorage.getItem("openai-model") || "gpt-4o",
  defaultPrompt: localStorage.getItem("default-prompt") || "",
});

export default aiService;
