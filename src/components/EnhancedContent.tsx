
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, RotateCcw, RotateCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnhancedContentProps {
  originalContent: string;
  enhancedContent: string;
  onApply: (content: string) => void;
  history: string[];
  historyIndex: number;
  onUndo: () => void;
  onRedo: () => void;
}

const EnhancedContent: React.FC<EnhancedContentProps> = ({
  originalContent,
  enhancedContent,
  onApply,
  history,
  historyIndex,
  onUndo,
  onRedo,
}) => {
  const { toast } = useToast();
  const [editedContent, setEditedContent] = useState(enhancedContent);
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(editedContent);
    setCopied(true);
    toast({
      title: "Content copied to clipboard",
      description: "You can now paste it anywhere you need.",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleApply = () => {
    onApply(editedContent);
    toast({
      title: "Changes applied",
      description: "The enhanced content has been applied to the slide.",
    });
  };

  const handleEdit = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedContent(e.target.value);
  };

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  return (
    <div className="glass-card rounded-lg p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg purple-gradient-text">Enhanced Content</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            disabled={!canUndo}
            onClick={onUndo}
            className="bg-pitch-dark-lighter border-white/10 h-8 w-8"
            title="Undo"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={!canRedo}
            onClick={onRedo}
            className="bg-pitch-dark-lighter border-white/10 h-8 w-8"
            title="Redo"
          >
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopy}
            className="bg-pitch-dark-lighter border-white/10 h-8 w-8"
            title="Copy to clipboard"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Textarea
          value={editedContent}
          onChange={handleEdit}
          className="bg-pitch-dark-lightest border-white/10 min-h-[250px] h-full resize-none"
          placeholder="Enhanced content will appear here..."
        />
      </div>

      <div className="mt-3 flex justify-end">
        <Button
          className="bg-pitch-purple hover:bg-pitch-purple-dark text-white"
          onClick={handleApply}
        >
          Apply Changes
        </Button>
      </div>
    </div>
  );
};

export default EnhancedContent;
