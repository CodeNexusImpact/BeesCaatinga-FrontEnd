// hooks/useApiarios.tsx
import { useState, useEffect } from 'react';
import { ApiarioRetornoDTO } from '@/types/apiario';
import { ColmeiaRetornoEmApiarioDTO, StatusColmeia } from '@/types/apiario/colmeia';

// Dados MOCK: Estrutura baseada no ApiarioRetornoDTO
const MOCK_APIARIOS: ApiarioRetornoDTO[] = [
    {
        id: 1,
        nome: "Apiário do Morro",
        nRegistro: "REG-001",
        dataDeCriacao: "2023-01-15",
        cep: "59000-000",
        nomeDaPropriedade: "Fazenda Morro",
        estado: "RN",
        cidade: "Mossoró",
        bairro: "Zona Rural",
        rua: "Estrada Principal",
        numero: "S/N",
        complemento: "",
        observacoes: "Apiário principal",
        caminhoDaFoto: "",
        colmeias: [
            { id: 1, identificador: "Colmeia A1", statusColmeia: "SAUDAVEL" },
            { id: 2, identificador: "Colmeia B2", statusColmeia: "SAUDAVEL" }, // SAUDAVEL (Era Pronto para Coleta)
            { id: 3, identificador: "Colmeia C3", statusColmeia: "MANUTENCAO_NECESSARIA" },
            { id: 4, identificador: "Colmeia D4", statusColmeia: "TRATAMENTO_NECESSARIO" },
            { id: 5, identificador: "Colmeia E5", statusColmeia: "PERIGO_CLIMATICO" },
            { id: 6, identificador: "Colmeia F6", statusColmeia: "INATIVO" },
        ] as ColmeiaRetornoEmApiarioDTO[],
    },
    {
        id: 2,
        nome: "Apiário da Várzea",
        nRegistro: "REG-002",
        dataDeCriacao: "2023-02-20",
        cep: "59000-000",
        nomeDaPropriedade: "Sítio Várzea",
        estado: "RN",
        cidade: "Apodi",
        bairro: "Zona Rural",
        rua: "BR 405",
        numero: "Km 10",
        complemento: "",
        observacoes: "",
        caminhoDaFoto: "",
        colmeias: [
            { id: 7, identificador: "Colmeia V1", statusColmeia: "SAUDAVEL" },
            { id: 8, identificador: "Colmeia V2", statusColmeia: "SAUDAVEL" },
        ] as ColmeiaRetornoEmApiarioDTO[],
    },
    {
        id: 3,
        nome: "Apiário do Riacho",
        nRegistro: "REG-003",
        dataDeCriacao: "2023-03-10",
        cep: "59000-000",
        nomeDaPropriedade: "Fazenda Riacho",
        estado: "RN",
        cidade: "Assú",
        bairro: "Zona Rural",
        rua: "RN 010",
        numero: "",
        complemento: "",
        observacoes: "",
        caminhoDaFoto: "",
        colmeias: [
            { id: 9, identificador: "Colmeia R1", statusColmeia: "MANUTENCAO_NECESSARIA" },
        ] as ColmeiaRetornoEmApiarioDTO[],
    },
];

export function useApiarios() {
    const [apiarios, setApiarios] = useState<ApiarioRetornoDTO[]>([]);
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