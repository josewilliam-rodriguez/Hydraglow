import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  fetchBlogs,
  selectAllBlogs,
  selectBlogsStatus,
  selectBlogsError,
  addCommentToBlog,
  clearBlogSubscription
} from '../redux/slices/blogsSlices';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Button,
  Divider,
  CircularProgress,
  Alert,
  Chip,
  Grid,
  IconButton,
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  Avatar,
  Stack
} from '@mui/material';
import {
  CalendarToday,
  Person,
  Comment,
  ArrowBack,
  Favorite,
  Share,
  Bookmark
} from '@mui/icons-material';

const Blogs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const blogs = useSelector(selectAllBlogs);
  const status = useSelector(selectBlogsStatus);
  const error = useSelector(selectBlogsError);
  const [commentText, setCommentText] = useState({});
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogs());

    return () => {
      clearBlogSubscription();
    };
  }, [dispatch]);

  // Filtrar solo los blogs publicados
  const publishedBlogs = blogs.filter(blog => blog.status === 'published');

  const handleCommentSubmit = (blogId) => {
    const text = commentText[blogId]?.trim();
    if (!text) return;

    const comment = {
      text,
      author: 'Usuario Anónimo',
      createdAt: new Date().toISOString()
    };
    
    dispatch(addCommentToBlog({ blogId, comment }));
    setCommentText((prev) => ({ ...prev, [blogId]: '' }));
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedBlog(null);
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
    <>
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
                  onClick={() => handleBlogClick(blog)}
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
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Comment sx={{ fontSize: '16px', mr: 0.5 }} />
                        <Typography variant="caption">
                          {Array.isArray(blog.comments) ? blog.comments.length : 0}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* Dialog de detalle del blog */}
      <Dialog
        open={detailOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh'
          }
        }}
      >
        <AppBar position="sticky" elevation={1} color="default">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleCloseDetail}
              aria-label="close"
            >
              <ArrowBack />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Volver
            </Typography>
            <IconButton color="inherit">
              <Share />
            </IconButton>
            <IconButton color="inherit">
              <Bookmark />
            </IconButton>
          </Toolbar>
        </AppBar>

        <DialogContent sx={{ p: 0 }}>
          {selectedBlog && (
            <Box>
              {selectedBlog.imageUrl && (
                <Box
                  component="img"
                  src={selectedBlog.imageUrl}
                  alt={selectedBlog.title}
                  sx={{
                    width: '100%',
                    maxHeight: 400,
                    objectFit: 'cover'
                  }}
                />
              )}
              
              <Box sx={{ p: 4 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 3 }} flexWrap="wrap">
                  <Chip 
                    icon={<CalendarToday />} 
                    label={new Date(selectedBlog.createdAt).toLocaleDateString('es-ES')} 
                    size="small" 
                    variant="outlined" 
                  />
                  <Chip 
                    icon={<Person />} 
                    label={selectedBlog.author || 'Admin'} 
                    size="small" 
                    variant="outlined" 
                  />
                  {selectedBlog.category && (
                    <Chip 
                      label={selectedBlog.category} 
                      size="small" 
                      color="primary" 
                      variant="filled" 
                    />
                  )}
                </Stack>

                <Typography variant="h3" gutterBottom sx={{ 
                  fontWeight: 'bold',
                  mb: 3
                }}>
                  {selectedBlog.title || 'Sin título'}
                </Typography>

                {selectedBlog.excerpt && (
                  <Typography variant="h6" color="text.secondary" sx={{ 
                    mb: 3,
                    fontStyle: 'italic',
                    borderLeft: '4px solid',
                    borderColor: 'primary.main',
                    pl: 2,
                    py: 1
                  }}>
                    {selectedBlog.excerpt}
                  </Typography>
                )}

                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4,
                    lineHeight: 1.8,
                    fontSize: '1.1rem'
                  }}
                  component="div"
                >
                  {selectedBlog.content ? (
                    selectedBlog.content.split('\n').map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))
                  ) : (
                    'Sin contenido'
                  )}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Comment sx={{ mr: 1 }} />
                  <Typography variant="h5" component="h2">
                    Comentarios ({Array.isArray(selectedBlog.comments) ? selectedBlog.comments.length : 0})
                  </Typography>
                </Box>

                {Array.isArray(selectedBlog.comments) && selectedBlog.comments.length > 0 ? (
                  <Box>
                    {selectedBlog.comments.map((comment, index) => (
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

                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                  <TextField
                    label="Escribe un comentario"
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={commentText[selectedBlog.id] || ''}
                    onChange={(e) =>
                      setCommentText((prev) => ({ ...prev, [selectedBlog.id]: e.target.value }))
                    }
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCommentSubmit(selectedBlog.id);
                      }
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => handleCommentSubmit(selectedBlog.id)}
                    disabled={!commentText[selectedBlog.id]?.trim()}
                    sx={{ minWidth: '120px' }}
                  >
                    Comentar
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Blogs;