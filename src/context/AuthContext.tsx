import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  signOut as firebaseSignOut,
  type User
} from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface AuthContextType {
  currentUser: User | null;
  userRole: 'patient' | 'doctor' | 'admin' | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'patient' | 'doctor' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Check if user is a doctor or patient
        // We check 'doctors' collection first, then 'patients'
        // Ideally, you might store the role in a custom claim or a separate 'users' mapping collection
        // But checking both collections is a simple starting point.
        
        try {
            const adminDoc = await getDoc(doc(db, "admins", user.uid));
            if (adminDoc.exists()) {
                setUserRole('admin');
            } else {
                const doctorDoc = await getDoc(doc(db, "doctors", user.uid));
                if (doctorDoc.exists()) {
                    setUserRole('doctor');
                } else {
                    const patientDoc = await getDoc(doc(db, "patients", user.uid));
                    if (patientDoc.exists()) {
                        setUserRole('patient');
                    } else {
                        setUserRole(null); // Unknown role yet
                    }
                }
            }
        } catch (error) {
            console.error("Error fetching user role:", error);
            setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = () => {
    return firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    userRole,
    loading,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
