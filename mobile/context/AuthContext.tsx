import React, { createContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import api from '../services/api';
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

// Definição do tipo do Produtor
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
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    isLoading: true,
    signIn: async () => {},
    signOut: async () => {},
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
        try {
            const response = await api.post<Produtor>('/login', { email, senha });
            const produtor = response.data;
            
            const token = produtor.id.toString();

            await storage.setItem('user_token', token);
            await storage.setItem('user_data', JSON.stringify(produtor));

            setSession(token);
            setUser(produtor);
            
            console.log('Login bem-sucedido:', produtor.nomeCompleto);
        } catch (error) {
            console.error('Erro no login:', error);
            throw new Error('E-mail ou senha inválidos');
        }
    };

    const signOut = async () => {
        await storage.removeItem('user_token');
        await storage.removeItem('user_data');
        setSession(null);
        setUser(null);
        console.log('Logout efetuado!');
    };

    return (
        <AuthContext.Provider value={{ session, user, isLoading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}