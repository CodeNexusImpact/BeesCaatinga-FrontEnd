import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Location from 'expo-location';

import Botao from '@/components/formulario/botao';
import Input from '@/components/formulario/input';
import Selector from '@/components/formulario/selector';
import Subtexto from '@/components/subTexto';
import ImagemPicker from '@/components/formulario/imagemPicker';
import cores from '@/constants/cores';
import layout from '@/constants/layout';
import { useAuth } from '@/hooks/useAuth';
import { listarApiariosPorProdutor } from '@/services/apiarioService';
import { atualizarColmeia, buscarColmeiaPorId } from '@/services/colmeiaService';
import type { ColmeiaAtualizadaDTO, TipoColmeia } from '@/types/apiario/colmeia';
import { voltar } from '@/utils/navegacao';
import { alerta } from '@/utils/alerta';

const tipoOptions = [
  { label: 'Madeira', value: 'MADEIRA' },
  { label: 'Concreto', value: 'CONCRETO' },
  { label: 'Poliestireno', value: 'POLIESTIRENO' },
];

const ativoOptions = [
  { label: 'Sim', value: 'sim' },
  { label: 'Não', value: 'nao' },
];

// Rota: /apiario/colmeia/editar?id=<colmeiaId>[&apiarioId=<apiarioId>]
export default function EditarColmeia() {
  const router = useRouter();
  const { user } = useAuth();
  const params = useLocalSearchParams<{ id?: string; apiarioId?: string }>();
  const colmeiaId = params.id;

  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [apiarioId, setApiarioId] = useState(params.apiarioId ?? '');
  const [nomeApiario, setNomeApiario] = useState('');
  const [identificador, setIdentificador] = useState('');
  const [tipo, setTipo] = useState('');
  const [ativo, setAtivo] = useState('sim');
  const [observacoes, setObservacoes] = useState('');
  const [detalhesDaLocalizacao, setDetalhesDaLocalizacao] = useState('');
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();
  const [foto, setFoto] = useState<string | undefined>();

  useEffect(() => {
    if (!colmeiaId || !user?.id) return;
    let ativoEfeito = true;
    (async () => {
      try {
        const [colmeia, apiarios] = await Promise.all([
          buscarColmeiaPorId(user.id, colmeiaId),
          listarApiariosPorProdutor(user.id),
        ]);
        if (!ativoEfeito) return;
        if (!colmeia) {
          alerta('Erro', 'Colmeia não encontrada.');
          voltar(router);
          return;
        }
        setIdentificador(colmeia.identificador ?? '');
        setNomeApiario(colmeia.nomeApiario ?? '');
        setTipo(colmeia.tipo ?? '');
        setAtivo(colmeia.ativa === false || colmeia.statusColmeia === 'INATIVO' ? 'nao' : 'sim');
        setObservacoes(colmeia.observacoes ?? '');
        setDetalhesDaLocalizacao(colmeia.detalhesDaLocalizacao ?? '');
        setLatitude(colmeia.latitude ?? undefined);
        setLongitude(colmeia.longitude ?? undefined);
        setFoto(colmeia.caminhoDaFoto || undefined);
        // O DTO de retorno não traz apiarioId: resolve pelo nome, se não veio na rota.
        setApiarioId((atual) => atual || String(colmeia.apiarioId ?? apiarios?.find((a) => a.nome === colmeia.nomeApiario)?.id ?? ''));
      } catch {
        if (ativoEfeito) {
          alerta('Erro', 'Não foi possível carregar a colmeia.');
          voltar(router);
        }
      } finally {
        if (ativoEfeito) setCarregando(false);
      }
    })();
    return () => {
      ativoEfeito = false;
    };
  }, [colmeiaId, user?.id, router]);

  const usarLocalizacaoAtual = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alerta('Permissão negada', 'Não foi possível acessar a localização.');
      return;
    }
    const pos = await Location.getCurrentPositionAsync({});
    setLatitude(pos.coords.latitude);
    setLongitude(pos.coords.longitude);
  };

  const handleSalvar = async () => {
    if (!user?.id || !colmeiaId || !apiarioId) {
      alerta('Erro', 'Dados da colmeia incompletos.');
      return;
    }
    setSalvando(true);
    try {
      const dto: ColmeiaAtualizadaDTO = {
        identificador,
        tipo: (tipo || undefined) as TipoColmeia | undefined,
        ativa: ativo === 'sim',
        observacoes,
        detalhesDaLocalizacao,
        caminhoDaFoto: foto,
        latitude,
        longitude,
      };
      await atualizarColmeia(user.id, apiarioId, colmeiaId, dto);
      alerta('Sucesso', 'Colmeia atualizada com sucesso!');
      voltar(router);
    } catch {
      alerta('Erro', 'Não foi possível salvar as alterações.');
    } finally {
      setSalvando(false);
    }
  };

  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={cores.primaria} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Stack.Screen options={{ title: 'Editar Colmeia' }} />

      {/* zIndex decrescente: o dropdown de um Selector precisa ficar acima das seções seguintes. */}
      <View style={[styles.secao, { zIndex: 100 }]}>
        <Subtexto>Dados</Subtexto>
        <Input label="Identificador" placeholder="Ex: Colmeia C-001" value={identificador} onChangeText={setIdentificador} />
        <Input label="Apiário" value={nomeApiario} onChangeText={() => {}} editable={false} />
        <View style={{ zIndex: 20 }}>
          <Selector label="Tipo" options={tipoOptions} value={tipo} onSelect={setTipo} placeholder="Selecione o tipo" iconName="beehiveOutline" />
        </View>
        <View style={{ zIndex: 10 }}>
          <Selector label="Ativo" options={ativoOptions} value={ativo} onSelect={setAtivo} placeholder="Selecione" />
        </View>
      </View>

      <View style={[styles.secao, { zIndex: 1 }]}>
        <Subtexto>Localização</Subtexto>
        <Text style={styles.instrucaoMapa}>
          {latitude !== undefined && longitude !== undefined
            ? `Lat: ${Number(latitude).toFixed(5)}  Long: ${Number(longitude).toFixed(5)}`
            : 'Localização não definida'}
        </Text>
        <Botao title="📍 Usar localização atual" onPress={usarLocalizacaoAtual} cor="secundaria" style={styles.buttonLocalizacao} />
        <Input label="Detalhes da localização" value={detalhesDaLocalizacao} onChangeText={setDetalhesDaLocalizacao} placeholder="Ex.: perto do açude" />
      </View>

      <View style={styles.secao}>
        <Subtexto>Dados Adicionais</Subtexto>
        <Text style={styles.labelFoto}>Foto</Text>
        <ImagemPicker onImagePicked={(uri) => setFoto(uri ?? undefined)} />
        <Input
          label="Observações:"
          placeholder="---"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline={true}
          style={styles.inputObservacoes}
        />
      </View>

      <Botao
        title={salvando ? 'Salvando...' : 'Salvar Alterações'}
        onPress={salvando ? () => {} : handleSalvar}
        cor="primaria"
        style={styles.buttonFinal}
      />
    </ScrollView>
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.cores.base[10],
  },
  contentContainer: {
    padding: layout.espacamento.amigavel,
    gap: layout.espacamento.colega,
  },
  secao: {
    gap: layout.espacamento.amigavel,
  },
  instrucaoMapa: {
    color: cores.texto,
    fontSize: 14,
  },
  mapaPlaceholder: {
    height: 220,
    backgroundColor: '#E0E0E0',
    borderRadius: layout.borderRadius.r25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: cores.borda,
  },
  detalhesLocalizacao: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 5,
  },
  labelFoto: {
    fontSize: 14,
    color: cores.texto,
    marginBottom: -5,
  },
  inputObservacoes: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonLocalizacao: {
    marginTop: 5,
  },
  buttonFinal: {
    marginTop: layout.espacamento.social,
    marginBottom: 20,
  },
});
