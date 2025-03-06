
import React, { useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type EnhancementType = 
  | "simplify" 
  | "storytelling" 
  | "professional" 
  | "accessible" 
  | "engaging" 
  | "concise" 
  | "elaborate" 
  | "academic" 
  | "creative";

interface EnhancementOptionsProps {
  onEnhance: (type: EnhancementType, options: EnhancementOptions) => void;
  isEnhancing: boolean;
}

export interface EnhancementOptions {
  customInstructions: string;
  toneLevel: number;
  targetAudience: string;
}

const EnhancementOptions: React.FC<EnhancementOptionsProps> = ({
  onEnhance,
  isEnhancing,
}) => {
  const [enhancementType, setEnhancementType] = useState<EnhancementType>("simplify");
  const [customInstructions, setCustomInstructions] = useState("");
  const [toneLevel, setToneLevel] = useState(5);
  const [targetAudience, setTargetAudience] = useState("");
  
  const enhancementTypes: { value: EnhancementType; label: string; description: string }[] = [
    { value: "simplify", label: "Simplify Content", description: "Make complex content easier to understand" },
    { value: "storytelling", label: "Add Storytelling Elements", description: "Transform content into a compelling narrative" },
    { value: "professional", label: "Make Professional", description: "Refine content for business presentations" },
    { value: "accessible", label: "Improve Accessibility", description: "Make content more inclusive and accessible" },
    { value: "engaging", label: "Make More Engaging", description: "Add elements to capture audience attention" },
    { value: "concise", label: "Make Concise", description: "Reduce wordiness and focus on key points" },
    { value: "elaborate", label: "Elaborate Content", description: "Add more detail and explanation" },
    { value: "academic", label: "Academic Style", description: "Format for academic or research presentations" },
    { value: "creative", label: "Creative Transformation", description: "Add creative elements and unique perspectives" },
  ];

  const handleEnhance = () => {
    onEnhance(enhancementType, {
      customInstructions,
      toneLevel,
      targetAudience,
    });
  };

  const getEnhancementDescription = () => {
    return enhancementTypes.find(type => type.value === enhancementType)?.description || "";
  };

  return (
    <div className="glass-card rounded-lg p-5">
      <h2 className="text-xl purple-gradient-text mb-4">AI Enhancement Tools</h2>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Choose Enhancement Type
          </label>
          <Select
            value={enhancementType}
            onValueChange={(value) => setEnhancementType(value as EnhancementType)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select enhancement type" />
            </SelectTrigger>
            <SelectContent className="bg-pitch-dark-lighter border-white/10">
              {enhancementTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">{getEnhancementDescription()}</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Target Audience (Optional)
          </label>
          <Input
            placeholder="e.g., Executives, Students, General public"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            className="bg-pitch-dark-lightest border-white/10"
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-muted-foreground">
              Tone Intensity
            </label>
            <span className="text-xs text-muted-foreground">{toneLevel}/10</span>
          </div>
          <Slider
            value={[toneLevel]}
            min={1}
            max={10}
            step={1}
            onValueChange={([value]) => setToneLevel(value)}
            className="mb-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtle</span>
            <span>Moderate</span>
            <span>Strong</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2 text-muted-foreground">
            Custom Instructions (Optional)
          </label>
          <Textarea
            placeholder="Add specific instructions for the AI enhancement..."
            value={customInstructions}
            onChange={(e) => setCustomInstructions(e.target.value)}
            className="bg-pitch-dark-lightest border-white/10 min-h-[100px]"
          />
        </div>

        <Button 
          className={cn(
            "w-full mt-4",
            "bg-pitch-purple hover:bg-pitch-purple-dark text-white"
          )}
          onClick={handleEnhance}
          disabled={isEnhancing}
        >
          {isEnhancing ? (
            "Enhancing..."
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Enhance Slide
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EnhancementOptions;
