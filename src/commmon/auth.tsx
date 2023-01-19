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

const auth = getAuth(app); //auth instance associated to the app

export type AuthContextType = ReturnType<typeof useProviderAuth>; //a type alias - authContextType is a return type -will be of useProviderAuth's type

const AuthContext = createContext<AuthContextType | null>(null); //authcontext can be of type authContexttype or null.

export const useAuth = () => useContext(AuthContext) ?? ({} as AuthContextType); //custom hook to get the return value of useauthprovider

export const AuthProvider = ({
  //provides auth functions and user throughout the app
  children,
}: {
  children: React.ReactElement | React.ReactElement[];
}) => {
  const auth = useProviderAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

function useProviderAuth() {
  //custom hook with signIn, signout, signup functions

  //current user null ->
  //1. firebase is still fetching the information. async operation.
  //2. when the user is logged out

  //user is logged in -> we get a user
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      //observer for user's signin state
      setLoading(false);
      setUser(user);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signUp = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password).then(({ user }) => {
      //creates a new user with given email password
      return user;
    });

  const signIn = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password).then(({ user }) => {
      //signs ins user "asynchronously"
      return user;
    });

  const signOutUser = () => signOut(auth); //signs out user

  return {
    signUp,
    signIn,
    signOut: signOutUser,
    user,
    loading,
  };
}
