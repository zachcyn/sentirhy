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
    const token = localStorage.getItem('authToken');
    if (token) {
      validateToken(token);
    } else {
      setAuthState(prevState => ({ ...prevState, loading: false }));
    }
  }, [validateToken]);

  const login = useCallback((data, rememberMe = false) => {
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('authToken', data.token);
    setAuthState({
      isAuthenticated: true,
      user: data.user,
      token: data.token,
      loading: false
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false
    });
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => ({
    authState,
    login,
    logout
  }), [authState, login, logout]);

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
