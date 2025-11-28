
import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, AlertCircle, X, Plus, ArrowLeft } from 'lucide-react';
import { extractOrderData, fileToGenerativePart } from '../services/geminiService';
import { OrderData, Platform } from '../types';

interface UploadProcessorProps {
  platform: Platform;
  onDataExtracted: (data: OrderData[]) => void;
  onBack: () => void;
}

export const UploadProcessor: React.FC<UploadProcessorProps> = ({ platform, onDataExtracted, onBack }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (incomingFiles: FileList | File[]) => {
    const fileList = incomingFiles instanceof FileList ? Array.from(incomingFiles) : incomingFiles;
    const validFiles = fileList.filter(file => file.type.startsWith('image/'));

    if (validFiles.length === 0) {
      setError("Please upload image files (JPG, PNG, WEBP).");
      return;
    }

    if (validFiles.length < fileList.length) {
      setError("Some files were skipped because they are not images.");
    } else {
      setError(null);
    }

    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Convert all files to base64 in parallel
      const imageInputs = await Promise.all(
        selectedFiles.map(async (file) => ({
          base64: await fileToGenerativePart(file),
          mimeType: file.type
        }))
      );

      // Pass platform context to service
      const data = await extractOrderData(imageInputs, platform);
      onDataExtracted(data);
    } catch (err: any) {
      setError("Failed to process images. Please try again or use clearer images.");
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine accent colors based on platform
  const getAccentColor = () => {
    switch (platform) {
      case 'Shopee': return 'text-orange-600 bg-orange-600 border-orange-500 bg-orange-50';
      case 'Lazada': return 'text-blue-600 bg-blue-600 border-blue-500 bg-blue-50';
      case 'Tiktok': return 'text-slate-900 bg-slate-900 border-slate-900 bg-slate-50';
      default: return 'text-indigo-600 bg-indigo-600 border-indigo-500 bg-indigo-50';
    }
  };
  
  const accentClasses = getAccentColor();
  // Simple extraction for specific classes
  const textAccent = accentClasses.split(' ')[0];
  const bgAccent = accentClasses.split(' ')[1];
  const borderAccent = accentClasses.split(' ')[2];
  const bgLightAccent = accentClasses.split(' ')[3];

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 transition-all">
        <div className="flex items-center mb-2">
            <button onClick={onBack} className="mr-4 text-slate-400 hover:text-slate-600">
                <ArrowLeft className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold text-slate-900">Upload {platform} Orders</h2>
        </div>
        
        <p className="text-slate-500 mb-6 ml-10">Upload photos of your {platform} waybills. You can upload multiple files at once.</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 animate-fade-in">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Upload Area */}
        <div className="space-y-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[200px]
              ${isDragging ? `${borderAccent} ${bgLightAccent} scale-[1.01]` : `border-slate-300 hover:${borderAccent} hover:${bgLightAccent}`}
              ${isProcessing ? 'opacity-50 pointer-events-none' : ''}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
            />

            <div className={`${bgLightAccent} p-4 rounded-full mb-4`}>
              <UploadCloud className={`w-8 h-8 ${textAccent}`} />
            </div>
            <p className="text-lg font-medium text-slate-700 text-center">Click or drag {platform} images here</p>
            <p className="text-sm text-slate-400 mt-2 text-center">Supports JPG, PNG, WEBP (Multiple allowed)</p>
          </div>

          {/* Previews Grid */}
          {selectedFiles.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group aspect-[3/4] rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-slate-100">
                  <img 
                    src={url} 
                    alt={`Page ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFile(index)}
                    disabled={isProcessing}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-0"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs p-2 text-center truncate">
                    {selectedFiles[index].name}
                  </div>
                </div>
              ))}
              
              {/* Add More Button (Mini) */}
              {!isProcessing && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex flex-col items-center justify-center aspect-[3/4] rounded-xl border-2 border-dashed border-slate-300 hover:${borderAccent} hover:${bgLightAccent} transition-colors text-slate-400 hover:${textAccent}`}
                >
                  <Plus className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Add Page</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            onClick={handleProcess}
            disabled={selectedFiles.length === 0 || isProcessing}
            className={`
              flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-bold text-white transition-all
              ${selectedFiles.length === 0 || isProcessing ? 'bg-slate-300 cursor-not-allowed' : `${bgAccent} hover:opacity-90 shadow-lg`}
            `}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Analyzing {selectedFiles.length} {selectedFiles.length === 1 ? 'Image' : 'Images'}...
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5 mr-2" />
                Process {selectedFiles.length > 0 ? `${selectedFiles.length} Images` : 'Images'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
