import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import FileViewer from './FileViewer';

const Trash = () => {
  const location = useLocation();
  const trashedFiles = useMemo(() => location.state?.trashedFiles || [], [location.state?.trashedFiles]);

  useEffect(() => {
    console.log("Trashed files:", trashedFiles);
  }, [trashedFiles]);

  return (
    <div className="trash">
      <h2 className="trash-title">Trash Files</h2>
      <FileViewer files={trashedFiles} type="trash" />
    </div>
  );
};

export default Trash;
