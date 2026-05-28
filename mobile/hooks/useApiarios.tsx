import { useState, useEffect } from 'react';
import { ApiarioRetornoDTO } from '@/types/apiario';
import { listarApiariosPorProdutor } from '../services/apiarioService';
import { useAuth } from './useAuth';

export function useApiarios() {
    const [apiarios, setApiarios] = useState<ApiarioRetornoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, session } = useAuth();

    useEffect(() => {
        const fetchApiarios = async () => {
            // Fallback seguro para evitar produtorId=NaN no terminal
            const idDoProdutor = user?.id ? Number(user.id) : 1;
            
            if (isNaN(idDoProdutor)) return;

            try {
                setLoading(true);
                const data = await listarApiariosPorProdutor(idDoProdutor);
                setApiarios(data);
            } catch (error) {
                console.error('Erro ao buscar apiários:', error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchApiarios();
        }
    }, [session, user?.id]);

    return { apiarios, loading };
}