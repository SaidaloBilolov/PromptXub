'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { ContentType } from '@/types';

interface MediaDropZoneProps {
  onFileSelected: (file: File | null, detectedType: ContentType) => void;
}

export const MediaDropZone: React.FC<MediaDropZoneProps> = ({ onFileSelected }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<ContentType>('PHOTO');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);

    // Max 50MB
    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg('File exceeds 50MB maximum upload limit.');
      return;
    }

    const isVideo = file.type.startsWith('video/') || file.name.endsWith('.mp4') || file.name.endsWith('.webm');
    const isImage = file.type.startsWith('image/') || file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i);

    if (!isVideo && !isImage) {
      setErrorMsg('Please select a valid image (JPG, PNG, WebP) or video (MP4, WebM).');
      return;
    }

    const detectedType: ContentType = isVideo ? 'VIDEO' : 'PHOTO';
    setFileType(detectedType);
    setSelectedFile(file);

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    onFileSelected(file, detectedType);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMsg(null);
    onFileSelected(null, 'PHOTO');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,video/mp4,video/webm"
        className="hidden"
        onChange={handleFileChange}
      />

      {selectedFile && previewUrl ? (
        <div className="relative rounded-2xl overflow-hidden border border-purple-500/50 bg-slate-950 p-4 flex flex-col items-center justify-center min-h-[260px]">
          {fileType === 'VIDEO' ? (
            <video
              src={previewUrl}
              controls
              autoPlay
              muted
              loop
              className="max-h-64 rounded-xl object-contain shadow-lg"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Media Preview"
              className="max-h-64 rounded-xl object-contain shadow-lg"
            />
          )}

          <div className="mt-4 flex items-center justify-between w-full max-w-md bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl text-xs">
            <div className="flex items-center gap-2 truncate mr-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="truncate text-slate-200 font-medium">{selectedFile.name}</span>
              <span className="text-slate-500 shrink-0">
                ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="p-1 rounded-lg bg-rose-950/60 text-rose-400 hover:bg-rose-900 border border-rose-800 transition shrink-0"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition flex flex-col items-center justify-center min-h-[240px] ${
            dragActive
              ? 'border-cyan-400 bg-cyan-950/20'
              : 'border-slate-800 bg-slate-900/50 hover:border-purple-500/60 hover:bg-slate-900/80'
          }`}
        >
          <div className="h-12 w-12 rounded-2xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6 text-purple-400" />
          </div>

          <p className="text-sm font-bold text-slate-200 mb-1">
            Drag & Drop AI photo or video here, or <span className="text-cyan-400 underline">browse</span>
          </p>
          <p className="text-xs text-slate-400">
            Supports MP4, WebM (video) or JPG, PNG, WebP (photo) up to 50MB
          </p>

          <div className="mt-4 flex items-center gap-3 text-[11px] font-semibold text-slate-400">
            <span className="flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5 text-purple-400" /> Auto-Format CDN
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Video className="w-3.5 h-3.5 text-cyan-400" /> Stream Direct to Cloudinary
            </span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
