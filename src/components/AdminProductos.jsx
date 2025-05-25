import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Container,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  addProduct,
  deleteProduct,
  fetchProducts,
  selectAllProducts,
  selectProductsStatus,
  updateProduct,
} from "../redux/slices/productosSlices";
import ModalProductoAdmin from "./ModalProductoAdmin";

const AdminProductos = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const [currentProduct, setCurrentProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Cargar productos
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Abrir modal para nuevo producto
  const handleOpenNew = () => {
    setCurrentProduct(null);
    setOpenDialog(true);
  };

  // Abrir modal para editar producto
  const handleOpenEdit = (product) => {
    setCurrentProduct(product);
    setOpenDialog(true);
  };

  // Cerrar modal
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Función para manejar el guardado (tanto crear como actualizar)
  const handleSaveProduct = async (productData) => {
    try {
      if (currentProduct) {
        await dispatch(
          updateProduct({ id: currentProduct.id, ...productData })
        ).unwrap();
        setSnackbar({
          open: true,
          message: "Producto actualizado con éxito",
          severity: "success",
        });
      } else {
        await dispatch(addProduct(productData)).unwrap();
        setSnackbar({
          open: true,
          message: "Producto agregado con éxito",
          severity: "success",
        });
      }
      setOpenDialog(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error al guardar el producto",
        severity: "error",
      });
    }
  };

  // Eliminar producto
  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      setSnackbar({
        open: true,
        message: "Producto eliminado con éxito",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Error al eliminar el producto",
        severity: "error",
      });
    }
  };

  // Cerrar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        ms={4}
      >
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{

          color: theme.palette.primary.main,

        }} >
          Administración de Productos
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenNew}
        >
          Nuevo Producto
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Promocion</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Descuento</TableCell>
              <TableCell>Total con Descuento</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => {
              // Calcular el precio con descuento (si aplica)
              const precioConDescuento = product.porcentajeDescuento
                ? product.precio * (1 - product.porcentajeDescuento / 100)
                : product.precio;

              return (
                <TableRow key={product.id}>
                  <TableCell>{product.nombre}</TableCell>
                  <TableCell
                    sx={{
                      maxWidth: 300,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {product.descripcion}
                  </TableCell>
                  <TableCell>{product.promocion || "N/A"}</TableCell>
                  <TableCell>
                    ${product.precio ? product.precio.toLocaleString() : "N/A"}
                  </TableCell>
                  <TableCell>
                    {product.porcentajeDescuento
                      ? `${product.porcentajeDescuento}%`
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    $
                    {precioConDescuento.toLocaleString(undefined, {
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell>{product.categoria || "N/A"}</TableCell>
                  <TableCell>{product.stock ?? "N/A"}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Editar">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEdit(product)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(product.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para agregar/editar producto */}
      <ModalProductoAdmin
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveProduct}
        productToEdit={currentProduct}
      />

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminProductos;
