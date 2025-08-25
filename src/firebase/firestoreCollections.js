import { collection } from "firebase/firestore";
import { db } from "./firebaseConfig";

export const usersRef = collection(db, "users");
export const productosRef = collection(db, "productos");
export const blogsRef = collection(db, "blogs");