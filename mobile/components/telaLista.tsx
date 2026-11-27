import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import Botao from '@/components/formulario/botao';
import Filtros from '@/components/filtros';
import Tabela, { TabelaColuna } from '@/components/tabela';
import { EstadoCarregando, EstadoErro } from '@/components/graficos';
import cores from '@/constants/cores';
import layout from '@/constants/layout';

// "Cadastrar vistoria" -> "Cadastrar primeira vistoria"; "Cadastrar apiário" -> "Cadastrar primeiro apiário".
const FEMININOS = ['vistoria', 'colmeia', 'produção', 'producao'];
function primeiroCadastro(titulo: string): string {
  const resto = titulo.replace(/^Cadastrar\s+/i, '');
  const feminino = FEMININOS.some((p) => resto.toLowerCase().startsWith(p));
  return `Cadastrar ${feminino ? 'primeira' : 'primeiro'} ${resto}`;
}

interface Props<T extends object> {
  titulo: string;
  cadastrar: { titulo: string; rota: string };
  carregando: boolean;
  erro: string | null;
  onTentarNovamente: () => void;
  filtros?: React.ReactNode[];
  colunas: TabelaColuna<T>[];
  dados: T[];
  total: number;
  vazio: string;
  onPressLinha: (item: T) => void;
}

/** Listagem padrão: botão de cadastro, filtros e a Tabela compartilhada (cartões no celular). */
export default function TelaLista<T extends object>(p: Props<T>) {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: p.titulo }} />
      <Botao title={p.cadastrar.titulo} iconName="add" onPress={() => router.push(p.cadastrar.rota as any)} cor="primaria" />
      {p.carregando && p.total === 0 ? (
        <EstadoCarregando />
      ) : p.erro ? (
        <EstadoErro mensagem={p.erro} onTentarNovamente={p.onTentarNovamente} />
      ) : (
        <>
          {p.total > 0 && p.filtros?.length ? <Filtros resumo={`${p.dados.length} de ${p.total} registro(s)`}>{p.filtros}</Filtros> : null}
          <Tabela
            colunas={p.colunas}
            data={p.dados}
            vazio={p.total ? 'Nenhum registro para estes filtros.' : p.vazio}
            acaoVazio={p.total ? undefined : { titulo: primeiroCadastro(p.cadastrar.titulo), onPress: () => router.push(p.cadastrar.rota as any) }}
            onPressLinha={p.onPressLinha}
          />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: layout.espacamento.colega, gap: 14, paddingBottom: 40, width: '100%', maxWidth: 1200, alignSelf: 'center' },
});
