import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

// 🔒 Variable local para manejar la suscripción sin guardarla en Redux
let unsubscribeBlogs = null;

// Función para convertir datos de Firebase a formato serializable
const convertFirebaseData = (data) => {
  const result = {};
  
  Object.keys(data).forEach((key) => {
    const value = data[key];
    
    if (value && typeof value === "object") {
      // Convertir Timestamp a string ISO
      if (value.toDate && typeof value.toDate === "function") {
        result[key] = value.toDate().toISOString();
      } 
      // Convertir arrays (como videos y comments)
      else if (Array.isArray(value)) {
        result[key] = value.map(item => {
          if (item && typeof item === "object") {
            const convertedItem = {};
            Object.keys(item).forEach(itemKey => {
              const itemValue = item[itemKey];
              if (itemValue && itemValue.toDate && typeof itemValue.toDate === "function") {
                convertedItem[itemKey] = itemValue.toDate().toISOString();
              } else {
                convertedItem[itemKey] = itemValue;
              }
            });
            return convertedItem;
          }
          return item;
        });
      }
      // Convertir objetos anidados
      else if (value !== null) {
        result[key] = convertFirebaseData(value);
      }
    } else {
      result[key] = value;
    }
  });
  
  return result;
};

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
            // Convertir todos los datos de Firebase a formato serializable
            const serializableData = convertFirebaseData(data);
            
            return { 
              id: doc.id, 
              ...serializableData,
              comments: serializableData.comments || [],
              videos: serializableData.videos || []
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

    await addDoc(collection(db, "blogs"), {
      ...cleanBlogData,
      comments: [],
      videos: [],
      createdAt,
    });

    return null;
  } catch (error) {
    console.error("Error en addBlog:", error);
    throw error;
  }
});

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

      const blogRef = doc(db, "blogs", id);
      await updateDoc(blogRef, {
        ...cleanBlogData,
        updatedAt,
      });

      return null;
    } catch (error) {
      console.error("Error en updateBlog:", error);
      throw error;
    }
  }
);

export const deleteBlog = createAsyncThunk("blogs/deleteBlog", async (id) => {
  try {
    await deleteDoc(doc(db, "blogs", id));
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
        createdAt: Timestamp.now(),
      };

      const blogRef = doc(db, "blogs", blogId);
      await updateDoc(blogRef, {
        comments: arrayUnion(commentWithTimestamp),
      });

      return null;
    } catch (error) {
      console.error("Error en addCommentToBlog:", error);
      throw error;
    }
  }
);

// 🎥 Thunk para agregar video a un blog
export const addVideoToBlog = createAsyncThunk(
  "blogs/addVideoToBlog",
  async ({ blogId, videoUrl, videoType, title, duration }) => {
    try {
      if (!blogId || !videoUrl) {
        throw new Error("blogId y videoUrl son requeridos");
      }

      const videoData = {
        url: videoUrl,
        type: videoType || 'short',
        title: title || `Video ${Timestamp.now().toMillis()}`,
        duration: duration || '0:00',
        uploadedAt: Timestamp.now(),
      };

      const blogRef = doc(db, "blogs", blogId);
      await updateDoc(blogRef, {
        videos: arrayUnion(videoData),
      });

      return null;
    } catch (error) {
      console.error("Error en addVideoToBlog:", error);
      throw error;
    }
  }
);

// 🎥 Thunk para eliminar video de un blog

export const removeVideoFromBlog = createAsyncThunk(
  "blogs/removeVideoFromBlog",
  async ({ blogId, videoUrl }) => {  // ✅ Cambiar a videoUrl en lugar de videoIndex
    try {
      const blogRef = doc(db, "blogs", blogId);
      const blogDoc = await getDoc(blogRef);
      
      if (!blogDoc.exists()) {
        throw new Error("Blog no encontrado");
      }

      const blogData = blogDoc.data();
      const currentVideos = blogData.videos || [];
      
      // Buscar el índice del video por su URL
      const videoIndex = currentVideos.findIndex(video => video.url === videoUrl);
      
      if (videoIndex === -1) {
        throw new Error("Video no encontrado");
      }

      // Crear nuevo array sin el video a eliminar
      const updatedVideos = [...currentVideos];
      updatedVideos.splice(videoIndex, 1);

      // Actualizar Firebase
      await updateDoc(blogRef, {
        videos: updatedVideos,
      });

      return null;
    } catch (error) {
      console.error("Error en removeVideoFromBlog:", error);
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
  extraReducers: (builder) => {
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
      
      .addCase(addBlog.pending, (state) => {
        state.error = null;
      })
      .addCase(addBlog.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(addBlog.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      .addCase(updateBlog.pending, (state) => {
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      .addCase(deleteBlog.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      .addCase(addCommentToBlog.pending, (state) => {
        state.error = null;
      })
      .addCase(addCommentToBlog.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(addCommentToBlog.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      .addCase(addVideoToBlog.pending, (state) => {
        state.error = null;
      })
      .addCase(addVideoToBlog.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(addVideoToBlog.rejected, (state, action) => {
        state.error = action.error.message;
      })
      
      .addCase(removeVideoFromBlog.pending, (state) => {
        state.error = null;
      })
      .addCase(removeVideoFromBlog.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(removeVideoFromBlog.rejected, (state, action) => {
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

export const selectBlogVideos = (blogId) => (state) => {
  const blog = state.blogs.items.find((blog) => blog.id === blogId);
  return blog?.videos || [];
};

// 🚀 Export
export const { setBlogs, setBlogsError, clearBlogsError } = blogSlice.actions;
export default blogSlice.reducer;