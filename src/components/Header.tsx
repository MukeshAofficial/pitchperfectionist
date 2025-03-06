
import React from "react";
import { ArrowLeft, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
  onBackClick?: () => void;
  onSettingsClick?: () => void;
  showSettings?: boolean;
  showBack?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBackClick,
  onSettingsClick,
  showSettings = true,
  showBack = false,
}) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackClick}
            className="text-muted-foreground hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}
        <h1 className="text-xl purple-gradient-text">{title}</h1>
      </div>

      {showSettings && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="text-muted-foreground hover:text-white"
        >
          <Settings className="w-5 h-5" />
        </Button>
      )}
    </header>
  );
};

export default Header;
