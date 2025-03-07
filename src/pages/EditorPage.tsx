
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import SlideNavigation from "@/components/SlideNavigation";
import SlidePreview from "@/components/SlidePreview";
import EnhancementOptions, { EnhancementType, EnhancementOptions as EnhanceOptions } from "@/components/EnhancementOptions";
import EnhancedContent from "@/components/EnhancedContent";
import SettingsDialog from "@/components/SettingsDialog";
import { getPresentationById, updateSlide } from "@/services/presentationService";
import aiService from "@/services/aiService";

const EditorPage: React.FC = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for the presentation and current slide
  const [presentation, setPresentation] = useState<any | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for the AI enhancement
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState("");
  
  // History state for undo/redo
  const [contentHistory, setContentHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(aiService.getApiKey());
  const [model, setModel] = useState(aiService.getModel());
  const [defaultPrompt, setDefaultPrompt] = useState(aiService.getDefaultPrompt());
  const [darkMode, setDarkMode] = useState(true);
  
  // Get the current slide content
  const currentSlide = presentation?.slides[currentSlideIndex - 1] || null;
  
  // Load the presentation
  useEffect(() => {
    if (presentationId) {
      const loadedPresentation = getPresentationById(presentationId);
      
      if (loadedPresentation) {
        setPresentation(loadedPresentation);
        
        // Initialize history with first slide content
        if (loadedPresentation.slides.length > 0) {
          const initialContent = loadedPresentation.slides[0].content;
          setContentHistory([initialContent]);
          setHistoryIndex(0);
        }
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
  
  // Update history when changing slides
  useEffect(() => {
    if (currentSlide && presentation) {
      setEnhancedContent(currentSlide.content);
      setContentHistory([currentSlide.content]);
      setHistoryIndex(0);
    }
  }, [currentSlideIndex, currentSlide, presentation]);
  
  // Handle slide selection
  const handleSelectSlide = (slideNumber: number) => {
    setCurrentSlideIndex(slideNumber);
  };
  
  // Handle back button click
  const handleBackClick = () => {
    navigate("/");
  };
  
  // Handle settings click
  const handleSettingsClick = () => {
    setSettingsOpen(true);
  };
  
  // Handle API key change
  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem("openai-api-key", key);
    aiService.updateConfig({ apiKey: key });
  };
  
  // Handle model change
  const handleModelChange = (model: string) => {
    setModel(model);
    localStorage.setItem("openai-model", model);
    aiService.updateConfig({ model });
  };
  
  // Handle default prompt change
  const handleDefaultPromptChange = (prompt: string) => {
    setDefaultPrompt(prompt);
    localStorage.setItem("default-prompt", prompt);
    aiService.updateConfig({ defaultPrompt: prompt });
  };
  
  // Handle dark mode change
  const handleDarkModeChange = (enabled: boolean) => {
    setDarkMode(enabled);
    // In a real implementation, you would apply the theme change here
  };
  
  // Handle enhancement
  const handleEnhance = async (type: EnhancementType, options: EnhanceOptions) => {
    if (!currentSlide) return;
    
    setIsEnhancing(true);
    
    try {
      const enhanced = await aiService.enhanceSlide(type, currentSlide.content, options);
      
      setEnhancedContent(enhanced);
      
      // Add to history
      const newHistory = contentHistory.slice(0, historyIndex + 1);
      newHistory.push(enhanced);
      setContentHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      toast({
        title: "Enhancement complete",
        description: "Your slide has been enhanced successfully.",
      });
    } catch (error) {
      toast({
        title: "Enhancement failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsEnhancing(false);
    }
  };
  
  // Handle applying changes
  const handleApplyChanges = (content: string) => {
    if (!presentationId || !currentSlide) return;
    
    // Update the slide
    updateSlide(presentationId, currentSlide.id, content);
    
    // Update the presentation in state
    if (presentation) {
      const updatedSlides = [...presentation.slides];
      const slideIndex = updatedSlides.findIndex((s) => s.id === currentSlide.id);
      
      if (slideIndex !== -1) {
        updatedSlides[slideIndex] = {
          ...updatedSlides[slideIndex],
          content,
        };
        
        setPresentation({
          ...presentation,
          slides: updatedSlides,
        });
      }
    }
  };
  
  // Handle undo
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setEnhancedContent(contentHistory[historyIndex - 1]);
    }
  };
  
  // Handle redo
  const handleRedo = () => {
    if (historyIndex < contentHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setEnhancedContent(contentHistory[historyIndex + 1]);
    }
  };
  
  // If presentation is not loaded yet, show loading state
  if (!presentation) {
    return (
      <div className="min-h-screen bg-pitch-dark flex flex-col">
        <Header title="Loading Presentation..." showBack={false} showSettings={false} />
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
        title={presentation.name} 
        onBackClick={handleBackClick} 
        onSettingsClick={handleSettingsClick}
        showBack={true}
      />
      
      <div className="p-4">
        <SlideNavigation
          currentSlide={currentSlideIndex}
          totalSlides={presentation.slides.length}
          onSelectSlide={handleSelectSlide}
        />
      </div>
      
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[calc(100vh-200px)]">
        <div className="space-y-6 flex flex-col">
          <SlidePreview 
            slideContent={currentSlide?.content || ""} 
            slideName={currentSlide?.title || "No Slide Selected"}
            className="flex-1"
          />
          
          <EnhancementOptions
            onEnhance={handleEnhance}
            isEnhancing={isEnhancing}
          />
        </div>
        
        <EnhancedContent
          originalContent={currentSlide?.content || ""}
          enhancedContent={enhancedContent}
          onApply={handleApplyChanges}
          history={contentHistory}
          historyIndex={historyIndex}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
      </div>
      
      {/* Settings Dialog */}
      <SettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        apiKey={apiKey}
        onApiKeyChange={handleApiKeyChange}
        defaultPrompt={defaultPrompt}
        onDefaultPromptChange={handleDefaultPromptChange}
        model={model}
        onModelChange={handleModelChange}
        darkMode={darkMode}
        onDarkModeChange={handleDarkModeChange}
      />
    </div>
  );
};

export default EditorPage;
