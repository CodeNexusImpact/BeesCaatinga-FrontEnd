export interface ColmeiaItemProps {
  id: number;
  nome: string;
  condicao: "Saudavel" | "Pronto para Coleta" | "Manutenção Necessária" | "Tratamento Necessário" | "Perigo Climático" | "Inativa";
}