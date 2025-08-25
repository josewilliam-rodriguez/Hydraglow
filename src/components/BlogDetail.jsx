import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBlogs,
  selectAllBlogs
} from '../redux/slices/blogsSlices';
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  Button,
  Chip,
  Stack,
  IconButton
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CalendarToday,
  Person,
  Comment,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Videocam as VideoIcon
} from '@mui/icons-material';

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const blogs = useSelector(selectAllBlogs);
  const navigate = useNavigate();
  const [playingVideo, setPlayingVideo] = useState(null);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const blog = blogs.find((b) => b.id === id);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleVideoPlay = (index) => {
    setPlayingVideo(index);
  };

  const handleVideoPause = () => {
    setPlayingVideo(null);
  };

  if (!blogs.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4, minHeight: '60vh', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!blog) {
    return (
      <Box sx={{ padding: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          No se encontró el blog solicitado.
        </Alert>
        <Button 
          variant="outlined" 
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Volver atrás
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, maxWidth: '900px', margin: '0 auto' }}>
      {/* Botón de volver atrás */}
      <Button 
        variant="outlined" 
        startIcon={<ArrowBackIcon />}
        onClick={handleGoBack}
        sx={{ mb: 3 }}
      >
        Volver atrás
      </Button>

      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        {blog.imageUrl && (
          <CardMedia
            component="img"
            height="400"
            image={blog.imageUrl}
            alt={blog.title}
            sx={{ objectFit: 'cover' }}
          />
        )}
        
        <CardContent sx={{ p: 4 }}>
          {/* Información del blog */}
          <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap">
            <Chip 
              icon={<CalendarToday />} 
              label={new Date(blog.createdAt).toLocaleDateString('es-ES')} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              icon={<Person />} 
              label={blog.author || 'Admin'} 
              size="small" 
              variant="outlined" 
            />
            {blog.category && (
              <Chip 
                label={blog.category} 
                size="small" 
                color="primary" 
                variant="filled" 
              />
            )}
            {blog.tags && blog.tags.map((tag, index) => (
              <Chip 
                key={index} 
                label={tag} 
                size="small" 
                variant="outlined" 
                color="secondary"
              />
            ))}
          </Stack>

          {/* Título */}
          <Typography variant="h3" gutterBottom sx={{ 
            fontWeight: 'bold',
            mb: 3
          }}>
            {blog.title || 'Sin título'}
          </Typography>

          {/* Resumen (si existe) */}
          {blog.excerpt && (
            <Typography variant="h6" color="text.secondary" sx={{ 
              mb: 3,
              fontStyle: 'italic',
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              pl: 2,
              py: 1
            }}>
              {blog.excerpt}
            </Typography>
          )}

          {/* Contenido */}
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4,
              lineHeight: 1.8,
              fontSize: '1.1rem'
            }}
            component="div"
          >
            {blog.content ? (
              blog.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              'Sin contenido'
            )}
          </Typography>

          {/* 🎥 Sección de Videos */}
          {blog.videos && blog.videos.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <VideoIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h5" component="h2">
                  Videos ({blog.videos.length})
                </Typography>
              </Box>

              {blog.videos.map((video, index) => (
                <Box key={index} sx={{ mb: 4, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <VideoIcon sx={{ mr: 1, fontSize: '1.2rem' }} />
                    {video.title || `Video ${index + 1}`}
                  </Typography>
                  
                  <Box sx={{ position: 'relative', display: 'inline-block', width: '100%' }}>
                    <video
                      controls
                      style={{ 
                        width: '100%', 
                        maxHeight: '400px',
                        borderRadius: '8px',
                        backgroundColor: '#000'
                      }}
                      src={video.url}
                      poster={blog.imageUrl}
                      onPlay={() => handleVideoPlay(index)}
                      onPause={handleVideoPause}
                    >
                      Tu navegador no soporta el elemento de video.
                    </video>
                    
                    {playingVideo !== index && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'rgba(0,0,0,0.3)',
                          borderRadius: '8px',
                          cursor: 'pointer'
                        }}
                        onClick={() => {
                          const videoElement = document.querySelector(`video[src="${video.url}"]`);
                          if (videoElement) videoElement.play();
                        }}
                      >
                        <IconButton sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}>
                          <PlayIcon fontSize="large" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                    <Chip 
                      label={video.type === 'short' ? 'Video Corto' : 'Video Largo'} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                    <Chip 
                      label={video.duration} 
                      size="small" 
                      variant="outlined" 
                    />
                    {video.uploadedAt && (
                      <Chip 
                        label={`Subido: ${new Date(video.uploadedAt).toLocaleDateString('es-ES')}`} 
                        size="small" 
                        variant="outlined" 
                      />
                    )}
                  </Box>
                </Box>
              ))}
            </>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Comentarios */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Comment sx={{ mr: 1 }} />
            <Typography variant="h5" component="h2">
              Comentarios ({Array.isArray(blog.comments) ? blog.comments.length : 0})
            </Typography>
          </Box>

          {Array.isArray(blog.comments) && blog.comments.length > 0 ? (
            <Box>
              {blog.comments.map((comment, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    mb: 3, 
                    p: 2, 
                    bgcolor: 'grey.50', 
                    borderRadius: 2,
                    borderLeft: '3px solid',
                    borderColor: 'primary.main'
                  }}
                >
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    "{comment.text}"
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    — Por {comment.author} • {new Date(comment.createdAt).toLocaleDateString('es-ES')}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              No hay comentarios aún. Sé el primero en comentar.
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Botón adicional al final */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
          size="large"
        >
          Volver a los blogs
        </Button>
      </Box>
    </Box>
  );
};

export default BlogDetail;