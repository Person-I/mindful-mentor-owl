
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_URL } from '@/api';
import axios from 'axios';
import { useUser } from '@/context/UserIDContext';

const CVAnalyzer = () => {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = async () => {
      const base64String = (reader.result as string).split(',')[1];
      
      try {
        const response = await axios.post(`${API_URL}analyze-pdf/`, {
          file: base64String,
          user_id: userId
        });

        toast({
          title: "Success",
          description: "CV uploaded and analyzed successfully",
        });

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

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex-1 glass rounded-lg p-8">
      <h2 className="text-2xl font-semibold mb-6">CV Analyzer</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-12">
          <Upload className="w-12 h-12 text-foreground/60 mb-4" />
          <label className="block text-center">
            <span className="bg-primary text-primary-foreground px-4 py-2 rounded-lg cursor-pointer hover:bg-primary/90 transition-colors">
              Select PDF File
            </span>
            <input
              type="file"
              className="hidden"
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </label>
          {file && (
            <div className="mt-4 text-foreground/60">
              Selected file: {file.name}
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={!file || isUploading}
          className={`w-full py-2 px-4 rounded-lg transition-colors ${
            !file || isUploading
              ? "bg-secondary text-secondary-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isUploading ? "Analyzing..." : "Analyze CV"}
        </button>
      </form>
    </div>
  );
};

export default CVAnalyzer;
