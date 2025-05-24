import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchPromociones = createAsyncThunk(
  'promociones/fetchPromociones',
  async () => {
    try {
      const q = query(
        collection(db, 'productos'),
        where('promocion', '==', 'si')
      );
      
      const querySnapshot = await getDocs(q);
      const productos = [];
      
      querySnapshot.forEach((doc) => {
        productos.push({ id: doc.id, ...doc.data() });
      });

      return productos;
    } catch (error) {
      throw error;
    }
  }
);

const promocionesSlice = createSlice({
  name: 'promociones',
  initialState: {
    productos: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPromociones.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPromociones.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productos = action.payload;
      })
      .addCase(fetchPromociones.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const selectAllPromociones = (state) => state.promociones.productos;
export const selectPromocionesStatus = (state) => state.promociones.status;
export const selectPromocionesError = (state) => state.promociones.error;

export default promocionesSlice.reducer;