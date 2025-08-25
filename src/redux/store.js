import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { currentUserSlice } from "./slices/currentUsers";
import productosSlice from "./slices/productosSlices";
import promocionesReducer from "./slices/promocionesSlices";
import blogsReducer from "./slices/blogsSlices";

// 🔧 Configuración corregida del store
export const store = configureStore({
    reducer: {
        // 🚨 Cambio principal: usar objeto directo en lugar de combineReducers
        currentUser: currentUserSlice.reducer,
        productos: productosSlice,
        promociones: promocionesReducer,
        blogs: blogsReducer   
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: [
                    "currentUser.loggedInUser.createdAt",
                    "productos.unsubscribe", // Firebase listener
                    "blogs.items", // 🔧 Añadir rutas de blogs si es necesario
                ],
                ignoredActions: [
                    "currentUser/saveUser",
                    "productos/fetchProducts/fulfilled",
                    "blogs/fetchBlogs/fulfilled", // 🔧 Añadir acciones de blogs
                    "blogs/addBlog/fulfilled",
                ],
            },
        }),
    devTools: process.env.NODE_ENV === "development"
});
