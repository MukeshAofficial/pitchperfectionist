
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EnhancementType, EnhancementOptions } from "@/components/EnhancementOptions";
import aiService from "@/services/aiService";

export const useContentEnhancement = (initialContent: string = "") => {
  const { toast } = useToast();
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedContent, setEnhancedContent] = useState(initialContent);
  const [contentHistory, setContentHistory] = useState<string[]>([initialContent]);
  const [historyIndex, setHistoryIndex] = useState(0);
  
  useEffect(() => {
    if (initialContent) {
      setEnhancedContent(initialContent);
      setContentHistory([initialContent]);
      setHistoryIndex(0);
    }
  }, [initialContent]);
  
  const handleEnhance = async (type: EnhancementType, options: EnhancementOptions) => {
    if (!initialContent) return;
    
    setIsEnhancing(true);
    
    try {
      const enhanced = await aiService.enhanceSlide(type, initialContent, options);
      
      setEnhancedContent(enhanced);
      
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
  
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setEnhancedContent(contentHistory[historyIndex - 1]);
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < contentHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setEnhancedContent(contentHistory[historyIndex + 1]);
    }
  };
  
  return {
    enhancedContent,
    setEnhancedContent,
    isEnhancing,
    contentHistory,
    historyIndex,
    handleEnhance,
    handleUndo,
    handleRedo
  };
};
