
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  defaultPrompt: string;
  onDefaultPromptChange: (prompt: string) => void;
  model: string;
  onModelChange: (model: string) => void;
  darkMode: boolean;
  onDarkModeChange: (enabled: boolean) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
  apiKey,
  onApiKeyChange,
  defaultPrompt,
  onDefaultPromptChange,
  model,
  onModelChange,
  darkMode,
  onDarkModeChange,
}) => {
  const [localApiKey, setLocalApiKey] = useState(apiKey);
  const [localDefaultPrompt, setLocalDefaultPrompt] = useState(defaultPrompt);
  const [localModel, setLocalModel] = useState(model);
  const [localDarkMode, setLocalDarkMode] = useState(darkMode);

  const handleSave = () => {
    onApiKeyChange(localApiKey);
    onDefaultPromptChange(localDefaultPrompt);
    onModelChange(localModel);
    onDarkModeChange(localDarkMode);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-pitch-dark-lighter border-white/10 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="purple-gradient-text text-xl">Application Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 my-4">
          <div className="space-y-2">
            <Label htmlFor="api-key">OpenAI API Key</Label>
            <Input
              id="api-key"
              type="password"
              placeholder="sk-..."
              value={localApiKey}
              onChange={(e) => setLocalApiKey(e.target.value)}
              className="bg-pitch-dark-lightest border-white/10"
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Select value={localModel} onValueChange={setLocalModel}>
              <SelectTrigger className="bg-pitch-dark-lightest border-white/10">
                <SelectValue placeholder="Select model" />
              </SelectTrigger>
              <SelectContent className="bg-pitch-dark-lighter border-white/10">
                <SelectItem value="gpt-4o">GPT-4o (Recommended)</SelectItem>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini (Faster)</SelectItem>
                <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (Economy)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="default-prompt">Default Enhancement Instructions</Label>
            <Textarea
              id="default-prompt"
              placeholder="Instructions to apply to all enhancements..."
              value={localDefaultPrompt}
              onChange={(e) => setLocalDefaultPrompt(e.target.value)}
              className="bg-pitch-dark-lightest border-white/10 min-h-[100px]"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <p className="text-xs text-muted-foreground">
                Toggle between dark and light mode
              </p>
            </div>
            <Switch
              id="dark-mode"
              checked={localDarkMode}
              onCheckedChange={setLocalDarkMode}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-white/10"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-pitch-purple hover:bg-pitch-purple-dark text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
