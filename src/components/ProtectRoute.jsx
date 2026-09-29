import React from 'react';
import {Navigate} from 'react-router-dom';
import {useAuth} from './AuthContext';

export function ProtectRoute({children}) {
    const {usuario} = useAuth();
    if(!usuario) {
        return <Navigate to="/" replace />;

    }
    return children;
}