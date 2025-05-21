import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, useDispatch } from 'react-redux';
import { store } from './redux/store.js';
import { checkUserSession } from './redux/slices/currentUsers.js';
import AppRouter from './routes/AppRouter.jsx';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserSession()); // Verifica sesión al iniciar la app
  }, [dispatch]);

  return <AppRouter />;
};

// Renderizado principal
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>
);