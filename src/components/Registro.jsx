import { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  useTheme, 
  useMediaQuery, 
  CircularProgress, 
  Alert,
  Snackbar,
  Backdrop
} from '@mui/material';
import { keyframes } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { emailLogin, emailRegister, setError } from '../redux/slices/currentUsers';

// Animación de entrada
const fadeSlide = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Esquema de validación con Yup
const validationSchema = Yup.object().shape({
  nombre: Yup.string().required("Campo requerido"),
  email: Yup.string().email("Email inválido").required("Campo requerido"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Campo requerido"),
});

const Registro = () => {
  const [isLogin, setIsLogin] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch();
  const { error, loading } = useSelector(state => state.currentUser);
  const [successMessage, setSuccessMessage] = useState('');
  const [loginProgress, setLoginProgress] = useState(false);

  const handleSubmit = async (values, { setSubmitting }) => {
    setSubmitting(true);
    setSuccessMessage('');
    
    if (isLogin) {
      setLoginProgress(true);
    }
    
    try {
      if (isLogin) {
        await dispatch(emailLogin({
          email: values.email,
          password: values.password
        })).unwrap();
      } else {
        await dispatch(emailRegister({
          nombre: values.nombre,
          email: values.email,
          password: values.password
        })).unwrap();
        setSuccessMessage('¡Registro exitoso!');
      }
    } catch (error) {
      // El error ya está manejado en el slice
    } finally {
      setSubmitting(false);
      setLoginProgress(false);
    }
  };

  return (
    <Box
      sx={{
        width: isSmallScreen ? '90%' : '350px',
        margin: 'auto',
        mt: isSmallScreen ? 4 : 6,
        padding: isSmallScreen ? '1.5rem' : '2rem',
        textAlign: 'center',
        backgroundColor: '#fff',
        borderRadius: 2,
        boxShadow: 3,
        animation: `${fadeSlide} 0.5s ease-out`,
        position: 'relative'
      }}
    >
      {/* Backdrop para el login */}
      <Backdrop
        sx={{ 
          color: '#fff', 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          position: 'absolute',
          borderRadius: 2,
          backgroundColor: 'rgba(0, 0, 0, 0.5)'
        }}
        open={loginProgress}
      >
        <Box textAlign="center">
          <CircularProgress color="inherit" />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Ingresando a tu cuenta...
          </Typography>
        </Box>
      </Backdrop>

      <Typography 
        variant={isSmallScreen ? 'h6' : 'h5'} 
        sx={{ 
          fontWeight: 'bold', 
          mb: 2, 
          color: '#333',
          fontSize: isSmallScreen ? '1.25rem' : '1.5rem'
        }}
      >
        {isLogin ? 'Iniciar Sesión' : 'Registro'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {successMessage}
        </Alert>
      )}

      <Formik
        initialValues={{ nombre: '', email: '', password: '' }}
        validationSchema={isLogin ? validationSchema.omit(['nombre']) : validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: isSmallScreen ? 1.5 : 2 
            }}>
              {!isLogin && (
                <Field
                  name="nombre"
                  as={TextField}
                  label="Nombre completo"
                  variant="outlined"
                  fullWidth
                  size={isSmallScreen ? 'small' : 'medium'}
                  sx={{ 
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1,
                    }
                  }}
                  error={touched.nombre && Boolean(errors.nombre)}
                  helperText={touched.nombre && errors.nombre}
                />
              )}
              
              <Field
                name="email"
                as={TextField}
                label="Correo electrónico"
                variant="outlined"
                fullWidth
                size={isSmallScreen ? 'small' : 'medium'}
                sx={{ 
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
              
              <Field
                name="password"
                as={TextField}
                label="Contraseña"
                type="password"
                variant="outlined"
                fullWidth
                size={isSmallScreen ? 'small' : 'medium'}
                sx={{ 
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 1,
                  }
                }}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
              
              <Button 
                type="submit" 
                variant="contained" 
                disabled={isSubmitting || loading}
                fullWidth
                sx={{
                  mt: isSmallScreen ? 1 : 2,
                  py: isSmallScreen ? 1 : 1.5,
                  borderColor: "white",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: isSmallScreen ? "0.875rem" : "1rem",
                  background: "#C47C4D",
                  '&:hover': {
                    background: "#B56C3D",
                  },
                  borderRadius: 1,
                  height: '48px',
                  position: 'relative'
                }}
              >
                {(isSubmitting && isLogin) ? (
                  <CircularProgress 
                    size={24} 
                    sx={{ 
                      color: 'white',
                      position: 'absolute',
                      left: '50%',
                      transform: 'translateX(-50%)'
                    }} 
                  />
                ) : isSubmitting ? "Procesando..." : isLogin ? "Iniciar sesión" : "Registrarse"}
              </Button>
              
              <Button 
                onClick={() => {
                  setIsLogin(!isLogin);
                  dispatch(setError(null));
                }} 
                variant="text" 
                sx={{ 
                  mt: 1,
                  fontSize: isSmallScreen ? "0.75rem" : "0.875rem",
                  textTransform: 'none',
                  color: '#666',
                }}
              >
                {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      {/* Snackbar para feedback adicional */}
      <Snackbar
        open={loginProgress}
        message="Verificando tus credenciales..."
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
};

export default Registro;