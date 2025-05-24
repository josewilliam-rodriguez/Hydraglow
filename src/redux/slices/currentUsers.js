import { createSlice } from "@reduxjs/toolkit";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { 
  createUserWithEmailAndPassword, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile
} from "firebase/auth";


export const logoutUserAction = () => async (dispatch) => {
  try {
    await signOut(auth); // Cierra la sesión en Firebase
    dispatch(logoutUser()); // Limpia el estado en Redux
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};


export const checkUserSession = () => async (dispatch) => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        // Obtener datos del usuario desde Firestore
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          throw new Error("Usuario no encontrado en Firestore");
        }

        const userData = userDoc.data();

        // Estructura final del usuario con token de acceso
        const formattedUserData = {
          ...userData,
          displayName: user.displayName || "Sin nombre",
          email: user.email,
          photoURL: user.photoURL || "",
          uid: user.uid,
          accessToken: await user.getIdToken(),
        };

        // Guardar usuario en Redux
        dispatch(saveUser(formattedUserData));
      } catch (error) {
        console.error("Error al verificar sesión:", error);
        dispatch(logoutUser());
      }
    } else {
      dispatch(logoutUser());
    }
  });
};


// Función mejorada para verificar usuario en Firestore
const verifyUserInFirestore = async (uid) => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    return userDoc.exists() ? userDoc.data() : null;
  } catch (error) {
    console.error("Error verificando usuario en Firestore:", error);
    return null;
  }
};

// Acción para registrar un usuario
export const emailRegister = (data) => async (dispatch) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;

    // Actualizar el perfil del usuario
    await updateProfile(user, {
      displayName: data.nombre || user.displayName,
    });

    // Datos para Firestore
    const userData = {
      displayName: data.nombre || user.displayName,
      email: user.email,
      uid: user.uid,
      contacto: user.contacto,
      role: "user", // Rol por defecto
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    // Guardar en Firestore
    await setDoc(doc(db, "users", user.uid), userData);
    
    // Verificar que se guardó
    const savedData = await verifyUserInFirestore(user.uid);
    if (!savedData) {
      throw new Error("No se pudo verificar el guardado en Firestore");
    }

    dispatch(saveUser({
      ...userData,
      accessToken: await user.getIdToken()
    }));

  } catch (error) {
    const message = error.code === "auth/email-already-in-use" 
      ? "El correo ya está registrado. Intenta iniciar sesión." 
      : error.message;
    dispatch(setError(message));
  }
};

// Acción mejorada para iniciar sesión
export const emailLogin = (data) => async (dispatch) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;
    
    // Obtener datos de Firestore como fuente principal
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (!userDoc.exists()) {
      throw new Error("Usuario no encontrado en la base de datos");
    }

    const userData = userDoc.data();
    
    // Actualizar lastLogin
    await setDoc(doc(db, "users", user.uid), {
      lastLogin: new Date().toISOString()
    }, { merge: true });

    dispatch(loginUser({
      ...userData,
      accessToken: await user.getIdToken(),
      // Usar el rol de Firestore, con "user" como valor por defecto
      role: userData.role || 'user'
    }));

  } catch (error) {
    const message = error.code === "auth/wrong-password" 
      ? "Contraseña incorrecta" 
      : error.code === "auth/user-not-found" 
        ? "Usuario no encontrado" 
        : error.message;
    dispatch(setError(message));
  }
};

// Estado inicial
const initialState = {
  displayName: "",
  email: "",
  uid: "",
  accessToken: "",
  role: "user", // Valor por defecto
  error: null,
  loggedInUser: null,
};

// Slice de usuario (se mantiene igual)
export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    saveUser: (state, action) => {
      state.loggedInUser = action.payload;
      
      state.error = null;
    },
    loginUser: (state, action) => {
      state.loggedInUser = action.payload;
      state.error = null;
    },
    logoutUser: (state) => {
      return initialState;
    },
    updateUserData: (state, action) => {
      if (state.loggedInUser) {
        state.loggedInUser = { ...state.loggedInUser, ...action.payload };
      }
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { loginUser, logoutUser, updateUserData, setError, saveUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;