import { useState, useEffect } from 'react';
import { ApiarioRetornoDTO } from '@/types/apiario';
import api from '../services/api';
import { useAuth } from './useAuth';

export function useApiarios() {
    const [apiarios, setApiarios] = useState<ApiarioRetornoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const { session } = useAuth();

    useEffect(() => {
        const fetchApiarios = async () => {
            try {
                setLoading(true);
                // Usando ID do produtor 1 como padrão para testes de integração
                const produtorId = 1;
                const response = await api.get<ApiarioRetornoDTO[]>(`/apiarios/${produtorId}`);
                setApiarios(response.data);
            } catch (error) {
                console.error('Erro ao buscar apiários:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApiarios();
    }, [session]);

    return { apiarios, loading };
}