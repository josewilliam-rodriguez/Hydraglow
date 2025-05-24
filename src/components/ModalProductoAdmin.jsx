import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
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
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { getImageURL } from "../helpers/mediaUpload";

// Opciones para los campos de selección
const lineaOptions = [
  "cremas hidratantes",
  "jabones artesanales",
  "serums faciales",
  "otros",
];
const promocionOptions = ["no", "si"];
const usoOptions = ["manos", "cara", "piel", "cuerpo"];

const formatCOP = (value) => {
  if (!value) return "$0";
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  })
    .format(value)
    .replace("COP", "")
    .trim();
};

const parseCOP = (value) => {
  return parseFloat(value.replace(/[^\d]/g, "")) || 0;
};

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  nombre: Yup.string().required("El nombre es requerido"),
  precio: Yup.number()
    .required("El precio es requerido")
    .min(1000, "El precio mínimo es $1.000 COP")
    .test(
      "precio-con-descuento",
      "El precio con descuento debe ser mayor a 0",
      function (value) {
        if (this.parent.promocion === "si") {
          return value * (1 - this.parent.porcentajeDescuento / 100) > 0;
        }
        return true;
      }
    ),
  categoria: Yup.string().required("La categoría es requerida"),
  contacto: Yup.string()
    .required("El contacto es requerido")
    .matches(/^\d{10,15}$/, "Debe ser un número válido (10-15 dígitos)"),
  descripcion: Yup.string(),
  imagen: Yup.string().required("La imagen es requerida"),
  stock: Yup.number()
    .required("El stock es requerido")
    .integer("Debe ser un número entero")
    .min(0, "El stock no puede ser negativo")
    .typeError("Debe ser un número válido"),
  linea: Yup.string().oneOf(lineaOptions),
  promocion: Yup.string()
    .oneOf(promocionOptions)
    .required("Este campo es requerido"),
  porcentajeDescuento: Yup.number().test(
    "descuento-requerido",
    "El porcentaje de descuento es requerido (1-100%)",
    function (value) {
      if (this.parent.promocion === "si") {
        return (
          value !== undefined && value !== null && value >= 1 && value <= 100
        );
      }
      return true;
    }
  ),
  uso: Yup.array().of(Yup.string().oneOf(usoOptions)),
});

const ModalProductoAdmin = ({
  open = false,
  onClose,
  onSave,
  productToEdit,
}) => {
  const [loading, setLoading] = useState(false);

  // Configuración de Formik
  const formik = useFormik({
    initialValues: {
      nombre: productToEdit?.nombre || "",
      precio: productToEdit?.precio?.toString() || "",
      categoria: productToEdit?.categoria || "",
      descripcion: productToEdit?.descripcion || "",
      imagen: productToEdit?.imagen || "",
      stock: productToEdit?.stock?.toString() || "",
      linea: productToEdit?.linea || "cremas hidratantes",
      promocion: productToEdit?.promocion || "no",
      porcentajeDescuento: productToEdit?.porcentajeDescuento || 0,
      uso: productToEdit?.uso || [],
      contacto: productToEdit?.contacto || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setLoading(true);

        // Limpiar y parsear valores numéricos
        const precioBase = parseCOP(values.precio); // Precio original sin descuento
        const descuento =
          values.promocion === "si"
            ? parseFloat(values.porcentajeDescuento)
            : 0;

        const productData = {
          ...values,
          precio: precioBase, // Siempre guardar el precio base sin descuento
          porcentajeDescuento: descuento, // Guardar solo el porcentaje
          stock: parseInt(values.stock) || 0,
        };

        await onSave(productData);
        onClose();
      } catch (error) {
        console.error("Error al guardar el producto:", error);
        // Opcional: Mostrar error al usuario
        formik.setStatus({ submitError: error.message });
      } finally {
        setLoading(false);
      }
    },
  });

  // Configuración de Dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        try {
          setLoading(true);
          const file = acceptedFiles[0];
          const imageUrl = await getImageURL(file);
          formik.setFieldValue("imagen", imageUrl);
        } catch (error) {
          console.error("Error subiendo imagen:", error);
          formik.setFieldError("imagen", "Error al subir la imagen");
        } finally {
          setLoading(false);
        }
      }
    },
  });

  const handleUsoChange = (event) => {
    const { value } = event.target;
    formik.setFieldValue(
      "uso",
      typeof value === "string" ? value.split(",") : value
    );
  };

  // Manejar cambio de precio con formato
  const handlePrecioChange = (e) => {
    const rawValue = e.target.value.replace(/[^\d]/g, "");
    formik.setFieldValue("precio", rawValue);
  };

  // Obtener precio formateado para mostrar
  const precioFormateado = formatCOP(formik.values.precio || 0);
  return (
    <Dialog
      open={open}
      onClose={() => !loading && onClose()}
      maxWidth="sm"
      fullWidth
      aria-labelledby="product-dialog-title"
    >
      <DialogTitle id="product-dialog-title">
        {productToEdit ? "Editar Producto" : "Agregar Nuevo Producto"}
      </DialogTitle>
      <DialogContent dividers>
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, p: 1 }}
          onSubmit={formik.handleSubmit}
          noValidate
        >
          {/* Campo Nombre */}
          <TextField
            label="Nombre del producto"
            name="nombre"
            value={formik.values.nombre}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.nombre && Boolean(formik.errors.nombre)}
            helperText={formik.touched.nombre && formik.errors.nombre}
            fullWidth
            required
            disabled={loading}
          />

          {/* Campo Precio */}
          <TextField
            label="Precio (COP)"
            name="precio"
            value={precioFormateado}
            onChange={handlePrecioChange}
            onBlur={formik.handleBlur}
            error={formik.touched.precio && Boolean(formik.errors.precio)}
            helperText={formik.touched.precio && formik.errors.precio}
            fullWidth
            required
            disabled={loading}
          />

          {/* Campo Categoría */}
          <TextField
            label="Categoría"
            name="categoria"
            value={formik.values.categoria}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.categoria && Boolean(formik.errors.categoria)}
            helperText={formik.touched.categoria && formik.errors.categoria}
            fullWidth
            required
            disabled={loading}
          />

          {/* Campo Stock */}
          <TextField
            label="Stock"
            name="stock"
            type="number"
            value={formik.values.stock}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.stock && Boolean(formik.errors.stock)}
            helperText={formik.touched.stock && formik.errors.stock}
            fullWidth
            required
            inputProps={{ min: 0 }}
            disabled={loading}
          />
          <TextField
            label="Contacto"
            fullWidth
            type="tel"
            margin="dense"
            name="contacto"
            value={formik.values.contacto}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.contacto && Boolean(formik.errors.contacto)}
            helperText={formik.touched.contacto && formik.errors.contacto}
            required
            inputProps={{ pattern: "[0-9]{10,15}" }}
          />
          {/* Campo Línea de producto */}
          <TextField
            select
            label="Línea de producto"
            name="linea"
            value={formik.values.linea}
            onChange={formik.handleChange}
            fullWidth
            disabled={loading}
          >
            {lineaOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>

          {/* Campo Descripción */}
          <TextField
            label="Descripción"
            name="descripcion"
            value={formik.values.descripcion}
            onChange={formik.handleChange}
            multiline
            rows={4}
            fullWidth
            disabled={loading}
          />

          {/* Campo Imagen */}
          <Box>
            <Box
              {...getRootProps()}
              sx={{
                border: "2px dashed #ccc",
                p: 3,
                textAlign: "center",
                cursor: loading ? "default" : "pointer",
                backgroundColor: formik.values.imagen
                  ? "transparent"
                  : "#f5f5f5",
                opacity: loading ? 0.7 : 1,
              }}
              aria-disabled={loading}
            >
              <input {...getInputProps()} disabled={loading} />
              {loading ? (
                <CircularProgress />
              ) : formik.values.imagen ? (
                <>
                  <img
                    src={formik.values.imagen}
                    alt="Preview"
                    style={{ maxHeight: 100, marginBottom: 10 }}
                  />
                  <Typography>Imagen cargada. Haz clic para cambiar</Typography>
                </>
              ) : (
                <Typography>
                  Arrastra la imagen aquí o haz clic para seleccionar
                </Typography>
              )}
            </Box>
            {formik.touched.imagen && formik.errors.imagen && (
              <FormHelperText error>{formik.errors.imagen}</FormHelperText>
            )}
          </Box>

          {/* Campo Promoción */}
          <TextField
            select
            label="¿En promoción?"
            name="promocion"
            value={formik.values.promocion}
            onChange={(e) => {
              formik.handleChange(e);
              if (e.target.value === "no") {
                formik.setFieldValue("porcentajeDescuento", 0);
              }
            }}
            fullWidth
            disabled={loading}
          >
            {promocionOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option === "si" ? "Sí" : "No"}
              </MenuItem>
            ))}
          </TextField>

          {formik.values.promocion === "si" && (
            <TextField
              label="Porcentaje de descuento (%)"
              name="porcentajeDescuento"
              type="number"
              value={formik.values.porcentajeDescuento}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.porcentajeDescuento &&
                Boolean(formik.errors.porcentajeDescuento)
              }
              helperText={
                formik.touched.porcentajeDescuento &&
                formik.errors.porcentajeDescuento
              }
              fullWidth
              required
              inputProps={{ min: 1, max: 100 }}
              disabled={loading}
              sx={{ mt: 2 }}
            />
          )}

          {/* Mostrar precio con descuento */}
          {formik.values.promocion === "si" && formik.values.precio && (
            <Typography variant="body1" sx={{ mt: 1, fontWeight: "bold" }}>
              Precio con descuento:{" "}
              {formatCOP(
                parseCOP(formik.values.precio) *
                  (1 - (formik.values.porcentajeDescuento || 0) / 100)
              )}
            </Typography>
          )}

          {/* Campo Uso recomendado */}
          <TextField
            select
            SelectProps={{
              multiple: true,
              renderValue: (selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              ),
            }}
            label="Uso recomendado"
            name="uso"
            value={formik.values.uso}
            onChange={handleUsoChange}
            fullWidth
            disabled={loading}
          >
            {usoOptions.map((option) => (
              <MenuItem key={option} value={option}>
                <Checkbox checked={formik.values.uso.includes(option)} />
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
          onClick={formik.handleSubmit}
          disabled={loading || !formik.isValid}
        >
          {loading ? (
            <CircularProgress size={24} />
          ) : productToEdit ? (
            "Actualizar"
          ) : (
            "Guardar"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ModalProductoAdmin;
