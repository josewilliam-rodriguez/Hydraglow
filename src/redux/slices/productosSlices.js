import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addDoc, collection, deleteDoc, doc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

// Async Thunks
export const fetchProducts = createAsyncThunk(
  'productos/fetchProducts',
  async (_, { dispatch }) => {
    const unsubscribe = onSnapshot(collection(db, 'productos'), (querySnapshot) => {
      const products = querySnapshot.docs.map(doc => {
        const data = doc.data();
        // Convertir Timestamps a formatos serializables
        const serializableData = {};
        Object.keys(data).forEach(key => {
          if (data[key] && typeof data[key] === 'object' && 'toDate' in data[key]) {
            serializableData[key] = data[key].toDate().toISOString(); // Opción 1: String ISO
            // O alternativamente:
            // serializableData[key] = data[key].toMillis(); // Opción 2: Número timestamp
          } else {
            serializableData[key] = data[key];
          }
        });
        return { id: doc.id, ...serializableData };
      });
      dispatch(productosSlice.actions.setProducts(products));
    });
    
    return unsubscribe;
  }
);

export const addProduct = createAsyncThunk(
  'productos/addProduct',
  async (productData) => {
    const docRef = await addDoc(collection(db, 'productos'), productData);
    return { id: docRef.id, ...productData };
  }
);

export const updateProduct = createAsyncThunk(
  'productos/updateProduct',
  async ({ id, ...productData }) => {
    await updateDoc(doc(db, 'productos', id), productData);
    return { id, ...productData };
  }
);

export const deleteProduct = createAsyncThunk(
  'productos/deleteProduct',
  async (id) => {
    await deleteDoc(doc(db, 'productos', id));
    return id;
  }
);

// Slice
const productosSlice = createSlice({
  name: 'productos',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    unsubscribe: null // Añadido para almacenar la función de unsubscribe
  },
  reducers: {
    // Añadido el reducer setProducts
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    // Añadido para limpiar la suscripción
    clearUnsubscribe: (state) => {
      if (state.unsubscribe) {
        state.unsubscribe();
      }
      state.unsubscribe = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Almacenamos la función unsubscribe en el estado
        if (state.unsubscribe) {
          state.unsubscribe(); // Limpiamos cualquier suscripción anterior
        }
        state.unsubscribe = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(product => product.id !== action.payload);
      });
  }
});

// Selectors (se mantienen igual)
export const selectAllProducts = (state) => state.productos.items;
export const selectProductById = (id) => (state) => 
  state.productos.items.find(product => product.id === id);
export const selectProductsStatus = (state) => state.productos.status;
export const selectProductsError = (state) => state.productos.error;

// Exportamos las acciones generadas
export const { setProducts, clearUnsubscribe } = productosSlice.actions;

// Exportamos el reducer (esto es lo que importarás como productosReducer)
export default productosSlice.reducer;