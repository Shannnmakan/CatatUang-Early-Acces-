import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyATAzQfxwkq7F04zn4dtKPUWtcdc6KOZWY",
  authDomain: "catat-uang-app-62c98.firebaseapp.com",
  projectId: "catat-uang-app-62c98",
  storageBucket: "catat-uang-app-62c98.firebasestorage.app",
  messagingSenderId: "575796302424",
  appId: "1:575796302424:web:5077cf2868958d0799702d",
  measurementId: "G-NMVEY5YF6W"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { success: true, user: result.user };
  } catch (error) {
    console.error("Firebase Google Auth Error:", error);
    return { success: false, error: error.message };
  }
};

export const logoutGoogle = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export default app;
