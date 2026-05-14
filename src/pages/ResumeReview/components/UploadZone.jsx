import React from "react";
import { useState, useRef } from "react";
import { FaCloudUploadAlt, FaFilePdf, FaSpinner } from "react-icons/fa";

function UploadZone(props) {
  const isAnalyzing = props.isAnalyzing;
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    setIsDragOver(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }

  function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }

  function handleFile(file) {
    setSelectedFile(file);
    props.onUpload(file);
  }

  function handleClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  const zoneClass = isDragOver
    ? "border-brand-500 bg-brand-500/5"
    : "border-surface-border bg-surface-card hover:border-gray-500";

  return (
    <div className="card p-8">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        className={"border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all " + zoneClass}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={handleFileSelect}
          className="hidden"
        />

        {isAnalyzing ? (
          <React.Fragment>
            <FaSpinner size={48} className="text-brand-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-white mb-2">Uploading...</h3>
            <p className="text-gray-400 text-sm">Please wait while we process your resume</p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <FaCloudUploadAlt size={48} className="text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Upload your resume</h3>
            <p className="text-gray-400 text-sm mb-4">Drag and drop your PDF here, or click to browse</p>
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <FaFilePdf size={14} className="text-rose-400" />
              <span>PDF only, max 5MB</span>
            </div>
          </React.Fragment>
        )}
      </div>

      {selectedFile && !isAnalyzing && (
        <div className="mt-4 p-3 bg-surface/50 rounded-xl border border-surface-border flex items-center gap-3">
          <FaFilePdf size={20} className="text-rose-400" />
          <div className="flex-1">
            <p className="text-white text-sm font-medium">{selectedFile.name}</p>
            <p className="text-gray-500 text-xs">{(selectedFile.size / 1024).toFixed(1)} KB</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadZone;