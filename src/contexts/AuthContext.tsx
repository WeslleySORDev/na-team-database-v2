"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import { auth, db } from "@/config/firebase";
import {
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  userNickname: string | null;
  setUserNickname: React.Dispatch<React.SetStateAction<string | null>>;
  updateNickname: (newNickname: string) => Promise<void>;
  accessLevel: number;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userNickname, setUserNickname] = useState<string | null>(null);
  const [accessLevel, setAccessLevel] = useState<number>(1);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setUser(authUser);
      setAccessLevel(1);
      if (authUser) {
        setUserEmail(authUser.email || null);
        const userDocRef = doc(db, "users", authUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          setUserNickname(docSnap.data()?.nickname || null);
          setAccessLevel(docSnap.data()?.accessLevel || 1);
          // Verifica se o email está salvo e salva se não estiver
          if (!docSnap.data()?.email && authUser.email) {
            await setDoc(
              userDocRef,
              { email: authUser.email },
              { merge: true }
            );
          }
        } else {
          setUserNickname(null);
          setAccessLevel(1);
          await setDoc(userDocRef, {
            nickname: null,
            accessLevel: 1,
            email: authUser.email || null,
          });
        }
      } else {
        setUserNickname(null);
        setUserEmail(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await auth.signOut();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUserEmail(user.email || null);

      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        await setDoc(userDocRef, {
          nickname: null,
          accessLevel: 1,
          email: user.email || null,
        });
      } else {
        setUserNickname(docSnap.data()?.nickname || null);
        setAccessLevel(docSnap.data()?.accessLevel || 1);
        if (!docSnap.data()?.email && user.email) {
          await setDoc(userDocRef, { email: user.email }, { merge: true });
        }
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    } finally {
      setLoading(false);
    }
  };

  const signOutHandler = useCallback(async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
      setUserNickname(null);
      setAccessLevel(1);
      setUserEmail(null);
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateNickname = async (newNickname: string) => {
    if (!user?.uid) {
      console.error("User not authenticated.");
      return;
    }
    setLoading(true);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { nickname: newNickname }, { merge: true });
      setUserNickname(newNickname);
    } catch (error) {
      console.error("Error updating nickname:", error);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signInWithGoogle,
    signOut: signOutHandler,
    userNickname,
    setUserNickname,
    updateNickname,
    accessLevel,
    userEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {loading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-700"></div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
