
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileUp, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    
    // Accept both PowerPoint and Word documents
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
      'application/vnd.ms-powerpoint', // ppt
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
      'application/msword' // doc
    ];
    
    if (!validTypes.includes(file.type)) {
      const errorMsg = "Please upload a PowerPoint file (.ppt or .pptx) or Word document (.doc or .docx)";
      setUploadError(errorMsg);
      toast({
        title: "Invalid file format",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      setUploadError(null);
      onFileUpload(selectedFile);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 transition-all duration-200 ease-in-out",
          "flex flex-col items-center justify-center space-y-4",
          isDragging ? "border-pitch-purple bg-pitch-purple/5" : "border-gray-600 hover:border-pitch-purple/70",
          uploadError ? "border-red-500/50" : "",
          "glass-card"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-16 h-16 bg-pitch-purple/10 rounded-full flex items-center justify-center">
          <Upload className="w-8 h-8 text-pitch-purple" />
        </div>

        <div className="text-center">
          <h3 className="purple-gradient-text text-xl mb-2">Drag & Drop your presentation</h3>
          <p className="text-muted-foreground">
            or <span className="text-pitch-purple underline cursor-pointer">browse files</span>
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Supported formats: .ppt, .pptx, .doc, .docx
          </p>
        </div>

        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".ppt,.pptx,.doc,.docx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleFileChange}
        />

        <label htmlFor="file-upload">
          <Button className="cursor-pointer" variant="outline">
            <FileUp className="w-4 h-4 mr-2" />
            Browse Files
          </Button>
        </label>
        
        {uploadError && (
          <p className="text-sm text-red-500">{uploadError}</p>
        )}
      </div>

      {selectedFile && (
        <div className="mt-6 glass-card p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <File className="w-6 h-6 text-pitch-purple mr-3" />
              <div>
                <p className="font-medium text-white truncate max-w-[260px]">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <Button 
              onClick={handleUpload} 
              disabled={isLoading}
              className="bg-pitch-purple hover:bg-pitch-purple-dark text-white"
            >
              {isLoading ? "Processing..." : "Upload Presentation"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
