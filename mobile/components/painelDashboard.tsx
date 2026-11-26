import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import GraficoCard, { KpiData } from '@/components/graficoCard';
import { EstadoCarregando, EstadoErro, EstadoVazio } from '@/components/graficos';

interface Props {
  titulo: string;
  subtitulo: string;
  carregando: boolean;
  erro: string | null;
  vazio: boolean;
  mensagemVazio: string;
  /** Botão do estado vazio, ex.: { titulo: 'Cadastrar primeiro apiário', rota: '/apiario/cadastrar' }. */
  acaoVazio?: { titulo: string; rota: string };
  onTentarNovamente: () => void;
  filtros?: React.ReactNode;
  kpis: KpiData[];
  children?: React.ReactNode;
}

/** Estrutura comum dos dashboards: título, filtros, KPIs e gráficos, com estados de carregamento/erro/vazio. */
export default function PainelDashboard({ titulo, subtitulo, carregando, erro, vazio, mensagemVazio, acaoVazio, onTentarNovamente, filtros, kpis, children }: Props) {
  const router = useRouter();
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <Stack.Screen options={{ title: titulo }} />
      {carregando ? (
        <EstadoCarregando texto="Carregando dashboard..." />
      ) : erro ? (
        <EstadoErro mensagem={erro} onTentarNovamente={onTentarNovamente} />
      ) : vazio ? (
        <EstadoVazio mensagem={mensagemVazio} acao={acaoVazio && { titulo: acaoVazio.titulo, onPress: () => router.push(acaoVazio.rota as any) }} />
      ) : (
        <>
          {filtros ? <View style={styles.filtros}>{filtros}</View> : null}
          <GraficoCard subtexto={subtitulo} kpis={kpis} showSideBar>
            <View style={styles.graficos}>{children}</View>
          </GraficoCard>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: layout.espacamento.colega, gap: layout.espacamento.colega, paddingBottom: 40 },
  filtros: { zIndex: 100, gap: 8 },
  graficos: { gap: 16 },
});
