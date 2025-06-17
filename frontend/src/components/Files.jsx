import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import FileViewer from './FileViewer';

const Files = () => {
  const location = useLocation();
  const files = useMemo(() => location.state?.files || [], [location.state?.files]); // Ensure fallback to empty array

  useEffect(() => {
    console.log('Files loaded:', files);
  }, [files]);

  return (
    <div className="files-page">
      <h2>Files in Folder</h2>
      <FileViewer files={files} type="file" />
    </div>
  );
};

export default Files;
