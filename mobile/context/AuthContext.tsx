import React, { createContext, useState, useEffect } from 'react';

// 1. Definição dos tipos para o Contexto
interface AuthContextType {
    session: string | null; // O token ou ID do usuário (null se deslogado)
    isLoading: boolean;     // Para saber se ainda estamos carregando do storage
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

// 2. Criação do Contexto (com valores iniciais para tipagem)
export const AuthContext = createContext<AuthContextType>({
    session: null,
    isLoading: false,
    signIn: async () => {},
    signOut: async () => {},
});

// 3. O Provedor do Contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // [LÓGICA ESTÁTICA SIMULADA]
    useEffect(() => {
        // Simula o carregamento da sessão do SecureStore na inicialização
        // Se houver um token salvo, ele o carregaria aqui.
        setTimeout(() => {
            // No mundo real: setSession(await SecureStore.getItemAsync('session'));
            setIsLoading(false); 
        }, 1000); 
    }, []);


    // [LÓGICA ESTÁTICA SIMULADA DE LOGIN]
    const signIn = async (email: string, password: string) => {
        // 1. No mundo real: Chamada à API do Backend
        // 2. No mundo real: Se sucesso, salve o token no SecureStore.
        
        console.log(`Tentativa de Login: ${email}`);
        
        // Simulação de sucesso após 500ms
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                const fakeToken = 'user-token-12345';
                setSession(fakeToken);
                console.log('Login Estático bem-sucedido!');
                resolve();
            }, 500);
        });
    };

    // [LÓGICA ESTÁTICA SIMULADA DE LOGOUT]
    const signOut = async () => {
        // No mundo real: Remova o token do SecureStore.
        setSession(null);
        console.log('Logout Estático efetuado!');
    };

    return (
        <AuthContext.Provider value={{ session, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}