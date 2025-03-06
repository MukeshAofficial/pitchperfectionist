
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Clock, File, Settings, Check } from "lucide-react";
import FileUploader from "@/components/FileUploader";
import SettingsDialog from "@/components/SettingsDialog";
import { Button } from "@/components/ui/button";
import { extractTextFromPowerPoint, savePresentation, getSavedPresentations, Presentation } from "@/services/presentationService";
import aiService from "@/services/aiService";

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isLoading, setIsLoading] = useState(false);
  const [recentPresentations, setRecentPresentations] = useState<Presentation[]>([]);
  
  // Settings state
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(aiService.getApiKey());
  const [model, setModel] = useState(aiService.getModel());
  const [defaultPrompt, setDefaultPrompt] = useState(aiService.getDefaultPrompt());
  const [darkMode, setDarkMode] = useState(true);
  
  // Load recent presentations
  useEffect(() => {
    const presentations = getSavedPresentations();
    setRecentPresentations(presentations);
  }, []);
  
  // Handle file upload
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    
    try {
      const presentation = await extractTextFromPowerPoint(file);
      
      // Save the presentation
      savePresentation(presentation);
      
      // Update recent presentations
      setRecentPresentations([presentation, ...recentPresentations]);
      
      toast({
        title: "Presentation uploaded",
        description: `${file.name} has been successfully processed.`,
      });
      
      // Navigate to the editor
      navigate(`/editor/${presentation.id}`);
    } catch (error) {
      console.error("Error processing presentation:", error);
      
      toast({
        title: "Error processing presentation",
        description: "There was an error processing your presentation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle recent presentation click
  const handleRecentPresentationClick = (presentationId: string) => {
    navigate(`/editor/${presentationId}`);
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
  
  return (
    <div className="min-h-screen bg-pitch-dark">
      <header className="py-8 px-4 text-center">
        <h1 className="text-4xl purple-gradient-text mb-2">PitchPerfectionist</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Upload your PowerPoint presentations and enhance them with AI-powered suggestions
        </p>
      </header>
      
      <main className="container mx-auto px-4 pb-16">
        <div className="mb-12">
          <FileUploader onFileUpload={handleFileUpload} isLoading={isLoading} />
        </div>
        
        {recentPresentations.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl purple-gradient-text flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Recent Presentations
              </h2>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleSettingsClick}
                className="border-white/10 hover:bg-pitch-dark-lighter"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {recentPresentations.map((presentation) => (
                <div
                  key={presentation.id}
                  className="glass-card p-4 rounded-lg cursor-pointer hover:bg-pitch-dark-lighter/70 transition-colors"
                  onClick={() => handleRecentPresentationClick(presentation.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="bg-pitch-purple/10 p-2 rounded">
                      <File className="w-6 h-6 text-pitch-purple" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate">{presentation.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {presentation.slides.length} slides
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-16 glass-card rounded-lg p-6 text-center mx-auto max-w-3xl">
          <div className="w-12 h-12 bg-pitch-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-pitch-purple" />
          </div>
          <h2 className="text-xl purple-gradient-text mb-2">Enhance Your Presentations with AI</h2>
          <p className="text-muted-foreground mb-4">
            PitchPerfectionist uses advanced AI to help you improve your slides,
            add storytelling elements, simplify complex content, and make your
            presentations more professional and engaging.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-sm text-muted-foreground mt-6">
            <div className="flex items-start">
              <div className="bg-pitch-purple/10 p-1 rounded-full mr-2 mt-0.5">
                <Check className="w-3 h-3 text-pitch-purple" />
              </div>
              <span>Simplify complex ideas</span>
            </div>
            <div className="flex items-start">
              <div className="bg-pitch-purple/10 p-1 rounded-full mr-2 mt-0.5">
                <Check className="w-3 h-3 text-pitch-purple" />
              </div>
              <span>Add engaging storytelling elements</span>
            </div>
            <div className="flex items-start">
              <div className="bg-pitch-purple/10 p-1 rounded-full mr-2 mt-0.5">
                <Check className="w-3 h-3 text-pitch-purple" />
              </div>
              <span>Make content more professional</span>
            </div>
            <div className="flex items-start">
              <div className="bg-pitch-purple/10 p-1 rounded-full mr-2 mt-0.5">
                <Check className="w-3 h-3 text-pitch-purple" />
              </div>
              <span>Improve accessibility for all audiences</span>
            </div>
          </div>
        </div>
      </main>
      
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

export default Index;
