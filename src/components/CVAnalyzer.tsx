
import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/api';
import axios from 'axios';
import { useUser } from '@/context/UserIDContext';

interface CVAnalysis {
  id: number;
  user_id: string;
  summary: string;
  text: string;
  created_at: string;
}

interface CVAnalyzerProps {
  existingAnalysis: CVAnalysis | null;
  isLoading: boolean;
  onAnalysisComplete: () => void;
}

const CVAnalyzer = ({ existingAnalysis, isLoading, onAnalysisComplete }: CVAnalyzerProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const { userId } = useUser();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUseExample = async () => {
    try {
      const response = await fetch('/example_cv.pdf');
      const blob = await response.blob();
      const file = new File([blob], 'example_cv.pdf', { type: 'application/pdf' });
      setFile(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load example CV",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_id', userId);

    try {
        const response = await axios.post(`${API_URL}analyze-pdf/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        toast({
            title: "Success",
            description: "CV uploaded and analyzed successfully",
        });

        onAnalysisComplete();
        setFile(null);
    } catch (error) {
        toast({
            title: "Error",
            description: "Failed to analyze CV",
            variant: "destructive",
        });
    } finally {
        setIsUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 glass rounded-lg p-8 flex items-center justify-center">
        <div className="flex items-center gap-2 text-foreground/60">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (existingAnalysis) {
    return (
      <div className="flex-1 glass rounded-lg p-8 animate-fade-down">
        <h2 className="text-2xl font-semibold mb-6">Your CV Analysis</h2>
        <div className="space-y-6">
          <div className="text-sm text-foreground/60">
            Analyzed on: {formatDate(existingAnalysis.created_at)}
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">AI Summary</h3>
              <div className="bg-secondary/50 rounded-lg p-4 whitespace-pre-wrap">
                {existingAnalysis.summary}
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">Full Text</h3>
              <div className="bg-secondary/50 rounded-lg p-4 max-h-96 overflow-y-auto whitespace-pre-wrap">
                {existingAnalysis.text}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 glass rounded-lg p-8">
      <h2 className="text-2xl font-semibold mb-6">CV Analyzer</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className={`flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-12 transition-opacity ${isUploading ? 'opacity-50' : 'opacity-100'}`}>
          <Upload className={`w-12 h-12 text-foreground/60 mb-4 ${isUploading ? 'animate-pulse' : ''}`} />
          <div className="flex flex-col gap-4 items-center">
            <label className="block text-center">
              <span className="bg-primary text-primary-foreground px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
                Select PDF File
              </span>
              <input
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
            <button
              type="button"
              onClick={handleUseExample}
              className="text-primary hover:text-primary/90 transition-colors"
              disabled={isUploading}
            >
              or use example CV
            </button>
          </div>
          {file && (
            <div className="mt-4 text-foreground/60">
              Selected file: {file.name}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!file || isUploading}
          className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
            !file || isUploading
              ? "bg-secondary text-secondary-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Analyze CV"
          )}
        </button>
      </form>
    </div>
  );
};

export default CVAnalyzer;
