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
  Grid,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  Avatar,
  Chip,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  BarChart as BarChartIcon,
  AttachMoney as AttachMoneyIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
  FilterAlt as FilterIcon,
  Inventory2 as Inventory2Icon,
  LocalOffer as LocalOfferIcon,
  Receipt as ReceiptIcon,
  Insights as InsightsIcon,
  Inventory,
  Inventory2,
  AttachMoney,
  TrendingUp,
  LocalOffer,
  Receipt,
  Insights,
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
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

// Componente MetricCard reutilizable
const MetricCard = ({ icon, title, value, format = (v) => v, percentage, trend, subtitle }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
      height: '100%', 
      borderRadius: '12px', 
      boxShadow: theme.shadows[2],
      transition: 'transform 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-5px)'
      }
    }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Box sx={{
            p: 1.5,
            borderRadius: '50%',
            bgcolor: theme.palette.action.selected,
            display: 'flex',
            color: theme.palette.primary.main
          }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
            <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>
              {format(value)}
              {percentage !== undefined && (
                <Typography 
                  component="span" 
                  variant="body2"
                  color={percentage >= 0 ? 'success.main' : 'error.main'}
                  sx={{ ml: 1 }}
                >
                  {percentage >= 0 ? '↑' : '↓'} {Math.abs(percentage)}%
                </Typography>
              )}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.disabled" display="block">
                {subtitle}
              </Typography>
            )}
            {trend !== undefined && (
              <Box display="flex" alignItems="center" mt={0.5}>
                <TrendingUpIcon 
                  fontSize="small" 
                  color={trend >= 0 ? 'success' : 'error'} 
                  sx={{ mr: 0.5 }} 
                />
                <Typography variant="caption" color={trend >= 0 ? 'success.main' : 'error.main'}>
                  {trend >= 0 ? '+' : ''}{trend}% vs período anterior
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

// Componente AnalysisCard para gráficos
const AnalysisCard = ({ title, description, children }) => {
  const theme = useTheme();
  
  return (
    <Card sx={{ 
      height: '100%', 
      borderRadius: '12px', 
      boxShadow: theme.shadows[1],
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.palette.background.paper
    }}>
      <CardContent sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        padding: theme.spacing(3)
      }}>
        <Box mb={2}>
          <Typography variant="subtitle1" fontWeight={600} color={theme.palette.text.primary}>
            {title}
          </Typography>
          <Typography variant="caption" color={theme.palette.text.secondary}>
            {description}
          </Typography>
        </Box>
        <Box flex={1}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminProductos = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const theme = useTheme();
  
  // Estados
  const [openDialog, setOpenDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [promoFilter, setPromoFilter] = useState("all");
  const [activeTab, setActiveTab] = useState(0);

  // Cargar productos
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Filtros
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.categoria === categoryFilter;
    const matchesPromo = promoFilter === "all" || 
                        (promoFilter === "yes" && product.promocion) || 
                        (promoFilter === "no" && !product.promocion);
    
    return matchesSearch && matchesCategory && matchesPromo;
  });

  // Función para formatear COP
  const formatCOP = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Función para formatear grandes cantidades en COP
  const formatLargeCOP = (value) => {
    if (value >= 1000000) {
      return `${formatCOP(value / 1000000)} M`;
    }
    if (value >= 1000) {
      return `${formatCOP(value / 1000)} K`;
    }
    return formatCOP(value);
  };

  // Métricas de negocio
  const minPrice = products.length > 0 ? Math.min(...products.map(p => p.precio)) : 0;
  const maxPrice = products.length > 0 ? Math.max(...products.map(p => p.precio)) : 0;
  const avgStockPerProduct = products.length > 0 ? (products.reduce((sum, p) => sum + (p.stock || 0), 0) / products.length).toFixed(1) : 0;

  const metrics = {
    totalProducts: products.length,
    totalStock: products.reduce((sum, product) => sum + (product.stock || 0), 0),
    totalValue: products.reduce((sum, product) => sum + (product.precio * (product.stock || 0)), 0),
    avgPrice: products.length > 0 ? products.reduce((sum, product) => sum + product.precio, 0) / products.length : 0,
    productsOnSale: products.filter(p => p.porcentajeDescuento).length,
    estimatedRevenue: products.reduce((sum, product) => {
      const price = product.porcentajeDescuento ? 
                   product.precio * (1 - product.porcentajeDescuento / 100) : 
                   product.precio;
      return sum + (price * (product.stock || 0));
    }, 0),
    minPrice,
    maxPrice,
    avgStockPerProduct,
    productGrowth: 5.2, // Ejemplo - debería venir de tu lógica de negocio
    inventoryValueGrowth: 3.8, // Ejemplo
    sellThroughRate: 15 // Ejemplo de tasa de conversión
  };

  // Datos para gráficos
  const categoryData = [...new Set(products.map(p => p.categoria))].map(cat => ({
    name: cat || "Sin categoría",
    value: products.filter(p => p.categoria === cat).length
  }));

  const topProducts = [...products]
    .sort((a, b) => (b.precio * (b.stock || 0)) - (a.precio * (a.stock || 0)))
    .slice(0, 5)
    .map(p => ({
      name: p.nombre.length > 15 ? p.nombre.substring(0, 15) + '...' : p.nombre,
      value: p.precio * (p.stock || 0)
    }));

  // Colores para gráficos
  const chartColors = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main
  ];

  // Handlers
  const handleOpenNew = () => {
    setCurrentProduct(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = (product) => {
    setCurrentProduct(product);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSaveProduct = async (productData) => {
    try {
      if (currentProduct) {
        await dispatch(updateProduct({ id: currentProduct.id, ...productData })).unwrap();
        setSnackbar({ open: true, message: "Producto actualizado con éxito", severity: "success" });
      } else {
        await dispatch(addProduct(productData)).unwrap();
        setSnackbar({ open: true, message: "Producto agregado con éxito", severity: "success" });
      }
      setOpenDialog(false);
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Error al guardar", severity: "error" });
    }
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteProduct(id)).unwrap();
      setSnackbar({ open: true, message: "Producto eliminado", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: error.message || "Error al eliminar", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  if (status === "loading") {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
          Panel de Gestión de Productos
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleOpenNew}>
          Nuevo Producto
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Listado de Productos" />
        <Tab label="Análisis de Rentabilidad" />
      </Tabs>

      {activeTab === 0 ? (
        <>
          {/* Filtros */}
          <Box display="flex" gap={2} mb={3} flexWrap="wrap">
            <TextField
              label="Buscar productos"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ minWidth: 250 }}
              InputProps={{
                startAdornment: <FilterIcon color="action" sx={{ mr: 1 }} />
              }}
            />
            <TextField
              select
              label="Categoría"
              variant="outlined"
              size="small"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">Todas las categorías</MenuItem>
              {[...new Set(products.map(p => p.categoria))].map(cat => (
                <MenuItem key={cat || "none"} value={cat || "none"}>
                  {cat || "Sin categoría"}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Promoción"
              variant="outlined"
              size="small"
              value={promoFilter}
              onChange={(e) => setPromoFilter(e.target.value)}
              sx={{ minWidth: 180 }}
            >
              <MenuItem value="all">Todos</MenuItem>
              <MenuItem value="yes">Con promoción</MenuItem>
              <MenuItem value="no">Sin promoción</MenuItem>
            </TextField>
          </Box>

          {/* Tabla de productos */}
          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead sx={{ backgroundColor: theme.palette.grey[100] }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>Producto</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Categoría</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Precio</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Descuento</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Precio Final</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Stock</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Valor Total</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredProducts.map((product) => {
                  const precioFinal = product.porcentajeDescuento
                    ? product.precio * (1 - product.porcentajeDescuento / 100)
                    : product.precio;
                  const valorTotal = precioFinal * (product.stock || 0);

                  return (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          {product.imagen && (
                            <Avatar 
                              src={product.imagen} 
                              alt={product.nombre} 
                              sx={{ width: 40, height: 40, mr: 2 }}
                            />
                          )}
                          <Box>
                            <Typography fontWeight="medium">{product.nombre}</Typography>
                            <Typography variant="body2" color="textSecondary" sx={{
                              maxWidth: 300,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}>
                              {product.descripcion}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={product.categoria || "N/A"} 
                          size="small"
                          color="secondary"
                        />
                      </TableCell>
                      <TableCell align="right">
                        {formatCOP(product.precio)}
                      </TableCell>
                      <TableCell align="right">
                        {product.porcentajeDescuento ? (
                          <Chip 
                            label={`${product.porcentajeDescuento}%`} 
                            size="small" 
                            color="primary"
                          />
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">
                          {formatCOP(precioFinal)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">{product.stock || 0}</TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium" color="primary">
                          {formatCOP(valorTotal)}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Editar">
                          <IconButton color="primary" onClick={() => handleOpenEdit(product)}>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton color="error" onClick={() => handleDelete(product.id)}>
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
        </>
      ) : (
        <>
          {/* Sección de Métricas */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: 600,
              color: theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 3
            }}>
              <BarChart fontSize="medium" /> Resumen Financiero
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4} lg={2}>
                <MetricCard 
                  icon={<Inventory fontSize="large" color="primary" />}
                  title="Total Productos"
                  value={metrics.totalProducts}
                  trend={metrics.productGrowth}
                  format={value => value.toLocaleString('es-CO')}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2}>
                <MetricCard 
                  icon={<Inventory2 fontSize="large" color="secondary" />}
                  title="Stock Total"
                  value={metrics.totalStock}
                  format={value => value.toLocaleString('es-CO')}
                  subtitle={`${metrics.avgStockPerProduct} por producto`}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2}>
                <MetricCard 
                  icon={<AttachMoney fontSize="large" color="success" />}
                  title="Valor Inventario"
                  value={metrics.totalValue}
                  format={formatCOP}
                  trend={metrics.inventoryValueGrowth}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2}>
                <MetricCard 
                  icon={<TrendingUp fontSize="large" color="info" />}
                  title="Precio Promedio"
                  value={metrics.avgPrice}
                  format={formatCOP}
                  subtitle={`Rango: ${formatCOP(metrics.minPrice)} - ${formatCOP(metrics.maxPrice)}`}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2}>
                <MetricCard 
                  icon={<LocalOffer fontSize="large" color="warning" />}
                  title="En Promoción"
                  value={metrics.productsOnSale}
                  percentage={Math.round((metrics.productsOnSale / metrics.totalProducts) * 100)}
                />
              </Grid>

              <Grid item xs={12} sm={6} md={4} lg={2}>
                <MetricCard 
                  icon={<Receipt fontSize="large" color="error" />}
                  title="Ingreso Estimado"
                  value={metrics.estimatedRevenue}
                  format={formatLargeCOP}
                  subtitle={`${metrics.sellThroughRate}% tasa conversión`}
                />
              </Grid>
            </Grid>

            {/* Sección de Gráficos */}
            <Typography variant="h5" gutterBottom sx={{ 
              mt: 4,
              fontWeight: 600,
              color: theme.palette.text.primary,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Insights fontSize="medium" /> Análisis Visual
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <AnalysisCard
                  title="Distribución por Categoría"
                  description="Participación de cada categoría en el inventario"
                >
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={50}
                          paddingAngle={3}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {categoryData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={chartColors[index % chartColors.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [value, 'Productos']}
                          contentStyle={{
                            borderRadius: '8px',
                            boxShadow: theme.shadows[3],
                            border: 'none'
                          }}
                        />
                        <Legend 
                          layout="vertical" 
                          verticalAlign="middle" 
                          align="right"
                          wrapperStyle={{ paddingLeft: '20px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </AnalysisCard>
              </Grid>

              <Grid item xs={12} md={6}>
                <AnalysisCard
                  title="Top 5 Productos (Valor en Stock)"
                  description="Productos que más contribuyen al valor total del inventario"
                >
                  <Box height={300}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={topProducts}
                        layout="vertical"
                        margin={{ left: 30, right: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                        <XAxis 
                          type="number" 
                          tickFormatter={(value) => formatCOP(value).replace('$', '').trim()}
                        />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          width={100}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip 
                          formatter={(value) => formatCOP(value)}
                          labelFormatter={(label) => `Producto: ${label}`}
                          contentStyle={{
                            borderRadius: '8px',
                            boxShadow: theme.shadows[3],
                            border: 'none'
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          name="Valor en Stock"
                          radius={[0, 4, 4, 0]}
                        >
                          {topProducts.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`}
                              fill={chartColors[index % chartColors.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </AnalysisCard>
              </Grid>
            </Grid>
          </Box>
        </>
      )}

      {/* Modal */}
      <ModalProductoAdmin
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveProduct}
        productToEdit={currentProduct}
      />

      {/* Notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminProductos;