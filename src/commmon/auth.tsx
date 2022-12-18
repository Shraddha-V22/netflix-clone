// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {
  getAuth,
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import React, { useEffect, useState, createContext, useContext } from "react";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDiXhVJ9KPUCHwLhL6Ef4kiDgiN7V9LNgc",
  authDomain: "netflix-clone-f8d35.firebaseapp.com",
  projectId: "netflix-clone-f8d35",
  storageBucket: "netflix-clone-f8d35.appspot.com",
  messagingSenderId: "1056391443816",
  appId: "1:1056391443816:web:d48c5fed54a3a28ff1d2dd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export type AuthContextType = ReturnType<typeof useProviderAuth>;

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  const auth = useProviderAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

function useProviderAuth() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      user ? setUser(user) : setUser(null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [user, setUser] = useState<User | null>(null);

  const signUp = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password).then(({ user }) => {
      setUser(user);
      return user;
    });

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password).then(({ user }) => {
      setUser(user);
      return user;
    });

  const signOutUser = signOut(auth).then(() => setUser(null));

  return {
    signUp,
    signIn,
    signOut: signOutUser,
    user,
  };
}

export const useAuth = () => useContext(AuthContext) ?? ({} as AuthContextType);
