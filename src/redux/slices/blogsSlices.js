import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

// 🔒 Variable local para manejar la suscripción sin guardarla en Redux
let unsubscribeBlogs = null;

// 🚀 Thunks
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (_, { dispatch }) => {
    try {
      if (typeof unsubscribeBlogs === "function") {
        unsubscribeBlogs(); // Limpia suscripción anterior
      }

      const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
      unsubscribeBlogs = onSnapshot(
        q,
        (querySnapshot) => {
          const blogs = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            const serializableData = {};

            // 🔧 Mejor manejo de conversión de fechas
            Object.keys(data).forEach((key) => {
              if (
                data[key] &&
                typeof data[key] === "object" &&
                data[key].toDate
              ) {
                serializableData[key] = data[key].toDate().toISOString();
              } else if (data[key] instanceof Date) {
                serializableData[key] = data[key].toISOString();
              } else {
                serializableData[key] = data[key];
              }
            });

            return { 
              id: doc.id, 
              ...serializableData,
              comments: serializableData.comments || [] // 🔧 Asegurar array
            };
          });
          dispatch(setBlogs(blogs));
        },
        (error) => {
          console.error("Error en la suscripción de blogs:", error);
          dispatch(setBlogsError(error.message));
        }
      );

      return true;
    } catch (error) {
      console.error("Error en fetchBlogs:", error);
      throw error;
    }
  }
);

export const addBlog = createAsyncThunk("blogs/addBlog", async (blogData) => {
  try {
    const createdAt = Timestamp.now();
    const cleanBlogData = {};
    
    Object.keys(blogData).forEach((key) => {
      if (blogData[key] !== undefined && typeof blogData[key] !== "function") {
        cleanBlogData[key] = blogData[key];
      }
    });

    // 🔧 Solo crear en Firebase - NO actualizar Redux aquí
    await addDoc(collection(db, "blogs"), {
      ...cleanBlogData,
      comments: [],
      createdAt,
    });

    // El listener onSnapshot se encargará de la actualización
    return null;
  } catch (error) {
    console.error("Error en addBlog:", error);
    throw error;
  }
});

// 🆕 Nuevo thunk para actualizar blogs
export const updateBlog = createAsyncThunk(
  "blogs/updateBlog", 
  async ({ id, ...blogData }) => {
    try {
      const updatedAt = Timestamp.now();
      const cleanBlogData = {};
      
      Object.keys(blogData).forEach((key) => {
        if (blogData[key] !== undefined && typeof blogData[key] !== "function") {
          cleanBlogData[key] = blogData[key];
        }
      });

      // 🔧 Solo actualizar Firebase - NO Redux aquí
      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, {
        ...cleanBlogData,
        updatedAt,
      });

      // El listener se encargará de la actualización
      return null;
    } catch (error) {
      console.error("Error en updateBlog:", error);
      throw error;
    }
  }
);

export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id) => {
  try {
    // 🔧 Solo eliminar de Firebase - NO actualizar Redux aquí
    await deleteDoc(doc(db, "blogs", id));
    
    // El listener se encargará de actualizar el estado
    return null;
  } catch (error) {
    console.error("Error en deleteBlog:", error);
    throw error;
  }
});

export const addCommentToBlog = createAsyncThunk(
  "blogs/addCommentToBlog",
  async ({ blogId, comment }) => {
    try {
      if (!blogId || !comment) {
        throw new Error("blogId y comment son requeridos");
      }

      const commentWithTimestamp = {
        ...comment,
        createdAt: comment.createdAt || Timestamp.now(),
      };

      // 🔧 Solo actualizar Firebase - NO Redux aquí
      const blogRef = doc(db, "blogs", blogId);
      await updateDoc(blogRef, {
        comments: arrayUnion(commentWithTimestamp),
      });

      // El listener se encargará de la actualización
      return null;
    } catch (error) {
      console.error("Error en addCommentToBlog:", error);
      throw error;
    }
  }
);

// 🧹 Limpieza externa de la suscripción
export const clearBlogSubscription = () => {
  if (unsubscribeBlogs) {
    unsubscribeBlogs();
    unsubscribeBlogs = null;
  }
};

// 🧩 Slice
const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    setBlogs: (state, action) => {
      state.items = action.payload;
      state.status = "succeeded";
      state.error = null;
    },
    setBlogsError: (state, action) => {
      state.error = action.payload;
      state.status = "failed";
    },
    clearBlogsError: (state) => {
      state.error = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      
      // AddBlog cases
      .addCase(addBlog.pending, (state) => {
        state.error = null;
      })
      .addCase(addBlog.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      // 🆕 UpdateBlog cases
      .addCase(updateBlog.pending, (state) => {
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      // DeleteBlog cases
      .addCase(deleteBlog.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      // AddCommentToBlog cases
      .addCase(addCommentToBlog.pending, (state) => {
        state.error = null;
      })
      .addCase(addCommentToBlog.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(addCommentToBlog.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

// 🎯 Selectors
export const selectAllBlogs = (state) => state.blogs.items;
export const selectBlogById = (id) => (state) =>
  state.blogs.items.find((blog) => blog.id === id);
export const selectBlogsStatus = (state) => state.blogs.status;
export const selectBlogsError = (state) => state.blogs.error;

// 🚀 Export
export const { setBlogs, setBlogsError, clearBlogsError } = blogSlice.actions;
export default blogSlice.reducer;