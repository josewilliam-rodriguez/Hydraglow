import React, { useState } from "react";
import { 
  AppBar, 
  Avatar, 
  Box, 
  Button, 
  Menu, 
  MenuItem, 
  Toolbar, 
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import Logo from "../images/logo_transparente.png";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/currentUsers";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const NavBar = () => {
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector(state => state.currentUser);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const open = Boolean(anchorEl);
   const navigate = useNavigate()
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutUser());
      handleMenuClose();
      setMobileOpen(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Contenido del menú para móvil
  const drawerContent = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem 
          component={Link} 
          to="/productos" 
          onClick={handleDrawerToggle}
          sx={{ color: 'text.primary' }}
        >
          <ListItemText primary="Productos" />
        </ListItem>
                <ListItem 
          component={Link} 
          to="/Blogs" 
          onClick={handleDrawerToggle}
          sx={{ color: 'text.primary' }}
        >
          <ListItemText primary="Blogs
          " />
        </ListItem>
        {loggedInUser ? (
          <>
            <Divider />
            <ListItem 
              onClick={handleLogout}
              sx={{ color: 'text.primary' }}
            >
              <ListItemText primary="Cerrar sesión" />
            </ListItem>
          </>
        ) : (
          <ListItem 
            component={Link} 
            to="/registro" 
            onClick={handleDrawerToggle}
            sx={{ color: 'text.primary' }}
          >
            <ListItemText primary="Ingresar" />
          </ListItem>
        )}
      </List>
    </Box>
  );

  return (
     <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#6D8A63" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Menú hamburguesa (solo móvil) */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo - ahora con useNavigate */}
          <Box 
            sx={{ 
              display: "flex", 
              alignItems: "center", 
              flexGrow: isMobile ? 1 : 0,
              cursor: 'pointer' // Cambia el cursor para indicar que es clickable
            }}
            onClick={() => navigate('/')} // Navegación programática
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={Logo}
                alt="Logo_Hidraglow"
                style={{ height: "2.5rem", width: "auto" }}
              />
              {!isMobile && (
                <Typography variant="h6" sx={{ color: "white", ml: 1 }}>
                  Hidraglow
                </Typography>
              )}
            </Box>
          </Box>

          {/* Menú central (solo desktop) */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2, flexGrow: 1, justifyContent: "center" }}>
              <Button
                component={Link}
                to="/productos"
                color="inherit"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Productos
              </Button>
                            <Button
                component={Link}
                to="/Blogs"
                color="inherit"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                Blogs
              </Button>
            </Box>
          )}

          {/* Menú de usuario */}
          <Box>
            {loggedInUser ? (
              <>
                {isMobile ? (
                  <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: '#C47C4D',
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {loggedInUser.displayName?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                  </IconButton>
                ) : (
                  <Button
                    onClick={handleMenuOpen}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'white',
                      textTransform: 'none'
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 32, 
                        height: 32,
                        bgcolor: '#C47C4D',
                        fontSize: '0.875rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {loggedInUser.displayName?.charAt(0).toUpperCase() || 'U'}
                    </Avatar>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        maxWidth: '120px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {loggedInUser.displayName || 'Usuario'}
                    </Typography>
                  </Button>
                )}
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 180
                    },
                  }}
                >
                  <MenuItem onClick={handleLogout}>
                    <Typography variant="body2">Cerrar sesión</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : !isMobile && (
              <Button
                component={Link}
                to="/registro"
                variant="outlined"
                color="inherit"
                sx={{
                  borderColor: "white",
                  color: "white",
                  fontWeight: "bold",
                  background: "#C47C4D",
                  '&:hover': {
                    backgroundColor: '#B56C3D',
                    borderColor: 'white'
                  }
                }}
              >
                Ingresar
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer para móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 250,
            backgroundColor: theme.palette.background.default
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default NavBar;