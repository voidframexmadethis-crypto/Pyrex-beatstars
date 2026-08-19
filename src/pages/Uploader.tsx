import React from 'react';
import { Navigate } from 'react-router-dom';
import BeatUploader from '../components/BeatUploader';

interface UploaderProps {
  trackToEdit?: any;
  onClose?: () => void;
}

export default function Uploader({ trackToEdit, onClose }: UploaderProps) {
  const isAdmin = localStorage.getItem('PYREX_ADMIN_AUTH') === 'true';
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-black">
      <BeatUploader trackToEdit={trackToEdit} onClose={onClose} />
    </div>
  );
}

