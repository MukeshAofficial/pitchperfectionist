
import { useState } from "react";
import aiService from "@/services/aiService";

export const useEditorSettings = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState(aiService.getApiKey());
  const [model, setModel] = useState(aiService.getModel());
  const [defaultPrompt, setDefaultPrompt] = useState(aiService.getDefaultPrompt());
  const [darkMode, setDarkMode] = useState(true);
  
  const handleApiKeyChange = (key: string) => {
    setApiKey(key);
    localStorage.setItem("openai-api-key", key);
    aiService.updateConfig({ apiKey: key });
  };
  
  const handleModelChange = (model: string) => {
    setModel(model);
    localStorage.setItem("openai-model", model);
    aiService.updateConfig({ model });
  };
  
  const handleDefaultPromptChange = (prompt: string) => {
    setDefaultPrompt(prompt);
    localStorage.setItem("default-prompt", prompt);
    aiService.updateConfig({ defaultPrompt: prompt });
  };
  
  const handleDarkModeChange = (enabled: boolean) => {
    setDarkMode(enabled);
  };
  
  return {
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
  };
};
