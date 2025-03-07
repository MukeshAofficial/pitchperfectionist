
// API service for communicating with the FastAPI backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const uploadPowerPoint = async (file: File): Promise<any> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/upload-ppt`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error uploading file');
  }
  
  return response.json();
};

export const enhanceSlide = async (
  slideIndex: number, 
  enhancementType: string, 
  options: Record<string, any>
): Promise<any> => {
  const response = await fetch(`${API_URL}/enhance-slide`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      slide_index: slideIndex,
      enhancement_type: enhancementType,
      options
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || 'Error enhancing slide');
  }
  
  return response.json();
};
