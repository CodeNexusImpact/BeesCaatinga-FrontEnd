import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import Mapa from '@/components/mapa/mapa';
import SeletorLocalizacao, { Coordenada } from '@/components/mapa/seletorLocalizacao';
import Selector from '@/components/formulario/selector';
import Botao from '@/components/formulario/botao';
import { EstadoCarregando, EstadoErro } from '@/components/graficos';
import { COR_TIPO, validarCoordenadas } from '@/components/mapa/mapaComum';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useDadosApi } from '@/hooks/useDadosApi';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import {
  atualizarLocalizacaoApiario,
  buscarLocalizacoesApiarios,
  buscarLocalizacoesPropriedades,
  buscarLocalizacoesVistorias,
} from '@/services/mapaService';
import type { ApiarioRetornoDTO } from '@/types/apiario';
import type { LocalizacaoMapa } from '@/types/mapa/mapaLocalizacao';
import { alerta } from '@/utils/alerta';
import { mensagemDeErro } from '@/utils/erros';

type Camada = 'apiario' | 'vistoria' | 'propriedade';
const CAMADAS: { tipo: Camada; rotulo: string }[] = [
  { tipo: 'apiario', rotulo: 'Apiários' },
  { tipo: 'vistoria', rotulo: 'Vistorias' },
  { tipo: 'propriedade', rotulo: 'Propriedades' },
];

interface DadosMapa {
  apiarios: ApiarioRetornoDTO[];
  pontos: Record<Camada, LocalizacaoMapa[]>;
}

const buscar = async (id: number): Promise<DadosMapa> => {
  const [apiarios, ap, vi, pr] = await Promise.all([
    listarApiariosPorProdutor(id),
    buscarLocalizacoesApiarios(id),
    buscarLocalizacoesVistorias(id),
    buscarLocalizacoesPropriedades(id),
  ]);
  return { apiarios, pontos: { apiario: ap, vistoria: vi, propriedade: pr } };
};

export default function TelaMapa() {
  const params = useLocalSearchParams<{ apiarioId?: string }>();
  const { dados, carregando, erro, recarregar, produtorId } = useDadosApi<DadosMapa>(buscar, {
    apiarios: [],
    pontos: { apiario: [], vistoria: [], propriedade: [] },
  });
  const [visiveis, setVisiveis] = useState<Record<Camada, boolean>>({ apiario: true, vistoria: true, propriedade: true });
  const [apiarioEscolhido, setApiarioEscolhido] = useState<string | null>(null);
  const apiarioId = apiarioEscolhido ?? params.apiarioId ?? '';
  const [novoLocal, setNovoLocal] = useState<Coordenada | null>(null);
  const [salvando, setSalvando] = useState(false);

  const pontos = useMemo(
    () => CAMADAS.filter((c) => visiveis[c.tipo]).flatMap((c) => dados.pontos[c.tipo]),
    [dados, visiveis],
  );
  const apiario = dados.apiarios.find((a) => String(a.id) === String(apiarioId));

  const escolherApiario = useCallback(
    (id: string) => {
      setApiarioEscolhido(id);
      const a = dados.apiarios.find((x) => String(x.id) === id);
      setNovoLocal(a && a.latitude != null && a.longitude != null ? { latitude: Number(a.latitude), longitude: Number(a.longitude) } : null);
    },
    [dados.apiarios],
  );

  const salvar = async () => {
    if (!apiario || !novoLocal) {
      alerta('Atenção', 'Escolha o apiário e o local no mapa.');
      return;
    }
    const msg = validarCoordenadas(novoLocal.latitude, novoLocal.longitude);
    if (msg) {
      alerta('Atenção', msg);
      return;
    }
    try {
      setSalvando(true);
      await atualizarLocalizacaoApiario(apiario.id, novoLocal.latitude, novoLocal.longitude, produtorId ?? undefined);
      alerta('Sucesso', `Localização do apiário "${apiario.nome}" salva.`);
      await recarregar();
    } catch (e) {
      alerta('Erro', mensagemDeErro(e, 'Não foi possível salvar a localização.'));
    } finally {
      setSalvando(false);
    }
  };

  if (carregando && dados.apiarios.length === 0) return <EstadoCarregando texto="Carregando mapa..." />;
  if (erro) return <EstadoErro mensagem={erro} onTentarNovamente={recarregar} />;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled">
      <Stack.Screen options={{ title: 'Mapa' }} />

      <View style={styles.camadas}>
        {CAMADAS.map((c) => (
          <TouchableOpacity
            key={c.tipo}
            onPress={() => setVisiveis((v) => ({ ...v, [c.tipo]: !v[c.tipo] }))}
            style={[styles.chip, { borderColor: COR_TIPO[c.tipo], backgroundColor: visiveis[c.tipo] ? COR_TIPO[c.tipo] : '#fff' }]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: visiveis[c.tipo] }}
            accessibilityLabel={`Mostrar ${c.rotulo}`}
          >
            <Text style={[styles.chipTexto, { color: visiveis[c.tipo] ? '#fff' : COR_TIPO[c.tipo] }]}>
              {c.rotulo} ({dados.pontos[c.tipo].length})
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Mapa localizacoes={pontos} onMarkerPress={(l) => l.tipo === 'apiario' && escolherApiario(String(l.id))} style={styles.mapa} />
      {pontos.length === 0 && <Text style={styles.vazio}>Nenhum ponto com localização cadastrada ainda.</Text>}

      <View style={styles.card}>
        <Text style={styles.titulo}>Definir localização de um apiário</Text>
        {dados.apiarios.length === 0 ? (
          <Text style={styles.vazio}>Nenhum apiário cadastrado ainda.</Text>
        ) : (
          <>
            <Selector
              label="Apiário"
              placeholder="Selecione o apiário"
              options={dados.apiarios.map((a) => ({ label: a.nome, value: String(a.id) }))}
              onSelect={escolherApiario}
              value={apiarioId}
            />
            {apiario && (
              <>
                <SeletorLocalizacao
                  valor={novoLocal}
                  onChange={setNovoLocal}
                  referencias={dados.pontos.apiario.filter((p) => String(p.id) !== String(apiario.id))}
                />
                <Botao title={salvando ? 'Salvando...' : 'Salvar localização'} onPress={salvar} cor="primaria" />
              </>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: cores.fundo },
  conteudo: { padding: layout.espacamento.colega, gap: layout.espacamento.colega, paddingBottom: 40 },
  camadas: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 2, borderRadius: 999, paddingHorizontal: 14, minHeight: 44, justifyContent: 'center' },
  chipTexto: { fontWeight: 'bold', fontSize: 14 },
  mapa: { minHeight: 320 },
  card: { backgroundColor: cores.branco, borderRadius: 16, padding: 16, gap: 12, elevation: 2, boxShadow: '0px 2px 4px rgba(0,0,0,0.12)' },
  titulo: { fontSize: 16, fontWeight: 'bold', color: cores.texto },
  vazio: { color: '#666', textAlign: 'center' },
});
