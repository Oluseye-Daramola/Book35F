

import { createContext, useContext, useState } from 'react';








const AuthContext = createContext(null);


const mockSignup = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        reject(new Error('Email and password are required'));
        return;
      }
      resolve({ id: crypto.randomUUID(), email, name: email.split('@')[0] });
    }, 800);
  });
};



const mockLogin = (email, password) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'provider@test.com' && password === 'password123') {
        resolve({ id: 'demo-user-1', email, name: 'Demo Provider' });
      } else {
        reject(new Error('Invalid email or password'));
      }
    }, 800);
  });
};



//////////////////////////////////////



export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await mockSignup(email, password);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await mockLogin(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  

  const logout = () => setUser(null);

  const value = { user, isLoading, error, signup, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


/////////////////////////////////

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};