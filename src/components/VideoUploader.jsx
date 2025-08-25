import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { 
  addVideoToBlog, 
  removeVideoFromBlog
} from '../redux/slices/blogsSlices';
import { getMediaURL } from '../helpers/mediaUpload';
import {
  Box,
  Button,
  LinearProgress,
  Typography,
  IconButton,
  Paper,
  Alert,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Videocam as VideoIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

const VideoUploader = ({ blogId, existingVideos = [] }) => {
  const dispatch = useDispatch();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  const handleVideoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Validar tipo y tamaño del video
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    const maxSize = 100 * 1024 * 1024; // 100MB
    
    if (!validTypes.includes(file.type)) {
      setUploadError('Formato de video no válido. Use MP4, WebM u OGG.');
      return;
    }
    
    if (file.size > maxSize) {
      setUploadError('El video es demasiado grande. Máximo 100MB.');
      return;
    }
    
    setUploading(true);
    setUploadError(null);
    setUploadProgress(0);
    setUploadSuccess(false);
    
    try {
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 300);
      
      const videoUrl = await getMediaURL(file, 'video');
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      const videoType = file.size < 20 * 1024 * 1024 ? 'short' : 'long';
      
      dispatch(addVideoToBlog({ 
        blogId, 
        videoUrl, 
        videoType,
        title: file.name.replace(/\.[^/.]+$/, ""),
        duration: '0:00'
      }));
      
      setUploadSuccess(true);
      
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadSuccess(false);
      }, 2000);
      
    } catch (error) {
      console.error('Error uploading video:', error);
      setUploadError('Error al subir el video: ' + error.message);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleOpenDeleteDialog = (videoUrl) => {
    setVideoToDelete(videoUrl);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setVideoToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (videoToDelete) {
      dispatch(removeVideoFromBlog({ blogId, videoUrl: videoToDelete }));
      setDeleteDialogOpen(false);
      setVideoToDelete(null);
    }
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Videos del Blog
      </Typography>
      
      {uploadError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError(null)}>
          {uploadError}
        </Alert>
      )}
      
      {uploadSuccess && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Video subido exitosamente!
        </Alert>
      )}
      
      {/* Mostrar videos existentes */}
      {existingVideos.map((video, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2, display: 'flex', alignItems: 'center' }}>
          <VideoIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">
              {video.title || `Video ${index + 1}`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip 
                label={video.type === 'short' ? 'Corto' : 'Largo'} 
                size="small" 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                label={video.duration} 
                size="small" 
                variant="outlined" 
              />
            </Box>
            <Typography variant="caption" display="block" color="text.secondary" noWrap>
              {video.url.substring(0, 40)}...
            </Typography>
          </Box>
          <IconButton 
            color="error" 
            onClick={() => handleOpenDeleteDialog(video.url)} // ✅ Pasar la URL en lugar del índice
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </Paper>
      ))}
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <Typography>¿Estás seguro de que quieres eliminar este video?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Subida de nuevos videos */}
      <input
        accept="video/mp4,video/webm,video/ogg,video/quicktime"
        style={{ display: 'none' }}
        id={`video-upload-${blogId}`}
        type="file"
        onChange={handleVideoUpload}
        disabled={uploading}
      />
      <label htmlFor={`video-upload-${blogId}`}>
        <Button
          variant="outlined"
          component="span"
          startIcon={uploading ? <></> : <CloudUploadIcon />}
          disabled={uploading}
          fullWidth
          sx={{ mb: 2 }}
        >
          {uploading ? `Subiendo... ${uploadProgress}%` : 'Subir Video'}
        </Button>
      </label>
      
      {uploading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress 
            variant="determinate" 
            value={uploadProgress} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      )}
      
      <Typography variant="caption" display="block" color="text.secondary">
        Formatos: MP4, WebM, OGG, MOV. Máx: 100MB
      </Typography>
    </Box>
  );
};

export default VideoUploader