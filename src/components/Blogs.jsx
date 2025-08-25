import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchBlogs,
  selectAllBlogs,
  selectBlogsStatus,
  selectBlogsError,
  clearBlogSubscription
} from '../redux/slices/blogsSlices';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  Avatar,
  IconButton
} from '@mui/material';
import {
  CalendarToday,
  Person,
  Comment,
  Videocam,
  ArrowForward
} from '@mui/icons-material';

const Blogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blogs = useSelector(selectAllBlogs);
  const status = useSelector(selectBlogsStatus);
  const error = useSelector(selectBlogsError);

  useEffect(() => {
    dispatch(fetchBlogs());

    return () => {
      clearBlogSubscription();
    };
  }, [dispatch]);

  // Filtrar solo los blogs publicados
  const publishedBlogs = blogs.filter(blog => blog.status === 'published');

  const handleBlogClick = (blogId) => {
    // Navegar a la ruta del detalle del blog
    navigate(`/BlogDetail/${blogId}`);
  };

  if (status === 'loading') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4, minHeight: '60vh', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: 4 }}>
        <Alert severity="error">
          Error al cargar los blogs: {error}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 4, maxWidth: '1400px', mx: 'auto' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}>
          Nuestro Blog
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Descubre las últimas novedades y artículos interesantes
        </Typography>
      </Box>
      
      {publishedBlogs.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No hay blogs publicados aún
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Pronto tendremos contenido interesante para ti.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {publishedBlogs.map((blog) => (
            <Grid item xs={12} sm={6} md={4} key={blog.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  }
                }}
                onClick={() => handleBlogClick(blog.id)}
              >
                {blog.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={blog.imageUrl}
                    alt={blog.title}
                    sx={{ objectFit: 'cover' }}
                  />
                )}
                
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
                    <Chip 
                      icon={<CalendarToday sx={{ fontSize: '14px' }} />} 
                      label={new Date(blog.createdAt).toLocaleDateString('es-ES')} 
                      size="small" 
                      variant="outlined" 
                    />
                    {blog.category && (
                      <Chip 
                        label={blog.category} 
                        size="small" 
                        color="primary" 
                      />
                    )}
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ 
                    fontWeight: 'bold',
                    mb: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {blog.title || 'Sin título'}
                  </Typography>

                  {blog.excerpt && (
                    <Typography variant="body2" color="text.secondary" sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {blog.excerpt}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                    <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.8rem' }}>
                      {blog.author ? blog.author.charAt(0) : 'A'}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
                      {blog.author || 'Admin'}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {blog.videos && blog.videos.length > 0 && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Videocam sx={{ fontSize: '16px', mr: 0.5 }} />
                          <Typography variant="caption">
                            {blog.videos.length}
                          </Typography>
                        </Box>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Comment sx={{ fontSize: '16px', mr: 0.5 }} />
                        <Typography variant="caption">
                          {Array.isArray(blog.comments) ? blog.comments.length : 0}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </CardContent>
                
                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton size="small" color="primary">
                    <ArrowForward />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default Blogs;