import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Toolbar,
  Typography,
  Modal,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import ModalProductoAdmin from "./ModalProductoAdmin";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserAction } from "../redux/slices/currentUsers";
import { useNavigate } from "react-router-dom";
import Logo from "../images/logo_transparente.png";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const NavBarAdmin = () => {
  const [openAdminModal, setOpenAdminModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const { loggedInUser } = useSelector((state) => state.currentUser);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logoutUserAction());
      handleMenuClose();
      setMobileOpen(false);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleOpenProductModal = () => {
    setOpenAdminModal(true);
    if (isMobile) {
      setMobileOpen(false); // Cerrar el drawer en móvil
    }
  };

  // Elementos del menú para el drawer móvil
  const drawerItems = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        <ListItem
          onClick={() => {
            navigate("/AdminProductos");
            setMobileOpen(false);
          }}
          sx={{
            "&:hover": {
              backgroundColor: "action.hover",
              cursor: "pointer",
            },
          }}
        >
          <ListItemText primary="Productos" />
        </ListItem>
        
        <ListItem
          onClick={() => {
            navigate("/admin/usuarios");
            setMobileOpen(false);
          }}
          sx={{
            "&:hover": {
              backgroundColor: "action.hover",
              cursor: "pointer",
            },
          }}
        >
          <ListItemText primary="Usuarios" />
        </ListItem>
        
        <ListItem
          onClick={handleOpenProductModal}
          sx={{
            "&:hover": {
              backgroundColor: "action.hover",
              cursor: "pointer",
            },
          }}
        >
          <ListItemText primary="Agregar Producto" />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem
          onClick={handleLogout}
          sx={{
            "&:hover": {
              backgroundColor: "action.hover",
              cursor: "pointer",
            },
          }}
        >
          <ListItemText primary="Cerrar Sesión" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#B56C3D" }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {/* Menú hamburguesa para móvil */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              flexGrow: isMobile ? 1 : 0,
              cursor: "pointer",
            }}
            onClick={() => navigate("/")}
            onKeyDown={(e) => e.key === 'Enter' && navigate("/")}
            tabIndex={0}
            role="button"
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
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

          {/* Botones de navegación en desktop */}
          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2, flexGrow: 1, justifyContent: "center" }}>
              <Button
                onClick={() => navigate("/AdminProductos")}
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
              
            {isMobile && (  <Button
                onClick={handleOpenProductModal}
                color="inherit"
                startIcon={<AddIcon />}
                sx={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    
                  }
                }}
              >
              </Button> )}
            </Box>
          )}

          {/* Botón agregar producto - solo icono en móvil */}
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleOpenProductModal}
              sx={{ mr: 1 }}
              aria-label="Agregar producto"
            >
              <AddIcon />
            </IconButton>
          )}

          {/* Menú de usuario */}
          <Box>
            <IconButton
              onClick={handleMenuOpen}
              sx={{ p: 0 }}
              aria-controls="user-menu"
              aria-haspopup="true"
              aria-label="Menú de usuario"
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#6D8A63",
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                }}
              >
                {loggedInUser?.displayName?.charAt(0).toUpperCase() || "A"}
              </Avatar>
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 1.5,
                  minWidth: 180,
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleLogout}>
                <Typography variant="body2">Cerrar sesión</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer para menú en móvil */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { 
            boxSizing: "border-box", 
            width: 250,
            backgroundColor: theme.palette.background.default
          },
        }}
      >
        {drawerItems}
      </Drawer>

      {/* Modal para agregar producto */}
      <Modal 
        open={openAdminModal} 
        onClose={() => setOpenAdminModal(false)}
        aria-labelledby="modal-producto-title"
        aria-describedby="modal-producto-description"
      >
        <Box
          sx={{
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: isMobile ? "95%" : "80%",
            maxWidth: "600px",
            maxHeight: "90vh",
            overflowY: "auto",
            boxShadow: 24,
          }}
        >
          <ModalProductoAdmin 
            open={openAdminModal}
            onClose={() => setOpenAdminModal(false)} 
            onSave={() => setOpenAdminModal(false)}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default NavBarAdmin;