import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { logoutUser, saveUser } from "./redux/slices/currentUser";
import NavBar from "./components/NavBar";
import NavBarAdmin from "./components/NavBarAdmin";
import Home from "./components/Home";

function App() {
  const dispatch = useDispatch();
  const auth = getAuth();
  const user = useSelector((state) => state.currentUser.loggedInUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docSnap = await getDoc(doc(db, "users", user.uid));
          if (docSnap.exists()) {
            const userData = docSnap.data();
            dispatch(saveUser(userData)); // Guardar usuario en Redux
          }
        } catch (error) {
          console.error("Error al recuperar usuario de Firestore:", error);
        }
      }
    });

    return () => unsubscribe(); // Cleanup del listener
  }, [dispatch]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch(logoutUser()); // Cerrar sesión en Redux
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };
  return (
    <>
    {/* {user?.role === "admin" ? <NavBarAdmin user={user} handleLogout={handleLogout} /> : <NavBar />} */}
      {/* <Home /> */}
    </>
  );
}

export default App;