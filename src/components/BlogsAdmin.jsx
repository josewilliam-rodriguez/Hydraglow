import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
  selectAllBlogs,
  selectBlogsStatus,
  selectBlogsError
} from '../redux/slices/blogsSlices';
import {
  Box,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Fab,
  Menu,
  MenuItem,
  Divider,
  Avatar,
  Stack,
  Tooltip,
  Paper,
  InputAdornment,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Image as ImageIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  MoreVert as MoreVertIcon,
  CloudUpload as CloudUploadIcon,
  Article as ArticleIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import VideoUploader from './VideoUploa';

// Componentes estilizados
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8]
  }
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  backgroundColor: status === 'published' 
    ? alpha(theme.palette.success.main, 0.1) 
    : alpha(theme.palette.warning.main, 0.1),
  color: status === 'published' 
    ? theme.palette.success.dark 
    : theme.palette.warning.dark,
  fontWeight: 'bold',
  border: `1px solid ${status === 'published' 
    ? theme.palette.success.light 
    : theme.palette.warning.light}`
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: 20,
  textTransform: 'none',
  fontWeight: 600,
  padding: '8px 16px'
}));

const BlogsAdmin = () => {
  const dispatch = useDispatch();
  const blogs = useSelector(selectAllBlogs);
  const status = useSelector(selectBlogsStatus);
  const error = useSelector(selectBlogsError);
  const navigate = useNavigate();

  // Estados para el formulario
  const [openDialog, setOpenDialog] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    category: '',
    tags: '',
    status: 'draft'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  // Filtrado y ordenación
  const filteredBlogs = blogs
    .filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           blog.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || blog.status === filterStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

  // 🖼️ Función para subir imagen a Cloudinary
  const uploadImageToCloudinary = async (file) => {
    const imagen = new FormData();
    imagen.append('upload_preset', 'Hidraglow-preset');
    imagen.append('file', file);
    imagen.append('folder', 'blogs');

    try {
      setImageUploading(true);
      const resp = await fetch('https://api.cloudinary.com/v1_1/duqoqmq8i/upload', {
        method: 'POST',
        body: imagen
      });

      if (!resp.ok) {
        const errorData = await resp.json();
        throw new Error(errorData.error?.message || 'Error al subir imagen');
      }

      const data = await resp.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setImageUploading(false);
    }
  };

  // 📝 Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let imageUrl = formData.imageUrl;
      
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile);
      }

      const blogData = {
        ...formData,
        imageUrl,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        updatedAt: new Date().toISOString()
      };

      if (editingBlog) {
        dispatch(updateBlog({ id: editingBlog.id, ...blogData }));
      } else {
        dispatch(addBlog({
          ...blogData,
          author: 'Admin',
          createdAt: new Date().toISOString()
        }));
      }

      resetForm();
      setOpenDialog(false);
    } catch (error) {
      console.error('Error saving blog:', error);
    }
  };

  // 🧹 Limpiar formulario
  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      category: '',
      tags: '',
      status: 'draft'
    });
    setImageFile(null);
    setEditingBlog(null);
  };

  // ✏️ Abrir formulario para editar
  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      imageUrl: blog.imageUrl || '',
      category: blog.category || '',
      tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : '',
      status: blog.status || 'draft'
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  // 🗑️ Eliminar blog
  const handleDelete = (blogId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este blog?')) {
      dispatch(deleteBlog(blogId));
    }
    handleMenuClose();
  };

  // 📱 Manejar menú contextual
  const handleViewBlog = (blog) => {
    setAnchorEl(null);
    navigate(`/BlogDetail/${blog.id}`);
  };

  const handleMenuClick = (event, blog) => {
    setAnchorEl(event.currentTarget);
    setSelectedBlog(blog);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedBlog(null);
  };

  // Obtener estadísticas
  const publishedCount = blogs.filter(blog => blog.status === 'published').length;
  const draftCount = blogs.filter(blog => blog.status === 'draft').length;

  if (status === 'loading') {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: '1400px', mx: 'auto' }}>
      {/* Header con estadísticas */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              <ArticleIcon sx={{ mr: 1, fontSize: '2rem' }} />
              Gestión de Blogs
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Administra y crea contenido para tu blog
            </Typography>
          </Box>
          
          <Fab
            color="primary"
            onClick={() => {
              resetForm();
              setOpenDialog(true);
            }}
            sx={{ boxShadow: 3 }}
          >
            <AddIcon />
          </Fab>
        </Box>

        {/* Estadísticas */}
        <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2 }}>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color="primary">
              {blogs.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total de blogs
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color="success.main">
              {publishedCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Publicados
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center', flex: 1 }}>
            <Typography variant="h4" fontWeight="bold" color="warning.main">
              {draftCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Borradores
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Barra de búsqueda y filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Buscar blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              select
              label="Filtrar por estado"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="published">Publicados</MenuItem>
              <MenuItem value="draft">Borradores</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={6} md={3}>
            <TextField
              fullWidth
              select
              label="Ordenar por"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="newest">Más recientes</MenuItem>
              <MenuItem value="oldest">Más antiguos</MenuItem>
              <MenuItem value="title">Título (A-Z)</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Lista de Blogs */}
      <Grid container spacing={3}>
        {filteredBlogs.length === 0 ? (
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minHeight="300px"
              bgcolor="grey.50"
              borderRadius={2}
            >
              <ArticleIcon sx={{ fontSize: '4rem', color: 'grey.400', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No se encontraron blogs
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {searchTerm || filterStatus !== 'all' 
                  ? 'Intenta ajustar los filtros de búsqueda' 
                  : 'Crea tu primer artículo para comenzar'}
              </Typography>
              <ActionButton
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  resetForm();
                  setOpenDialog(true);
                }}
              >
                Crear Blog
              </ActionButton>
            </Box>
          </Grid>
        ) : (
          filteredBlogs.map((blog) => (
            <Grid item xs={12} md={6} lg={4} key={blog.id}>
              <StyledCard>
                {blog.imageUrl ? (
                  <CardMedia
                    component="img"
                    height="200"
                    image={blog.imageUrl}
                    alt={blog.title}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Box 
                    sx={{ 
                      height: 200, 
                      bgcolor: 'grey.100', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <ImageIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                  </Box>
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <StatusChip 
                      label={blog.status === 'published' ? 'Publicado' : 'Borrador'} 
                      status={blog.status}
                      size="small"
                    />
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, blog)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography variant="h6" component="h2" gutterBottom noWrap>
                    {blog.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      mb: 2
                    }}
                  >
                    {blog.excerpt || blog.content.substring(0, 150) + '...'}
                  </Typography>

                  {blog.category && (
                    <Chip 
                      label={blog.category} 
                      variant="outlined" 
                      size="small" 
                      sx={{ mr: 1, mb: 1 }} 
                    />
                  )}

                  {blog.tags && blog.tags.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {blog.tags.slice(0, 2).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                        />
                      ))}
                      {blog.tags.length > 2 && (
                        <Chip
                          label={`+${blog.tags.length - 2}`}
                          size="small"
                          variant="outlined"
                          sx={{ mr: 0.5, mb: 0.5, fontSize: '0.7rem' }}
                        />
                      )}
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                  <Stack direction="row" spacing={1} alignItems="center" width="100%">
                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.8rem' }}>
                      {blog.author ? blog.author.charAt(0) : 'A'}
                    </Avatar>
                    <Typography variant="caption" color="text.secondary" sx={{ flexGrow: 1 }}>
                      {blog.createdAt ? 
                        new Date(blog.createdAt).toLocaleDateString('es-ES') : 
                        'Sin fecha'
                      }
                    </Typography>
                    <Tooltip title="Ver blog">
                      <IconButton size="small" onClick={() => handleViewBlog(blog)}>
                        <ViewIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </CardActions>
              </StyledCard>
            </Grid>
          ))
        )}
      </Grid>

      {/* Menú Contextual */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleEdit(selectedBlog)}>
          <EditIcon sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => handleViewBlog(selectedBlog)}>
          <ViewIcon sx={{ mr: 1 }} />
          Ver publicación
        </MenuItem>
        <Divider />
        <MenuItem 
          onClick={() => handleDelete(selectedBlog?.id)}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ mr: 1 }} />
          Eliminar
        </MenuItem>
      </Menu>

      {/* Dialog para Crear/Editar */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle sx={{ 
            bgcolor: 'primary.main', 
            color: 'white',
            display: 'flex',
            alignItems: 'center'
          }}>
            {editingBlog ? (
              <>
                <EditIcon sx={{ mr: 1 }} />
                Editar Blog
              </>
            ) : (
              <>
                <AddIcon sx={{ mr: 1 }} />
                Crear Nuevo Blog
              </>
            )}
          </DialogTitle>
          
          <DialogContent dividers sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Título *"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Categoría"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  select
                  label="Estado"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  SelectProps={{
                    native: true,
                  }}
                  variant="outlined"
                >
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Resumen"
                  multiline
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  helperText="Breve descripción del artículo que se mostrará en listados"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Contenido *"
                  multiline
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  required
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  helperText="Separados por comas (ej: tecnología, web, diseño)"
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <Paper 
                  variant="outlined" 
                  sx={{ 
                    p: 2, 
                    border: '2px dashed',
                    borderColor: 'grey.300',
                    borderRadius: 1,
                    textAlign: 'center'
                  }}
                >
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="image-upload"
                    type="file"
                    onChange={(e) => setImageFile(e.target.files[0])}
                  />
                  <label htmlFor="image-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      disabled={imageUploading}
                    >
                      {imageUploading ? 'Subiendo...' : 'Seleccionar Imagen'}
                    </Button>
                  </label>
                  
                  {imageFile && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Archivo seleccionado: {imageFile.name}
                    </Typography>
                  )}
                  
                  {formData.imageUrl && (
                    <Box sx={{ mt: 2 }}>
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        style={{ 
                          width: '100%', 
                          maxHeight: '200px', 
                          objectFit: 'cover',
                          borderRadius: '4px'
                        }} 
                      />
                      <Grid item xs={12}>
  <VideoUploader
    blogId={editingBlog?.id} 
    existingVideos={editingBlog?.videos || []}
  />
</Grid>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          
          <DialogActions sx={{ p: 2 }}>
            <ActionButton 
              onClick={() => setOpenDialog(false)}
              startIcon={<CancelIcon />}
            >
              Cancelar
            </ActionButton>
            <ActionButton 
              type="submit" 
              variant="contained" 
              disabled={imageUploading}
              startIcon={<SaveIcon />}
            >
              {editingBlog ? 'Actualizar' : 'Publicar'}
            </ActionButton>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default BlogsAdmin;