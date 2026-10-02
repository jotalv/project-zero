import { createContext, useState, useContext, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [modoRecuperacao, setModoRecuperacao] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUsuario(session?.user ?? null);
      setCarregando(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUsuario(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') {
        setModoRecuperacao(true);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const cadastrar = async (email, senha, nome) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } },
    });
    return { usuario: data?.user ?? null, precisaConfirmarEmail: !data?.session, error };
  };

  const login = async (email, senha) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    return { usuario: data?.user ?? null, error };
  };

  const logout = () => supabase.auth.signOut();

  const atualizarSenha = async (novaSenha) => {
    const { error } = await supabase.auth.updateUser({ password: novaSenha });
    if (!error) setModoRecuperacao(false);
    return { error };
  };

  const recuperarSenha = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/',
    });
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        carregando,
        modoRecuperacao,
        login,
        cadastrar,
        logout,
        atualizarSenha,
        recuperarSenha,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
