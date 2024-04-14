import  PropTypes from 'prop-types';
import React, { useMemo, useState, useEffect, useContext, useCallback, createContext} from 'react';

const AuthContext = createContext({
  authState: {
    isAuthenticated: false,
    user: null,
    token: null,
    loading: true,
  },
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('authToken') || null,
    loading: true
  });

  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('userData') || sessionStorage.getItem('userData');
    console.log('Initializing user from local storage:', userData);
    return userData ? JSON.parse(userData) : null;
  });

  const updateUser = useCallback((userData) => {
    setUser(userData);
  },[]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const validateToken = useCallback(async (token) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/validate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setAuthState({
          isAuthenticated: true,
          user: data.user,
          token,
          loading: false
        });
      } else {
        throw new Error('Token validation failed');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false
      });
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      validateToken(token);
    } else {
      setAuthState(prevState => ({ ...prevState, loading: false }));
    }
  }, [validateToken]);

  const login = useCallback((data, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('authToken', data.token);
    storage.setItem('userData', JSON.stringify({ user: data.user, fname: data.fname, lname: data.lname, email: data.email, imgurl: data.imgurl, dob: data.dob }))
    updateUser({ user: data.user, fname: data.fname, lname: data.lname, email: data.email, imgurl: data.imgurl, dob: data.dob });
    setAuthState({
      isAuthenticated: true,
      user: data.user,
      name: data.fname + data.lname,
      token: data.token,
      loading: false
    });
  }, [updateUser]);

  const logout = useCallback(() => {
    localStorage.clear();
    sessionStorage.clear();
    setAuthState({
      isAuthenticated: false,
      user: null,
      name: null,
      token: null,
      loading: false
    });
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => ({
    authState,
    user,
    login,
    logout,
    updateUser
  }), [authState, login, logout, user, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {!authState.loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired, // Define the expected prop type
  };
  
export const useAuth = () => {
  const context = useContext(AuthContext);
  return context;
};
