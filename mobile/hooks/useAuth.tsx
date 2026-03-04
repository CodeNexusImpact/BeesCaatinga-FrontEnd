import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export function useAuth() {
    // Retorna todos os valores fornecidos pelo AuthProvider
    return useContext(AuthContext);
}