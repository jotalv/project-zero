import React, { createContext, useState, useContext } from 'react';
const AuthContext = createContext (); //onde vai guarda as informações
export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() =>{
        const usuarioSalvo = localStorage.getItem('usuario_hacker');
        return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
    });
    //Salvar dados no Navegador
    const login = (email) => {
        const dadosUsuario = {email, logado: true};
        setUsuario(dadosUsuario);
        localStorage.setItem('usuario_hacker', JSON.stringify(dadosUsuario));
    };
    const logout = () => {
        setUsuario (null);
        localStorage.removeItem('usuario_hacker');
    };
    return (
        <AuthContext.Provider value={{usuario, login, logout}}>
            {children}
        </AuthContext.Provider>    
    );
    }
    export function useAuth() {
        return useContext(AuthContext);
    }
