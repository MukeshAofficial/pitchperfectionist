
import React, { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const BackendStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  
  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch(`${API_URL}/health`, { 
          method: 'GET',
          // Adding a timeout so it doesn't hang too long
          signal: AbortSignal.timeout(5000)
        });
        
        if (response.ok) {
          setStatus('connected');
        } else {
          setStatus('disconnected');
        }
      } catch (error) {
        console.error("Error checking backend status:", error);
        setStatus('disconnected');
      }
    };
    
    checkBackendStatus();
    // Check again every 30 seconds
    const interval = setInterval(checkBackendStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 gap-1 px-2"
          >
            <Server className="w-4 h-4" />
            {status === 'checking' && (
              <span className="text-xs animate-pulse">Checking...</span>
            )}
            {status === 'connected' && (
              <>
                <CheckCircle2 className="w-3 h-3 text-green-500" />
                <span className="text-xs">Backend</span>
              </>
            )}
            {status === 'disconnected' && (
              <>
                <XCircle className="w-3 h-3 text-red-500" />
                <span className="text-xs">Backend</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {status === 'checking' && "Checking backend connection..."}
          {status === 'connected' && "Backend server is connected"}
          {status === 'disconnected' && (
            <div className="text-center space-y-1 max-w-xs">
              <p>Backend server is not connected</p>
              <p className="text-xs text-muted-foreground">
                Make sure the FastAPI server is running at {API_URL}
              </p>
              <p className="text-xs text-muted-foreground">
                Check the console for more details
              </p>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default BackendStatus;
