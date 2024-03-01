import React from 'react';
import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

import { useAuth } from '../sections/login/authContext';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const { authState } = useAuth();

    return authState?.isAuthenticated ? <Component {...rest} /> : <Navigate to="/login" />;
};

PrivateRoute.propTypes = {
    component: PropTypes.elementType.isRequired
};

export default PrivateRoute;
