import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  firebaseSignOut, 
  onAuthStateChanged 
} from "../config/firebase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch or refresh user profile from backend
  const fetchUserProfile = async (token) => {
    try {
      const res = await axios.get("http://localhost:3001/user/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(res.data.profile);
    } catch (err) {
      console.warn("[!] Could not fetch profile:", err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          const token = await currentUser.getIdToken();
          setIdToken(token);
          await fetchUserProfile(token);
        } catch (error) {
          console.error("[x] Token fetch error:", error);
        }
      } else {
        setUser(null);
        setIdToken(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    const token = await res.user.getIdToken();
    setIdToken(token);
    await fetchUserProfile(token);
    return res.user;
  };

  const signInWithEmail = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const token = await res.user.getIdToken();
    setIdToken(token);
    await fetchUserProfile(token);
    return res.user;
  };

  const signUpWithEmail = async (email, password) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const token = await res.user.getIdToken();
    setIdToken(token);
    await fetchUserProfile(token);
    return res.user;
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setUser(null);
    setIdToken(null);
    setUserProfile(null);
  };

  const updateUserProfile = async (profileData) => {
    if (!user) throw new Error("User not logged in");
    const token = await user.getIdToken();
    const res = await axios.post("http://localhost:3001/user/profile", profileData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUserProfile(res.data.profile);
    return res.data.profile;
  };

  const getValidToken = async () => {
    if (!user) return null;
    return await user.getIdToken();
  };

  const value = {
    user,
    idToken,
    userProfile,
    loading,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    logout,
    updateUserProfile,
    fetchUserProfile: () => idToken && fetchUserProfile(idToken),
    getValidToken
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
