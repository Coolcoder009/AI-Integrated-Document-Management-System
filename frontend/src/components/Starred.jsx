import React, { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import FileViewer from './FileViewer';

const Starred = () => {
  const location = useLocation();
  const starredFiles = useMemo(() => location.state?.starredFiles || [], [location.state?.starredFiles]);

  useEffect(() => {
    console.log("Starred files:", starredFiles);
  }, [starredFiles]);

  return (
    <div className="starred">
      <h2 className="starred-title">Starred Files</h2>
      <FileViewer files={starredFiles} type="starred" />
    </div>
  );
};

export default Starred;
