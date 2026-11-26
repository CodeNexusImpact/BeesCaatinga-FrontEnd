import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import CardNotificacao from '@/components/notificacao/cardNotificacao';
import { EstadoCarregando, EstadoErro, EstadoVazio } from '@/components/graficos';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarColmeiasPorProdutor } from '@/services/colmeiaService';
import { listarInsumos } from '@/services/insumoService';
import { isoParaBr } from '@/utils/datas';

interface Aviso {
  id: string;
  titulo: string;
  mensagem: string;
  rota: string;
  prioridade: number;
}

const DIA = 24 * 60 * 60 * 1000;
const STATUS_ATENCAO: Record<string, string> = {
  TRATAMENTO_NECESSARIO: 'precisa de tratamento',
  MANUTENCAO_NECESSARIA: 'precisa de manutenção',
  PERIGO_CLIMATICO: 'está em perigo climático',
};

/** Avisos calculados a partir dos dados reais do produtor (não há serviço de notificações no backend). */
async function buscarAvisos(produtorId: number): Promise<Aviso[]> {
  const [insumos, colmeias] = await Promise.all([listarInsumos(produtorId), listarColmeiasPorProdutor(produtorId)]);
  const hoje = Date.now();
  const avisos: Aviso[] = [];

  insumos.forEach((i) => {
    if (i.dataValidade) {
      const dias = Math.ceil((new Date(`${i.dataValidade}T00:00:00`).getTime() - hoje) / DIA);
      if (dias < 0) avisos.push({ id: `iv-${i.id}`, titulo: 'Insumo vencido', mensagem: `${i.nome} venceu em ${isoParaBr(i.dataValidade)}.`, rota: `/insumos/${i.id}`, prioridade: 0 });
      else if (dias <= 30)
        avisos.push({ id: `ip-${i.id}`, titulo: 'Insumo perto de vencer', mensagem: `${i.nome} vence em ${dias} dia(s) (${isoParaBr(i.dataValidade)}).`, rota: `/insumos/${i.id}`, prioridade: 1 });
    }
    if (i.statusInsumo === 'ESTOQUE_BAIXO')
      avisos.push({ id: `ie-${i.id}`, titulo: 'Estoque baixo', mensagem: `${i.nome} está com estoque baixo.`, rota: `/insumos/${i.id}`, prioridade: 1 });
  });

  (Array.isArray(colmeias) ? colmeias : []).forEach((c: any) => {
    if (c.ativa === false) return;
    const atencao = STATUS_ATENCAO[c.statusColmeia];
    if (atencao)
      avisos.push({ id: `cs-${c.id}`, titulo: 'Colmeia precisa de atenção', mensagem: `A colmeia ${c.identificador} (${c.nomeApiario}) ${atencao}.`, rota: `/apiario/colmeia/editar?id=${c.id}`, prioridade: 0 });
    const ultima = c.ultimaVistoria ? new Date(`${c.ultimaVistoria}T00:00:00`).getTime() : null;
    if (!ultima)
      avisos.push({ id: `cv-${c.id}`, titulo: 'Colmeia sem vistoria', mensagem: `A colmeia ${c.identificador} ainda não tem vistoria registrada.`, rota: '/vistorias/cadastrar', prioridade: 2 });
    else if (hoje - ultima > 30 * DIA)
      avisos.push({ id: `cv-${c.id}`, titulo: 'Vistoria atrasada', mensagem: `A última vistoria da colmeia ${c.identificador} foi em ${isoParaBr(c.ultimaVistoria)}.`, rota: '/vistorias/cadastrar', prioridade: 2 });
  });

  return avisos.sort((a, b) => a.prioridade - b.prioridade);
}

export default function Notificacoes() {
  const router = useRouter();
  const { dados, carregando, erro, recarregar } = useDadosApi<Aviso[]>(buscarAvisos, []);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Avisos' }} />
      {carregando && dados.length === 0 ? (
        <EstadoCarregando texto="Verificando avisos..." />
      ) : erro ? (
        <EstadoErro mensagem={erro} onTentarNovamente={recarregar} />
      ) : dados.length === 0 ? (
        <EstadoVazio mensagem="Nenhum aviso no momento. Tudo em dia!" />
      ) : (
        <ScrollView contentContainerStyle={styles.lista}>
          {dados.map((a) => (
            <CardNotificacao key={a.id} titulo={a.titulo} mensagem={a.mensagem} naoLida={a.prioridade < 2} onPress={() => router.push(a.rota as any)} style={styles.card} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  lista: { padding: layout.espacamento.colega, paddingBottom: 40 },
  card: { marginBottom: 10 },
});
