
import React from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import SlidePreview from "@/components/SlidePreview";
import EnhancementOptions from "@/components/EnhancementOptions";
import EnhancedContent from "@/components/EnhancedContent";
import SettingsDialog from "@/components/SettingsDialog";
import EditorToolbar from "@/components/EditorToolbar";
import { usePresentation } from "@/hooks/usePresentation";
import { useContentEnhancement } from "@/hooks/useContentEnhancement";
import { useEditorSettings } from "@/hooks/useEditorSettings";

const EditorPage: React.FC = () => {
  const { presentationId } = useParams<{ presentationId: string }>();
  
  // Custom hooks
  const { 
    presentation, 
    currentSlideIndex, 
    setCurrentSlideIndex, 
    currentSlide, 
    handleUpdateSlide 
  } = usePresentation(presentationId);
  
  const {
    enhancedContent,
    isEnhancing,
    contentHistory,
    historyIndex,
    handleEnhance,
    handleUndo,
    handleRedo
  } = useContentEnhancement(currentSlide?.content);
  
  const {
    settingsOpen,
    setSettingsOpen,
    apiKey,
    model,
    defaultPrompt,
    darkMode,
    handleApiKeyChange,
    handleModelChange,
    handleDefaultPromptChange,
    handleDarkModeChange
  } = useEditorSettings();
  
  const handleApplyChanges = (content: string) => {
    if (currentSlide) {
      handleUpdateSlide(currentSlide.id, content);
    }
  };
  
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
        onBackClick={() => window.location.href = '/'} 
        onSettingsClick={() => setSettingsOpen(true)}
        showBack={true}
      />
      
      <EditorToolbar
        presentationId={presentationId}
        currentSlide={currentSlideIndex}
        totalSlides={presentation.slides.length}
        onSelectSlide={setCurrentSlideIndex}
      />
      
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
