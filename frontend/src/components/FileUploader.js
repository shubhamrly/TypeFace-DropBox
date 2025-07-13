import React, { useState, useRef } from 'react';
import { TextField, Typography, Box, Button } from '@mui/material';
import uploadIcon from './assets/upload-icon.gif';
import uploadCompletedIcon from './assets/uploadComplete.gif';
import uploadFailedIcon from './assets/uploadFailed.gif';
import axios from 'axios';
const MAX_FILES_LIMIT = 15;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// allowing only specific files, 
const allowedTypes = [
  'image/jpeg', 
  'image/png', 
  'text/plain', 
  'application/json', 
  'application/pdf', 
  'application/rtf'
];

function FileUploader({ setFiles, uploadFiles, onUploadSuccess }) {
  const [errorMessage, setErrorMesssage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadCompleted, setUploadCompleted] = useState(false);
  const [uploadFailed, setUploadFailed] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const dropFileRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (selectedFiles.length + files.length > MAX_FILES_LIMIT) {
      setErrorMesssage(`${MAX_FILES_LIMIT} files allowed at a time.`);
      setTimeout(() => setErrorMesssage(''), 2000); // Reset error message after 2 seconds
      return;
    }
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    if (validFiles.length > 0) {
      const updatedFiles = [...selectedFiles, ...validFiles]; // Append new files
      setSelectedFiles(updatedFiles);
      setFiles(updatedFiles);
      setErrorMesssage('');
    } else {
      alert('Unsupported file type. Allowed types: jpg, png, txt, json, pdf, rtf.');
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (selectedFiles.length + files.length > MAX_FILES_LIMIT) {
      setErrorMesssage(`${MAX_FILES_LIMIT} files allowed at a time.`);
      setTimeout(() => setErrorMesssage(''), 2200); // Reset error message after 2 seconds
      return;
    }
    const validFiles = files.filter(file => allowedTypes.includes(file.type));
    if (validFiles.length > 0) {
      const updatedFiles = [...selectedFiles, ...validFiles]; // Append new files
      setSelectedFiles(updatedFiles);
      setFiles(updatedFiles);
      setErrorMesssage('');
    } else {
      alert('Unsupported file type. Allowed types: jpg, png, txt, json, pdf, rtf.');
    }
  };
  const handleClickDropArea = () => {
    if (dropFileRef.current) dropFileRef.current.click();
  };
  const handleSubmit = async () => {
    if (selectedFiles.length === 0) {
      setErrorMesssage('Select some files before submitting.');
      return;
    }
    setIsUploading(true);
    setUploadCompleted(false);
    setUploadFailed(false);
    setUploadProgress(0);
    const formData = new FormData();
    selectedFiles.forEach(file => formData.append('files', file));
    try {
      await axios.post(`${API_BASE_URL}/api/files/upload`, formData);
      setIsUploading(false);
      setUploadCompleted(true);
      setTimeout(() => {
        setUploadCompleted(false);
        setUploadProgress(0);
        if (dropFileRef.current) dropFileRef.current.value = '';
        setSelectedFiles([]);
        setFiles([]);
      }, 2000);
      // Call onUploadSuccess after upload completes
      if (typeof onUploadSuccess === "function") onUploadSuccess();
    } catch (err) {
      setIsUploading(false);
      setUploadFailed(true);
      setErrorMesssage('Upload failed,please try again.');
      setTimeout(() => {
        setUploadFailed(false);
        setErrorMesssage('');
        setUploadProgress(0);
      }, 2500);
    }
  };
  //using array to remove selected file. 
  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = selectedFiles.filter((_, idx) => idx !== indexToRemove);
    setSelectedFiles(updatedFiles);
    setFiles(updatedFiles);
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        style={{ marginTop: '50px' }}
        onDragOver={handleDragOver} // Move drag events to the outer Box
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Box
          onClick={handleClickDropArea} // Keep click event for inner Box
          sx={{
            border: dragActive ? '2px solid rgb(13, 124, 242)' : '2px dashed #bbb',
            borderRadius: '10px',
            background: dragActive ? '#e3f2fd' : '#fafafa',
            padding: '18px 12px 10px 12px',
            marginBottom: '10px',
            width: '240px',
            minHeight: '180px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border 0.3s, background 0.2s',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            animation: dragActive ? 'fade-in 0.3s' : 'none',
          }}
        >
          {}
          <img
            src={
              uploadFailed
                ? uploadFailedIcon
                : uploadCompleted
                  ? uploadCompletedIcon
                  : uploadIcon
            }
            alt="Upload Icon"
            style={{
              width: '48px',
              height: '48px',
              marginBottom: '8px',
              opacity: 0.9,
            }}
            onMouseOver={e => { if (!isUploading) e.target.style.transform = 'scale(1.1)'; }}
            onMouseOut={e => { if (!isUploading) e.target.style.transform = 'scale(1.0)'; }}
          />
          <Typography variant="body1" sx={{ color: '#555', fontSize: '0.95em', fontWeight: 500 }}>
            Drag &amp; drop files here
          </Typography>
          <Typography variant="caption" sx={{ color: '#888', fontSize: '0.8em' }}>
            or click to select files
          </Typography>
          <Typography variant="caption" sx={{ color: '#aaa', fontSize: '0.7em', display: 'block', marginTop: '2px' }}>
            (You can drag and drop multiple files)
          </Typography>
          {}
          <TextField 
            type="file" 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
            id="file-drop-area" 
            inputRef={dropFileRef}
            inputProps={{ 
              multiple: true,
              accept: allowedTypes.join(',')
            }} 
          />
          {}
          {errorMessage && (
            <Typography
              variant="body2"
              color="error"
              style={{
                marginTop: '6px',
                fontSize: '0.9em',
                animation: 'fade-in 0.5s'
              }}
            >
              {errorMessage}
            </Typography>
          )}
        </Box>
        {}
        {selectedFiles.length > 0 && (
          <Box
            sx={{
              marginTop: '14px',
              width: '100%',
              border: '1px solid #eee',
              borderRadius: '6px',
              background: '#fafbfc',
              boxSizing: 'border-box',
              padding: '10px 12px',
              animation: 'fade-in 0.5s'
            }}
          >
            <Typography
              variant="body1"
              sx={{
                mb: 1,
                textAlign: 'center',
                fontWeight: 500,
                fontSize: '1em'
              }}
            >
              Selected Files:
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                minHeight: '32px'
              }}
            >
              {selectedFiles.map((file, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#e3f2fd',
                    borderRadius: '4px',
                    padding: '2px 8px',
                    marginBottom: '4px',
                    maxWidth: '98ch',
                    animation: 'fade-in 0.5s',
                    overflow: 'hidden'
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.97em',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      maxWidth: '90ch'
                    }}
                    title={file.name}
                  >
                    {file.name}
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    sx={{
                      minWidth: '24px',
                      padding: '0 4px',
                      marginLeft: '6px',
                      fontSize: '1em',
                      lineHeight: 1,
                      height: '24px'
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                  >
                    ×
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {}
        {isUploading && (
          <Box
            sx={{
              width: '100%',
              height: '8px',
              background: '#e0e0e0',
              borderRadius: '4px',
              overflow: 'hidden',
              marginTop: '16px',
            }}
          >
            <Box
              sx={{
                width: `${uploadProgress}%`,
                height: '100%',
                background: '#007BFF',
                transition: 'width 0.3s ease',
              }}
            />
          </Box>
        )}
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary" 
          style={{
            marginTop: '16px',
            backgroundColor: 'rgb(254 36 61)',
            color: 'white',
            fontWeight: 'bold',
            padding: '12px 24px',
            borderRadius: '77px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
            transition: 'background-color 0.3s, transform 0.3s',
          }}
          disabled={isUploading}
        >
          {isUploading
            ? `Uploading... ${uploadProgress}%`
            : uploadFailed
              ? 'Upload Failed'
              : 'Start Upload'}
        </Button>
      </Box>
    </>
  );
}
export default FileUploader;
