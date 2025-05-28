import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { currentUserSlice } from "./slices/currentUsers";
import productosSlice from "./slices/productosSlices"
import promocionesReducer from "./slices/promocionesSlices"
export const store = configureStore({
    reducer: combineReducers({ 
        currentUser: currentUserSlice.reducer,
        productos: productosSlice,
        promociones: promocionesReducer
    }),
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: [
                    "currentUser.loggedInUser.createdAt",
                    "productos.unsubscribe" // Añade esto para el listener de Firebase
                ],
                ignoredActions: [
                    "currentUser/saveUser",
                    "productos/fetchProducts/fulfilled" // Añade esto para el payload con unsubscribe
                ],
            },
        }),
        devTools: process.env.NODE_ENV === "development"
});