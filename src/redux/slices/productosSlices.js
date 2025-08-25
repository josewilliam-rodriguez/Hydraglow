import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

// 🔒 Variable local para manejar la suscripción sin guardarla en Redux
let unsubscribeProducts = null;

// 🚀 Async Thunks
export const fetchProducts = createAsyncThunk(
  'productos/fetchProducts',
  async (_, { dispatch }) => {
    try {
      if (typeof unsubscribeProducts === 'function') {
        unsubscribeProducts(); // Limpia suscripción anterior
      }

      unsubscribeProducts = onSnapshot(
        collection(db, 'productos'), 
        (querySnapshot) => {
          const products = querySnapshot.docs.map(doc => {
            const data = doc.data();
            const serializableData = {};
            
            Object.keys(data).forEach(key => {
              if (data[key] && typeof data[key] === 'object' && 'toDate' in data[key]) {
                serializableData[key] = data[key].toDate().toISOString();
              } else {
                serializableData[key] = data[key];
              }
            });
            
            return { id: doc.id, ...serializableData };
          });
          
          dispatch(setProducts(products));
        },
        (error) => {
          console.error("Error en la suscripción de productos:", error);
          dispatch(setProductsError(error.message));
        }
      );
      
      return true;
    } catch (error) {
      console.error("Error en fetchProducts:", error);
      throw error;
    }
  }
);

export const addProduct = createAsyncThunk(
  'productos/addProduct',
  async (productData) => {
    try {
      // 🔧 Solo crear en Firebase - NO actualizar Redux aquí
      await addDoc(collection(db, 'productos'), productData);
      
      // El listener onSnapshot se encargará de la actualización
      return null;
    } catch (error) {
      console.error("Error en addProduct:", error);
      throw error;
    }
  }
);

export const updateProduct = createAsyncThunk(
  'productos/updateProduct',
  async ({ id, ...productData }) => {
    try {
      // 🔧 Solo actualizar Firebase - NO Redux aquí
      await updateDoc(doc(db, 'productos', id), productData);
      
      // El listener se encargará de la actualización
      return null;
    } catch (error) {
      console.error("Error en updateProduct:", error);
      throw error;
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'productos/deleteProduct',
  async (id) => {
    try {
      // 🔧 Solo eliminar de Firebase - NO actualizar Redux aquí
      await deleteDoc(doc(db, 'productos', id));
      
      // El listener se encargará de la actualización
      return null;
    } catch (error) {
      console.error("Error en deleteProduct:", error);
      throw error;
    }
  }
);

// 🧹 Limpieza externa de la suscripción
export const clearProductSubscription = () => {
  if (unsubscribeProducts) {
    unsubscribeProducts();
    unsubscribeProducts = null;
  }
};

// 🧩 Slice
const productosSlice = createSlice({
  name: 'productos',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
      state.status = 'succeeded';
      state.error = null;
    },
    setProductsError: (state, action) => {
      state.error = action.payload;
      state.status = 'failed';
    },
    clearProductsError: (state) => {
      state.error = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // 🔧 CAMBIO IMPORTANTE: Solo manejar estados de carga y error
      // NO actualizar el estado local - el listener se encarga
      .addCase(addProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state) => {
        // 🔧 NO hacer nada aquí - el listener se encarga
        state.error = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      .addCase(updateProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state) => {
        // 🔧 NO hacer nada aquí - el listener se encarga
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      .addCase(deleteProduct.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        // 🔧 NO hacer nada aquí - el listener se encarga
        state.error = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.error.message;
      });
  }
});

// 🎯 Selectors
export const selectAllProducts = (state) => state.productos.items;
export const selectProductById = (id) => (state) => 
  state.productos.items.find(product => product.id === id);
export const selectProductsStatus = (state) => state.productos.status;
export const selectProductsError = (state) => state.productos.error;

// 🚀 Export
export const { setProducts, setProductsError, clearProductsError } = productosSlice.actions;
export default productosSlice.reducer;