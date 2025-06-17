import React from 'react';
import '../styles/NewOptions.css';
import fileIcon from '../Assets/upload-file.png';
import folderIcon from '../Assets/upload-folder.png';

const Upload = ({ onClose }) => {
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      try {
        // Retrieve user_id from localStorage and ensure it’s an integer
        const userId = parseInt(localStorage.getItem('user_id'), 10);
  
        if (isNaN(userId)) {
          throw new Error("Invalid user_id");
        }
  
        // Prepare form data for file upload
        const formData = new FormData();
        Array.from(files).forEach(file => {
          formData.append("files", file);
        });
  
        // Send files to backend with user_id as a query parameter
        const response = await fetch(`http://127.0.0.1:8000/upload_files?user_id=${userId}`, {
          method: "POST",
          body: formData,
        });
  
        if (response.ok) {
          const data = await response.json();
          alert("Files uploaded successfully!");
          console.log("Uploaded files:", data.uploaded_files);
        } else {
          const errorData = await response.json();
          console.error("File upload error:", errorData);
          alert("File upload failed. Please check the backend logs for details.");
        }
      } catch (error) {
        console.error("Error uploading files:", error);
        alert("An error occurred. Please try again.");
      }
    }
  
    // Close the options menu after selecting files
    onClose();
  };

  const triggerFileInput = () => {
    document.getElementById('fileInput').click();
  };

  return (
    <div className="new-options">
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
        multiple
        onChange={handleFileUpload}
      />
      <div className="new-option" onClick={triggerFileInput}>
        <img src={fileIcon} alt="Upload a file" className="new-option-icon" />
        <span>Upload a file</span>
      </div>
      <div className="new-option" onClick={() => {
        alert("Upload folder clicked");
        onClose(); // Close after clicking
      }}>
        <img src={folderIcon} alt="Upload a folder" className="new-option-icon" />
        <span>Upload a folder</span>
      </div>
    </div>
  );
};

export default Upload;
