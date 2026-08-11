import { useState, useEffect } from 'react';
import { ApiarioRetornoDTO } from '@/types/apiario';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import { useAuth } from '@/hooks/useAuth';

export function useApiarios() {
    const [apiarios, setApiarios] = useState<ApiarioRetornoDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const { user, session } = useAuth();

    useEffect(() => {
        const fetchApiarios = async () => {
            if (!user?.id || !session) return;
            
            const idDoProdutor = Number(user.id);
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

        fetchApiarios();
    }, [session, user?.id]);

    return { apiarios, loading };
}