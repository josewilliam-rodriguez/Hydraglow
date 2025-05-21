import React, { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  TextField,
  Button,
  Typography,
  Chip,
  MenuItem,
  Checkbox,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from "@mui/material";
import { getImageURL } from "../helpers/mediaUpload";

const ModalProductoAdmin = ({ open = false, onClose, onSave, productToEdit }) => {
  const [producto, setProducto] = useState({ 
    nombre: "", 
    precio: "", 
    categoria: "",
    descripcion: "",
    imagen: "",
    stock: "",
    linea: "cremas hidratantes",
    promocion: "no",
    uso: []
  });
  const [loading, setLoading] = useState(false);

  // Inicializar con datos del producto a editar
  useEffect(() => {
    if (productToEdit) {
      setProducto({
        nombre: productToEdit.nombre || "",
        precio: productToEdit.precio?.toString() || "",
        categoria: productToEdit.categoria || "",
        descripcion: productToEdit.descripcion || "",
        imagen: productToEdit.imagen || "",
        stock: productToEdit.stock?.toString() || "",
        linea: productToEdit.linea || "cremas hidratantes",
        promocion: productToEdit.promocion || "no",
        uso: productToEdit.uso || []
      });
    } else {
      // Resetear formulario para nuevo producto
      setProducto({ 
        nombre: "", 
        precio: "", 
        categoria: "",
        descripcion: "",
        imagen: "",
        stock: "",
        linea: "cremas hidratantes",
        promocion: "no",
        uso: []
      });
    }
  }, [productToEdit, open]); // Añadí open como dependencia para resetear al abrir

  // Configuración de Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        await uploadImageToCloudinary(file);
      }
    }
  });

  // Subir imagen a Cloudinary
  const uploadImageToCloudinary = async (file) => {
    try {
      setLoading(true);
      const imageUrl = await getImageURL(file);
      setProducto(prev => ({...prev, imagen: imageUrl}));
    } catch (error) {
      console.error('Error subiendo imagen:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto(prev => ({ ...prev, [name]: value }));
  };

  const handleUsoChange = (event) => {
    const { value } = event.target;
    setProducto(prev => ({...prev, uso: typeof value === 'string' ? value.split(',') : value}));
  };

  const handleSubmit = async () => {
    // Validaciones
    if (!producto.imagen) {
      alert("Por favor sube una imagen del producto");
      return;
    }

    if (!producto.nombre || !producto.precio || !producto.categoria || !producto.stock) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    const precio = parseFloat(producto.precio);
    const stock = parseInt(producto.stock);

    if (isNaN(precio) || precio <= 0) {
      alert("Ingrese un precio válido mayor a 0");
      return;
    }

    if (isNaN(stock) || stock < 0) {
      alert("Ingrese un stock válido (número entero positivo)");
      return;
    }

    // Preparar datos para enviar
    const productData = {
      ...producto,
      precio,
      stock
    };

    // Llamar a la función onSave proporcionada por el padre
    try {
      setLoading(true);
      await onSave(productData);
      onClose(); // Cerrar el modal después de guardar
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    } finally {
      setLoading(false);
    }
  };

  const usoOptions = ['manos', 'cara', 'piel', 'cuerpo'];

  return (
    <Dialog 
      open={open} 
      onClose={() => !loading && onClose()} // Evitar cerrar mientras carga
      maxWidth="sm" 
      fullWidth
      aria-labelledby="product-dialog-title"
      aria-describedby="product-dialog-description"
    >
      <DialogTitle id="product-dialog-title">
        {productToEdit ? "Editar Producto" : "Agregar Nuevo Producto"}
      </DialogTitle>
      <DialogContent dividers>
        <Box 
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}
          id="product-dialog-description"
        >
          <TextField 
            label="Nombre del producto" 
            name="nombre" 
            value={producto.nombre} 
            onChange={handleChange} 
            fullWidth 
            required
            disabled={loading}
          />
          
          <TextField 
            label="Precio" 
            name="precio" 
            type="number"
            value={producto.precio} 
            onChange={handleChange} 
            fullWidth 
            required
            inputProps={{ min: 0, step: "0.01" }}
            disabled={loading}
          />
          
          <TextField 
            label="Categoría" 
            name="categoria" 
            value={producto.categoria} 
            onChange={handleChange} 
            fullWidth 
            required
            disabled={loading}
          />
          
          <TextField 
            label="Stock" 
            name="stock" 
            type="number"
            value={producto.stock} 
            onChange={handleChange} 
            fullWidth 
            required
            inputProps={{ min: 0 }}
            disabled={loading}
          />
          
          <TextField 
            label="Línea de producto" 
            name="linea" 
            value={producto.linea} 
            onChange={handleChange} 
            fullWidth 
            disabled={loading}
          />
          
          <TextField
            label="Descripción"
            name="descripcion"
            value={producto.descripcion}
            onChange={handleChange}
            multiline
            rows={4}
            fullWidth
            disabled={loading}
          />
          
          <Box 
            {...getRootProps()} 
            sx={{
              border: '2px dashed #ccc',
              p: 3,
              textAlign: 'center',
              cursor: loading ? 'default' : 'pointer',
              backgroundColor: producto.imagen ? 'transparent' : '#f5f5f5',
              opacity: loading ? 0.7 : 1
            }}
            aria-disabled={loading}
          >
            <input {...getInputProps()} disabled={loading} />
            {loading ? (
              <CircularProgress />
            ) : producto.imagen ? (
              <>
                <img 
                  src={producto.imagen} 
                  alt="Preview" 
                  style={{ maxHeight: 100, marginBottom: 10 }} 
                />
                <Typography>Imagen cargada. Haz clic para cambiar</Typography>
              </>
            ) : (
              <Typography>Arrastra la imagen aquí o haz clic para seleccionar</Typography>
            )}
          </Box>
          
          <TextField
            select
            label="¿En promoción?"
            name="promocion"
            value={producto.promocion}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          >
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="si">Sí</MenuItem>
          </TextField>
          
          <TextField
            select
            SelectProps={{
              multiple: true,
              renderValue: (selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )
            }}
            label="Uso recomendado"
            name="uso"
            value={producto.uso}
            onChange={handleUsoChange}
            fullWidth
            disabled={loading}
          >
            {usoOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={producto.uso.includes(option)} />
                <ListItemText primary={option} />
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => !loading && onClose()} disabled={loading}>
          Cancelar
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : productToEdit ? "Actualizar" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalProductoAdmin;