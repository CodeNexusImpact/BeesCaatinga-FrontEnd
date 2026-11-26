import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import api from '@/services/api';
import * as SecureStore from 'expo-secure-store';

// Utilitário para persistência multiplataforma
const storage = {
    getItem: async (key: string) => {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
    },
    setItem: async (key: string, value: string) => {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    },
    removeItem: async (key: string) => {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    }
};

// Definição do tipo do Produtor conforme o retorno do Backend
interface Produtor {
    id: number;
    email: string;
    nomeCompleto: string;
    nomeDaEmpresa?: string;
    telefone?: string;
    genero?: string;
    endereco?: string;
    caminhoDaFoto?: string;
}

interface AuthContextType {
    session: string | null;
    user: Produtor | null;
    isLoading: boolean;
    signIn: (email: string, senha: string) => Promise<void>;
    signOut: () => Promise<void>;
    atualizarUsuario: (produtor: Produtor) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    isLoading: true,
    signIn: async () => { },
    signOut: async () => { },
    atualizarUsuario: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [session, setSession] = useState<string | null>(null);
    const [user, setUser] = useState<Produtor | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const storedUser = await storage.getItem('user_data');
                const storedToken = await storage.getItem('user_token');

                if (storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                    setSession(storedToken);
                }
            } catch (e) {
                console.error('Erro ao carregar dados do storage', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadStorageData();
    }, []);


    const signIn = async (email: string, senha: string) => {
        let resposta: Produtor & { token?: string };
        try {
            const response = await api.post<Produtor & { token?: string }>('/login', { email: email.trim().toLowerCase(), senha });
            resposta = response.data;
        } catch (error: any) {
            // Backend responde 401 com ErrorResponse { status, error, message, timestamp }.
            const status = error?.response?.status;
            const mensagem: string | undefined = error?.response?.data?.message;
            if (status === 401) throw new Error(mensagem || 'E-mail ou senha inválidos');
            if (error?.code === 'ECONNABORTED') throw new Error('O servidor demorou para responder (ele pode estar iniciando). Aguarde alguns segundos e tente novamente.');
            if (!error?.response) throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão.');
            throw new Error(mensagem || 'Erro ao efetuar login. Tente novamente.');
        }

        const { token, ...produtor } = resposta;
        if (!token) {
            throw new Error('Resposta de login inválida: token ausente.');
        }

        await storage.setItem('user_token', token);
        await storage.setItem('user_data', JSON.stringify(produtor));

        // O Contexto apenas atualiza o estado; o redirecionamento é responsabilidade do RootLayout.
        setSession(token);
        setUser(produtor);
    };

    const signOut = async () => {
        try {
            await storage.removeItem('user_token');
            await storage.removeItem('user_data');

            // Limpa o estado. O RootLayout detectará a mudança e levará ao login.
            setSession(null);
            setUser(null);
        } catch (e) {
            console.error('Erro ao efetuar logout:', e);
        }
    };

    // Atualiza os dados do produtor em memória e no storage (ex.: após editar o perfil).
    const atualizarUsuario = async (produtor: Produtor) => {
        await storage.setItem('user_data', JSON.stringify(produtor));
        setUser(produtor);
    };

    return (
        <AuthContext.Provider value={{ session, user, isLoading, signIn, signOut, atualizarUsuario }}>
            {children}
        </AuthContext.Provider>
    );
}