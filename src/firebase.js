import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD65_bPARimvp810x06He21BcMWcY0HNrA",
  authDomain: "movie-list-watched.firebaseapp.com",
  projectId: "movie-list-watched",
  storageBucket: "movie-list-watched.firebasestorage.app",
  messagingSenderId: "27043875201",
  appId: "1:27043875201:web:73ed7241a3ccdc9a57c080",
  measurementId: "G-TPRZZREWH2",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const movieService = {
  // Get all movies (ordered by creation date)
  async getMovies() {
    try {
      const q = query(collection(db, "movies"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Convert Firestore timestamps to strings
          createdAt: data.createdAt?.toDate().toISOString(),
          updatedAt: data.updatedAt?.toDate().toISOString(),
          // Handle watched_date - could be string or timestamp
          watched_date: data.watched_date
            ? data.watched_date instanceof Timestamp
              ? data.watched_date.toDate().toISOString().split("T")[0]
              : data.watched_date
            : null,
        };
      });
    } catch (error) {
      console.error("Error fetching movies:", error);
      throw error;
    }
  },

  // Add new movie
  async addMovie(movieData) {
    try {
      // Convert watched_date string to Timestamp if provided
      const dataToSave = {
        ...movieData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      if (movieData.watched_date) {
        dataToSave.watched_date = Timestamp.fromDate(
          new Date(movieData.watched_date)
        );
      }

      const docRef = await addDoc(collection(db, "movies"), dataToSave);

      return {
        id: docRef.id,
        ...movieData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error adding movie:", error);
      throw error;
    }
  },

  // Update existing movie
  async updateMovie(movieId, updates) {
    try {
      const movieRef = doc(db, "movies", movieId);

      // Convert watched_date string to Timestamp if provided
      const updatesToSave = {
        ...updates,
        updatedAt: serverTimestamp(),
      };

      if (updates.watched_date) {
        updatesToSave.watched_date = Timestamp.fromDate(
          new Date(updates.watched_date)
        );
      }

      await updateDoc(movieRef, updatesToSave);

      return {
        id: movieId,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error updating movie:", error);
      throw error;
    }
  },

  // Delete movie
  async deleteMovie(movieId) {
    try {
      await deleteDoc(doc(db, "movies", movieId));
    } catch (error) {
      console.error("Error deleting movie:", error);
      throw error;
    }
  },
};

export default movieService;
