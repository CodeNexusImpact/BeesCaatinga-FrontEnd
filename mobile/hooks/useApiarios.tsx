// hooks/useApiarios.tsx
import { useState, useEffect } from 'react';
import { ColmeiaItemProps } from '@/types/Colmeias';
import { ApiarioListProps} from '@/types/Apiarios';

// Dados MOCK: Estrutura idêntica à Interface ApiarioListProps
const MOCK_APIARIOS: ApiarioListProps[] = [
    {
        id: 1,
        nome: "Apiário do Morro",
        colmeiasAtivas: 5,
        colmeiasTotal: 6,
        colmeias: [
            { id: 101, nome: "Colmeia A1", condicao: "Saudavel" },
            { id: 102, nome: "Colmeia B2", condicao: "Pronto para Coleta" }, // Novo Tipo
            { id: 103, nome: "Colmeia C3", condicao: "Manutenção Necessária" }, // Novo Tipo
            { id: 104, nome: "Colmeia D4", condicao: "Tratamento Necessário" }, // Novo Tipo
            { id: 105, nome: "Colmeia E5", condicao: "Perigo Climático" }, // Novo Tipo
            { id: 106, nome: "Colmeia F6", condicao: "Inativa" }, // Novo Tipo
        ] as ColmeiaItemProps[],
    },
    {
        id: 2,
        nome: "Apiário da Várzea",
        colmeiasAtivas: 2,
        colmeiasTotal: 2,
        colmeias: [
            { id: 201, nome: "Colmeia V1", condicao: "Saudavel" },
            { id: 202, nome: "Colmeia V2", condicao: "Pronto para Coleta" },
        ] as ColmeiaItemProps[],
    },
    {
        id: 3,
        nome: "Apiário do Riacho",
        colmeiasAtivas: 2,
        colmeiasTotal: 5,
        colmeias: [
            { id: 301, nome: "Colmeia R1", condicao: "Manutenção Necessária" },
        ] as ColmeiaItemProps[],
    },
];

export function useApiarios() {
    const [apiarios, setApiarios] = useState<ApiarioListProps[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simula a requisição de API com 500ms de delay
        const timer = setTimeout(() => {
            setApiarios(MOCK_APIARIOS);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return { apiarios, loading };
}